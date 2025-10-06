import { spawn } from "child_process";

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
    }, 5000);
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
    }, 5000);
  });
}
