import { jwtVerify } from "jose";
import dotenv from "dotenv";

// Load .dev.vars
dotenv.config({ path: ".dev.vars" });

const token = process.argv[2];

if (!token) {
  console.error("Usage: node test-jwt.js YOUR_TOKEN_HERE");
  process.exit(1);
}

const secret = process.env.DEVISE_JWT_SECRET_KEY;

console.log("Secret (first 20 chars):", secret?.substring(0, 20) + "...");
console.log("Token (first 30 chars):", token.substring(0, 30) + "...");
console.log("");

try {
  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"]
  });

  console.log("✅ Token verified successfully!");
  console.log("User ID:", payload.sub);
  console.log("Full payload:", payload);
} catch (error) {
  console.error("❌ Verification failed:", error.message);
  console.error("Error code:", error.code);
}
