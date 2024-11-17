interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  uptime: number;
}

const startTime = Date.now();

const server = Bun.serve({
  port: process.env.PORT || 3000,
  fetch(req): Response | Promise<Response> {
    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === "/health") {
      const healthData: HealthResponse = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        uptime: Math.floor((Date.now() - startTime) / 1000), // uptime in seconds
      };

      return new Response(JSON.stringify(healthData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Root endpoint
    if (url.pathname === "/") {
      return new Response("Welcome to Bun Web Service!");
    }

    // Handle 404
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
