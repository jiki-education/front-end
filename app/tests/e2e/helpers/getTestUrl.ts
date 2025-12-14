export function getTestUrl(path = "") {
  const baseUrl = process.env.TEST_URL || "http://local.jiki.io:3081";
  return `${baseUrl}${path}`;
}
