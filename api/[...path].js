const DEFAULT_API_BASE_URL = "https://nonfissile-pomaceous-anita.ngrok-free.dev";

const getBody = async (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

export default async function handler(req, res) {
  const apiBaseUrl = process.env.VITE_API_BASE_URL || process.env.VITE_API_URL || DEFAULT_API_BASE_URL;
  const path = Array.isArray(req.query.path) ? req.query.path.join("/") : req.query.path || "";
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query)) {
    if (key === "path") continue;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else if (value !== undefined) {
      query.set(key, value);
    }
  }

  const targetUrl = `${apiBaseUrl.replace(/\/$/, "")}/api/${path}${query.size ? `?${query.toString()}` : ""}`;
  const body = ["GET", "HEAD"].includes(req.method || "") ? undefined : await getBody(req);
  const headers = {
    "content-type": req.headers["content-type"] || "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization;
  }

  if (req.headers["accept-language"]) {
    headers["accept-language"] = req.headers["accept-language"];
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });
    const responseBody = Buffer.from(await response.arrayBuffer());

    res.status(response.status);
    res.setHeader("content-type", response.headers.get("content-type") || "application/json");
    res.send(responseBody);
  } catch (error) {
    res.status(502).json({
      message: "Backend API is unavailable",
      detail: error instanceof Error ? error.message : "Unknown proxy error",
    });
  }
}
