/* Local dev server. Serves the app and accepts test uploads so automated
   checks can hand recorded blobs back to the file system for ffprobe.
   Not deployed — GitHub Pages serves the static files in production. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "test-output");
const PORT = process.env.PORT || 8123;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".json": "application/json",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8"
};

http.createServer((req, res) => {
  const u = new URL(req.url, "http://localhost");

  // CORS so the deployed (github.io) copy can hand test blobs back to us
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.method === "POST" && u.pathname === "/__test/save") {
    const name = path.basename(u.searchParams.get("name") || "out.mp4");
    fs.mkdirSync(OUT, { recursive: true });
    const file = fs.createWriteStream(path.join(OUT, name));
    let bytes = 0;
    req.on("data", d => { bytes += d.length; });
    req.pipe(file);
    file.on("finish", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, name, bytes }));
    });
    file.on("error", () => { res.writeHead(500); res.end("write error"); });
    return;
  }

  let p = decodeURIComponent(u.pathname);
  if (p === "/") p = "/index.html";
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end("not found"); return;
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`dev server on http://localhost:${PORT}`));
