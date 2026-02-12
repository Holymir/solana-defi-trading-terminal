import { MetricsStore } from "@sol-trading/db";
import { normalizeSyntheticEvents } from "@sol-trading/parsers";
import { logInfo } from "@sol-trading/utils";

const SLOT_INTERVAL_MS = Number(process.env.SLOT_INTERVAL_MS ?? 2000);

async function main(): Promise<void> {
  const store = new MetricsStore();
  let slot = Math.max(store.load().lastSlot, 1);

  logInfo("Indexer started", { slot, slotIntervalMs: SLOT_INTERVAL_MS });

  setInterval(() => {
    const signature = `mock-signature-${slot}`;
    const blockTime = Math.floor(Date.now() / 1000);
    const events = normalizeSyntheticEvents({ slot, signature, blockTime });
    const metrics = store.apply(events, slot);

    logInfo("Processed slot", {
      slot,
      events: events.length,
      totals: {
        totalEvents: metrics.totalEvents,
        swaps: metrics.swaps,
        transfers: metrics.transfers,
        launches: metrics.launches
      }
    });

    slot += 1;
  }, SLOT_INTERVAL_MS);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});