import type { Request, Response, NextFunction } from 'express';
import { redisClient } from '../configs/redis.config.js';
import crypto from 'crypto';
import type { ICacheOptions } from '../interfaces/cache.interface.js';
import { invalid } from 'joi';

export const MCache = (options: ICacheOptions = {}) => {
    const {
        ttl = 300,
        keyPrefix = 'api_cache',
        skipCacheIf,
        invadidateOnMethods = ['POST', 'PUT', 'DELETE', 'PATCH'],
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (invadidateOnMethods.includes(req.method)) {
                return next();
            }

            if (skipCacheIf && skipCacheIf(req)) {
                return next();
            }

            const cacheKey = generateCacheKey(req, keyPrefix);

            const cacheData = await redisClient.get(cacheKey);

            if (cacheData) {
                const parsed = JSON.parse(cacheData);

                res.setHeader("X-Cache-Status", "HIT");
                res.setHeader("X-Cache-Key", cacheKey);

                console.log("parsed", parsed);
                console.log("typeof parsed", typeof parsed);

                return res.status(parsed.statusCode).json(parsed.data);
            }

            const originalSend = res.send;
            res.send = function (data: any) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const cacheData = {
                        statusCode: res.statusCode,
                        data: JSON.parse(data),
                        timestamp: new Date().toISOString(),
                    };

                    setImmediate(async () => {
                        try {
                            await redisClient.setEx(cacheKey, ttl, JSON.stringify(cacheData));
                        } catch (error) {
                            console.error("Error setting cache:", error);
                        }
                    });
                }

                res.setHeader("X-Cache-Status", "MISS");
                res.setHeader("X-Cache-Key", cacheKey);

                return originalSend.call(this, data);
            };

            next();
        } catch (error) {
            console.error("Cache middleware error:", error);
            next();
        }
    };
};

export const MInvalidateCache = (patterns: string[] = []) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const originalJson = res.json;
            res.json = function (data: any) {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    setImmediate(async () => {
                        try {
                            await invalidCachePatterns(patterns);
                        } catch (error) {
                            console.error("Error invalidating cache:", error);
                        }
                    });
                }

                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error("Invalidate cache middleware error:", error);
        }
    }
}

//generate cache key based on request
const generateCacheKey = (req: Request, prefix: string) => {
    const url = req.originalUrl || req.url;
    const method = req.method;
    const userAgent = req.get("user-agent") || "";

    const userId = req.admin?.id || "anonymous";

    const keyData = {
        method,
        url,
        userId,
        userAgent: crypto
            .createHash("md5")
            .update(userAgent)
            .digest("hex")
            .substring(0, 8), 
    };

    const keyString = JSON.stringify(keyData);
    const hash = crypto.createHash("md5").update(keyString).digest("hex");

    return `${prefix}:${hash}`;
}

//invalidate cache by patterns
const invalidCachePatterns = async (patterns: string[]): Promise<void> => {
    if (patterns.length === 0) return;

    for (const pattern of patterns) {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
                console.log(`Invalidated ${keys.length} cache entries for pattern ${pattern}`);
            }


        } catch (error) {
            console.error(`Error invalidating cache for pattern ${pattern}:`, error);
        }
    }
}

export const CachePresents = {
    short: (ttl: number = 60): ICacheOptions => ({
        ttl,
        keyPrefix: 'short_cache',
    }),
    medium: (ttl: number = 300): ICacheOptions => ({
        ttl,
        keyPrefix: 'medium_cache',
    }),
    long: (ttl: number = 3600): ICacheOptions => ({
        ttl,
        keyPrefix: 'long_cache',
    }),
    user: (ttl: number = 600): ICacheOptions => ({
        ttl,
        keyPrefix: 'user_cache',
    }),
}