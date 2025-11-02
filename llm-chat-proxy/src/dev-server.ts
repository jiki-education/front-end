import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import app from "./index";

// Load environment variables from .dev.vars file
dotenv.config({ path: ".dev.vars" });

// Validate required environment variables
const requiredEnvVars = ["GOOGLE_GEMINI_API_KEY", "DEVISE_JWT_SECRET_KEY", "LLM_SIGNATURE_SECRET"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error("Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`  - ${varName}`));
  console.error("\nPlease create a .dev.vars file with these variables.");
  console.error("See .dev.vars.example for reference.");
  process.exit(1);
}

const port = 3063;

console.log(`Starting LLM Chat Proxy development server on port ${port}...`);
console.log(`JWT Secret loaded: ${process.env.DEVISE_JWT_SECRET_KEY?.substring(0, 20)}...`);

serve({
  fetch: app.fetch,
  port
});

console.log(`Server running at http://localhost:${port}`);
console.log(`Health check: http://localhost:${port}/health`);
