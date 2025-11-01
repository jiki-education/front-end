export function getTestUrl(path = "") {
  const baseUrl = process.env.TEST_URL || "http://localhost:3081";
  return `${baseUrl}${path}`;
}
