import express from "express";
import { MetricsStore } from "@sol-trading/db";
import { logInfo } from "@sol-trading/utils";

const PORT = Number(process.env.PORT ?? 3000);

function main(): void {
  const app = express();
  const store = new MetricsStore();

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "api", time: new Date().toISOString() });
  });

  app.get("/metrics", (_req, res) => {
    res.json(store.load());
  });

  app.listen(PORT, () => {
    logInfo("API started", { port: PORT });
  });
}

main();