import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import { IndexerMetrics, NormalizedEvent } from "@sol-trading/types";

const initialMetrics: IndexerMetrics = {
  lastSlot: 0,
  totalEvents: 0,
  swaps: 0,
  transfers: 0,
  launches: 0,
  candles: {},
  updatedAt: new Date(0).toISOString()
};

export class MetricsStore {
  constructor(private readonly filePath = "infra/state/metrics.json") {}

  load(): IndexerMetrics {
    const absolutePath = resolve(this.filePath);
    if (!existsSync(absolutePath)) {
      return { ...initialMetrics };
    }

    return JSON.parse(readFileSync(absolutePath, "utf8")) as IndexerMetrics;
  }

  apply(events: NormalizedEvent[], slot: number): IndexerMetrics {
    const current = this.load();

    for (const event of events) {
      current.totalEvents += 1;
      if (event.type === "swap") {
        current.swaps += 1;
        const minuteBucket = Math.floor(event.blockTime / 60) * 60;
        const key = `${event.outputMint}:${minuteBucket}`;
        const price = event.outputAmount / event.inputAmount;
        const existing = current.candles[key];
        if (!existing) {
          current.candles[key] = {
            key,
            startTs: minuteBucket,
            open: price,
            high: price,
            low: price,
            close: price,
            volume: event.outputAmount
          };
        } else {
          existing.high = Math.max(existing.high, price);
          existing.low = Math.min(existing.low, price);
          existing.close = price;
          existing.volume += event.outputAmount;
        }
      }
      if (event.type === "transfer") {
        current.transfers += 1;
      }
      if (event.type === "token_launch") {
        current.launches += 1;
      }
    }

    current.lastSlot = slot;
    current.updatedAt = new Date().toISOString();

    const absolutePath = resolve(this.filePath);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, JSON.stringify(current, null, 2), "utf8");

    return current;
  }
}