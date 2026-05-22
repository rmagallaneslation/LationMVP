const devMemoryLimiter = new Map();

async function checkUpstashLimit(key, limit, windowSeconds) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    return { available: false };
  }

  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["TTL", key],
      ["EXPIRE", key, windowSeconds, "NX"],
    ]),
  });

  if (!response.ok) {
    throw new Error("upstash_error");
  }

  const results = await response.json();
  const count = Number(results?.[0]?.result ?? 0);
  let ttl = Number(results?.[1]?.result ?? windowSeconds);
  if (!Number.isFinite(ttl) || ttl < 0) {
    ttl = windowSeconds;
  }

  return {
    available: true,
    ok: count <= limit,
    retryAfter: ttl,
  };
}

function checkDevelopmentLimit(key, limit, windowSeconds) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = devMemoryLimiter.get(key);

  if (!record || now > record.expiresAt) {
    devMemoryLimiter.set(key, { count: 1, expiresAt: now + windowMs });
    return { ok: true, retryAfter: windowSeconds };
  }

  record.count += 1;
  devMemoryLimiter.set(key, record);

  const retryAfter = Math.max(Math.ceil((record.expiresAt - now) / 1000), 1);
  return {
    ok: record.count <= limit,
    retryAfter,
  };
}

export async function enforceRateLimit({
  key,
  limit = 5,
  windowSeconds = 600,
  isProduction = true,
}) {
  try {
    const upstashResult = await checkUpstashLimit(key, limit, windowSeconds);
    if (upstashResult.available) {
      return upstashResult;
    }

    return checkDevelopmentLimit(key, limit, windowSeconds);
  } catch {
    void isProduction;
    return checkDevelopmentLimit(key, limit, windowSeconds);
  }
}
