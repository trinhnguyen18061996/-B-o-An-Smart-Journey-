import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store for device synchronization (with code mapping)
const syncDatabase: Record<string, { data: unknown; updatedAt: string }> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Save sync data
  app.post("/api/sync/save", (req, res) => {
    try {
      const { syncCode, payload } = req.body;
      if (!syncCode || !payload) {
        return res.status(400).json({ success: false, message: "Missing syncCode or payload" });
      }
      const code = String(syncCode).trim().toUpperCase();
      syncDatabase[code] = {
        data: payload,
        updatedAt: new Date().toISOString(),
      };
      return res.json({ success: true, code, updatedAt: syncDatabase[code].updatedAt });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Internal Error";
      return res.status(500).json({ success: false, message: msg });
    }
  });

  // Load sync data
  app.get("/api/sync/load/:code", (req, res) => {
    try {
      const code = String(req.params.code).trim().toUpperCase();
      const record = syncDatabase[code];
      if (!record) {
        return res.status(404).json({ success: false, message: "Sync code not found or expired" });
      }
      return res.json({ success: true, data: record.data, updatedAt: record.updatedAt });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Internal Error";
      return res.status(500).json({ success: false, message: msg });
    }
  });

  // Static files in public directory (og-image.jpg, favicon, etc.)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
