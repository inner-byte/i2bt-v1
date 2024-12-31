import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (token: string, limit: number) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1]);
        return { success: true, remaining: limit - 1 };
      }
      if (tokenCount[0] === limit) {
        return { success: false, remaining: 0 };
      }
      tokenCount[0] += 1;
      tokenCache.set(token, tokenCount);
      return { success: true, remaining: limit - tokenCount[0] };
    },
  };
}

// Create limiter instance
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export async function withRateLimit(
  req: Request,
  maxRequests: number = 5
) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success, remaining } = limiter.check(ip, maxRequests);

  if (!success) {
    return NextResponse.json(
      { message: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  return null;
}
