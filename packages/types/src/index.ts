export type EventType = "swap" | "transfer" | "token_launch";

export interface BaseEvent {
  id: string;
  slot: number;
  signature: string;
  blockTime: number;
  type: EventType;
}

export interface SwapEvent extends BaseEvent {
  type: "swap";
  protocol: "raydium";
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  outputAmount: number;
  trader: string;
}

export interface TransferEvent extends BaseEvent {
  type: "transfer";
  mint: string;
  amount: number;
  from: string;
  to: string;
}

export interface TokenLaunchEvent extends BaseEvent {
  type: "token_launch";
  protocol: "pumpfun";
  mint: string;
  creator: string;
}

export type NormalizedEvent = SwapEvent | TransferEvent | TokenLaunchEvent;

export interface OhlcvCandle {
  key: string;
  startTs: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndexerMetrics {
  lastSlot: number;
  totalEvents: number;
  swaps: number;
  transfers: number;
  launches: number;
  candles: Record<string, OhlcvCandle>;
  updatedAt: string;
}