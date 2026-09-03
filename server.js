import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = "https://liteai.in/api/create";

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.post("/api/shorten", async (req, res) => {
  try {
    const { long_url } = req.body || {};

    if (!long_url || typeof long_url !== "string") {
      return res.status(400).json({ error: "Please provide a valid URL." });
    }

    let parsed;
    try {
      parsed = new URL(long_url);
    } catch {
      return res.status(400).json({ error: "Invalid URL." });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({ error: "Only HTTP and HTTPS URLs are supported." });
    }

    const key = process.env.LITEAI_API_KEY;
    if (!key) {
      return res.status(500).json({
        error: "LITEAI_API_KEY is not configured on the server."
      });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ long_url: parsed.toString() })
    });

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error || data?.message || "LiteAI API request failed.",
        details: data
      });
    }

    // Be tolerant of common response formats.
    const shortUrl =
      data?.short_url ||
      data?.shortUrl ||
      data?.url ||
      data?.short ||
      data?.data?.short_url ||
      data?.data?.shortUrl ||
      data?.data?.url ||
      data?.data?.short ||
      (typeof data?.data === "string" ? data.data : null);

    return res.json({
      success: true,
      short_url: shortUrl || null,
      source_url: parsed.toString(),
      provider_response: data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Could not contact the URL shortening service.",
      details: error.message
    });
  }
});

app.get("*splat", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`URL Shortener running at http://localhost:${PORT}`);
});