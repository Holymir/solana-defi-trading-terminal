# Solana DeFi Trading Terminal

High-performance Solana on-chain data indexer and DeFi trading analytics platform.

## Overview

This project builds a production-grade blockchain data pipeline that:

- Streams Solana blocks in real time
- Parses and normalizes on-chain transactions
- Indexes swaps, transfers, and token launches
- Aggregates OHLCV market data
- Exposes trading and analytics APIs

## Architecture

Solana RPC / Geyser
-> Slot Streamer
-> Block Fetcher
-> Transaction Parser
-> Event Normalizer
-> Kafka / Redpanda
-> PostgreSQL + ClickHouse
-> REST / WebSocket API
-> Trading Frontend

## MVP Scope

Supported protocols:

- Raydium swaps
- Pump.fun token launches
- SPL token transfers

Core features:

- Real-time swap tracking
- 1m OHLCV candles
- Wallet PnL tracking
- Leaderboard analytics

## Project Structure

- `apps/indexer`: Slot stream + parsing + indexing loop
- `apps/api`: REST service exposing health and metrics
- `apps/websocket`: WebSocket app scaffold
- `apps/frontend`: Frontend scaffold
- `packages/types`: Shared event and metrics types
- `packages/parsers`: Event normalization layer (currently synthetic)
- `packages/db`: Metrics persistence (currently JSON file)
- `packages/utils`: Shared logging helpers
- `infra`: Docker Compose for infra services

## Implementation Steps

1. Bootstrap monorepo workspace and TypeScript base config. (Completed)
2. Create shared packages for types, parsers, db, and utils. (Completed)
3. Implement indexer service with slot processing loop. (Completed)
4. Implement API service exposing `/health` and `/metrics`. (Completed)
5. Add Docker Compose scaffold for PostgreSQL, Redis, Redpanda. (Completed)
6. Replace synthetic parser with real Solana transaction decoding. (Next)
7. Persist events/candles to PostgreSQL + ClickHouse. (Next)
8. Add WebSocket live stream and frontend dashboard. (Next)

## Current Runtime Flow (Implemented)

- `apps/indexer` emits synthetic slot events every `SLOT_INTERVAL_MS`.
- `packages/parsers` normalizes events into swap/transfer/token_launch.
- `packages/db` updates cumulative metrics + 1m OHLCV and writes `infra/state/metrics.json`.
- `apps/api` serves current state from `infra/state/metrics.json`.

## Run Locally

1. Install dependencies:
   - `npm install`
2. Start indexer in one terminal:
   - `npm run dev:indexer`
3. Start API in another terminal:
   - `npm run dev:api`
4. Query data:
   - `GET http://localhost:3000/health`
   - `GET http://localhost:3000/metrics`

## Infrastructure

Start local infrastructure services (optional for current scaffold):

- `docker compose -f infra/docker-compose.yml up -d`

Services:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- Redpanda Kafka API on `localhost:9092`

## License

MIT