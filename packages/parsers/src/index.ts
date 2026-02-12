import { NormalizedEvent } from "@sol-trading/types";

interface ParseContext {
  slot: number;
  signature: string;
  blockTime: number;
}

export function normalizeSyntheticEvents(context: ParseContext): NormalizedEvent[] {
  const base = {
    slot: context.slot,
    signature: context.signature,
    blockTime: context.blockTime
  };

  const events: NormalizedEvent[] = [
    {
      id: `${context.signature}-swap`,
      type: "swap",
      protocol: "raydium",
      inputMint: "So11111111111111111111111111111111111111112",
      outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      inputAmount: 0.4,
      outputAmount: 76,
      trader: "mock-trader",
      ...base
    },
    {
      id: `${context.signature}-transfer`,
      type: "transfer",
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      amount: 12,
      from: "mock-source-wallet",
      to: "mock-target-wallet",
      ...base
    }
  ];

  if (context.slot % 5 === 0) {
    events.push({
      id: `${context.signature}-launch`,
      type: "token_launch",
      protocol: "pumpfun",
      mint: `pump-${context.slot}`,
      creator: "mock-creator-wallet",
      ...base
    });
  }

  return events;
}