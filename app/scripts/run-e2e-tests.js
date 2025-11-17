#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

const { spawn, execSync } = require("child_process");
const waitOn = require("wait-on");
const fs = require("fs");
const path = require("path");

const PORT = 3081;
const SERVER_URL = `http://localhost:${PORT}`;

/**
 * Recursively find all page.tsx/page.ts files in a directory
 * and convert them to route paths
 */
function discoverRoutes(dir, baseDir = dir) {
  const routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      routes.push(...discoverRoutes(fullPath, baseDir));
    } else if (entry.name === "page.tsx" || entry.name === "page.ts") {
      // Convert file path to route path
      const relativePath = path.relative(baseDir, dir);
      const route = "/" + relativePath.replace(/\\/g, "/");
      routes.push(route);
    }
  }

  return routes;
}

function killPort(port) {
  try {
    // Find process using the port
    const result = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
    if (result) {
      const pids = result.split("\n");
      pids.forEach((pid) => {
        console.log(`Killing existing process ${pid} on port ${port}`);
        try {
          process.kill(pid, "SIGTERM");
        } catch (_e) {
          // Process might have already exited
        }
      });
      // Give it a moment to die
      execSync("sleep 1");
    }
  } catch (_e) {
    // No process found on port, that's fine
  }
}

async function runE2ETests() {
  // Kill any existing process on the port first
  killPort(PORT);

  console.log("Starting Next.js dev server on port", PORT);

  // Start the dev server
  const serverProcess = spawn("pnpm", ["next", "dev", "--port", PORT.toString()], {
    stdio: "pipe",
    env: {
      ...process.env,
      NODE_ENV: "test"
    }
  });

  // Capture server output for debugging
  serverProcess.stdout.on("data", (data) => {
    const output = data.toString();
    if (process.env.DEBUG || output.includes("Ready")) {
      console.log(`Server: ${output.trim()}`);
    }
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`Server Error: ${data}`);
  });

  try {
    // Wait for server to be ready
    console.log("Waiting for server to be ready...");
    await waitOn({
      resources: [SERVER_URL],
      timeout: 30000,
      interval: 1000
    });
    console.log("Server is ready!");

    // Warm up routes to trigger Next.js compilation
    console.log("Warming up routes...");

    // Auto-discover test routes
    const testRoutes = discoverRoutes(path.join(__dirname, "..", "app", "test"));

    // Include common auth routes that tests use
    const authRoutes = ["/", "/auth/login", "/auth/signup"];

    const routesToWarm = [...authRoutes, ...testRoutes];

    for (const route of routesToWarm) {
      try {
        await fetch(`${SERVER_URL}${route}`);
      } catch (err) {
        // Ignore errors during warmup
      }
    }
    console.log(`Routes warmed up! (${routesToWarm.length} routes)`);

    // Run the E2E tests
    console.log("Running E2E tests...");
    const testProcess = spawn("pnpm", ["jest", "--config", "jest.e2e.config.mjs", ...process.argv.slice(2)], {
      stdio: "inherit",
      env: {
        ...process.env,
        TEST_URL: SERVER_URL,
        SKIP_SERVER: "true"
      }
    });

    return await new Promise((resolve) => {
      testProcess.on("close", (code) => {
        resolve(code);
      });
    });
  } finally {
    // Kill the server
    console.log("\nStopping server...");
    if (serverProcess) {
      serverProcess.kill("SIGTERM");

      // Give it a moment to shut down gracefully
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force kill if still running
      try {
        process.kill(serverProcess.pid);
      } catch (_e) {
        // Already dead
      }
    }

    // Also ensure port is free
    killPort(PORT);
  }
}

// Handle interrupts gracefully
process.on("SIGINT", () => {
  console.log("\nInterrupted. Cleaning up...");
  killPort(PORT);
  process.exit(130);
});

process.on("SIGTERM", () => {
  console.log("\nTerminated. Cleaning up...");
  killPort(PORT);
  process.exit(143);
});

runE2ETests()
  .then((exitCode) => {
    process.exit(exitCode || 0);
  })
  .catch((err) => {
    console.error("Failed to run E2E tests:", err);
    killPort(PORT);
    process.exit(1);
  });
