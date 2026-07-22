import { spawn } from "child_process";

// Each cross-validation test spawns a fresh native subprocess; a cold start
// under load (e.g. many running in parallel in the pre-commit hook) can exceed
// 5s. Give the spawn a little more headroom before we kill it.
const NATIVE_PROCESS_TIMEOUT_MS = 6000;

/**
 * Execute native Python code and return the output
 */
export async function executeNativePython(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("python3", ["-c", code]);
    let stdout = "";
    let stderr = "";

    process.stdout.on("data", data => {
      stdout += data.toString();
    });

    process.stderr.on("data", data => {
      stderr += data.toString();
    });

    process.on("error", error => {
      reject(new Error(`Failed to spawn Python process: ${error.message}`));
    });

    process.on("close", exitCode => {
      if (exitCode === 0) {
        resolve(stdout);
      } else {
        // For non-zero exit codes, return stderr (for errors like ValueError)
        // If no stderr, return a generic error message
        resolve(stderr || `Process exited with code ${exitCode}`);
      }
    });

    // Set a timeout to prevent hanging tests
    setTimeout(() => {
      process.kill();
      reject(new Error("Python process timed out"));
    }, NATIVE_PROCESS_TIMEOUT_MS);
  });
}

/**
 * Execute native JavaScript (Node.js) code and return the output
 */
export async function executeNativeJS(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("node", ["-e", code]);
    let stdout = "";
    let stderr = "";

    process.stdout.on("data", data => {
      stdout += data.toString();
    });

    process.stderr.on("data", data => {
      stderr += data.toString();
    });

    process.on("error", error => {
      reject(new Error(`Failed to spawn Node process: ${error.message}`));
    });

    process.on("close", exitCode => {
      if (exitCode === 0) {
        resolve(stdout);
      } else {
        // For non-zero exit codes, return stderr (for runtime errors)
        resolve(stderr || `Process exited with code ${exitCode}`);
      }
    });

    // Set a timeout to prevent hanging tests
    setTimeout(() => {
      process.kill();
      reject(new Error("Node process timed out"));
    }, NATIVE_PROCESS_TIMEOUT_MS);
  });
}
