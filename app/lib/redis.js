import Redis from "ioredis";

export default function redis(app) {
  const redis = new Redis({
    host: process.env.REDISHOST || "127.0.0.1",
    port: process.env.REDISPORT || 6379,
    keyPrefix: "accountService:",
    showFriendlyErrorStack: true
  });

  redis.on("connect", () => {
    (process.env.NODE_ENV === "production" || process.env.DEBUG) &&
      console.info("redis connected");
  });

  redis.on("end", err => {
    console.error(err);
    process.exit(-1);
  });

  return redis;
}
