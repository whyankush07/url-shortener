import type { Pool } from "pg";
import { URLShortener } from './lld/Shortener';
import { v4 } from 'uuid';
import { persistUrl, searchUrl } from './db/queries';
import type { URL } from "./types/types";
import { IdGenerator } from './lld/id-generator';
import type Redis from "ioredis";

export class Controller {
    private db: Pool;
    private cache: Redis;
    private shortener: URLShortener;
    private idGenerator: IdGenerator;

    constructor(db: Pool, cache: Redis, shortener: URLShortener, idGenerator: IdGenerator) {
        this.db = db;
        this.cache = cache;
        this.shortener = shortener;
        this.idGenerator = idGenerator;
    }

    public async persistAndReturn(longUrl: string): Promise<string | null> {
        const shortUrl = this.shortener.shorten(longUrl);
        const urlRecord : URL = {
            id: this.idGenerator.generate(),
            shortUrl,
            longUrl
        };
        const isPersisted = await persistUrl(this.db, urlRecord);
        if (!isPersisted) {
            return null;
        }
        const cacheKey = `url:${shortUrl}`;
        await this.cache.set(cacheKey, urlRecord.longUrl, "EX", 3600);
        return shortUrl;
    }

    public async resolve(shortUrl: string): Promise<string | null> {
        const cacheKey = `url:${shortUrl}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return cached;
        }
        const urlRecord = await searchUrl(this.db, shortUrl);
        if (!urlRecord) {
            return null;
        }
        await this.cache.set(cacheKey, urlRecord.longUrl, "EX", 3600);
        return urlRecord.longUrl;
    }
}