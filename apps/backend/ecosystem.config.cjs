module.exports = {
  apps: [
    {
      name: "axtp-backend",
      script: "./src/index.ts", // or your main entry point
      interpreter: "bun",

      // Clustering
      // instances: "max", // Use all available CPU cores
      // exec_mode: "cluster",

      // Restart options
      watch: true, // Enable watch & restart on file changes
      ignore_watch: ["node_modules", "logs", ".git", "*.log"],
      watch_delay: 1000, // Debounce watch events

      // Advanced restart configurations
      restart_delay: 1000, // Delay between restarts
      max_restarts: 10, // Prevent infinite restart loops

      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
      log_type: "json",

      // Performance and error handling
      max_memory_restart: "300M", // Restart if memory exceeds 300MB

      // Environment-specific overrides
      env: {
        NODE_ENV: "development",
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 80,
      },
    },
  ],
};
