let rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "");
if (rawUrl && !rawUrl.startsWith("http")) {
  rawUrl = `https://${rawUrl}`;
}
export const API_URL = rawUrl;
