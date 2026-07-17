import { createServer } from "node:http";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

async function start(): Promise<void> {
  await connectDatabase();

  const server = createServer(createApp());
  server.listen(env.PORT, "0.0.0.0", () => {
    logger.info("api_started", {
      port: env.PORT,
      environment: env.NODE_ENV,
    });
  });

  async function shutdown(signal: string): Promise<void> {
    logger.info("shutdown_started", { signal });
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch((error: unknown) => {
  logger.error("api_start_failed", {
    error: error instanceof Error ? error.message : "Unknown startup error",
  });
  process.exit(1);
});
