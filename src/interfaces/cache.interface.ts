import type { Request } from 'express';

export interface ICacheOptions {
    ttl?: number;
    keyPrefix?: string;
    skipCacheIf?: (req: Request) => boolean;
    invadidateOnMethods?: string[];
}