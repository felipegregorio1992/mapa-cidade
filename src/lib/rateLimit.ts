const rateMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateMap.get(ip);

  if (!record || now > record.resetTime) {
    rateMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Limpa entradas expiradas periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateMap) {
    if (now > value.resetTime) {
      rateMap.delete(key);
    }
  }
}, 60000);
