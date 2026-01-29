import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Start server
    app.listen(env.port, () => {
      console.log(`
========================================
  Server is running on port ${env.port}
  Environment: ${env.nodeEnv}
  API Prefix: ${env.api.prefix}

  Swagger Docs: http://localhost:${env.port}${env.api.prefix}/docs
  Health Check: http://localhost:${env.port}/health
========================================
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: Error) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

startServer();

export default startServer;
