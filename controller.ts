import type { Pool } from "pg";
import { URLShortener } from './lld/Shortener';
import { v4 } from 'uuid';
import { persistUrl, searchUrl } from './db/queries';
import type { URL } from "./types/types";
import { IdGenerator } from './lld/id-generator';

export class Controller {
    private db: Pool;
    private shortener: URLShortener;
    private idGenerator: IdGenerator;

    constructor(db: Pool, shortener: URLShortener, idGenerator: IdGenerator) {
        this.db = db;
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
        return shortUrl;
    }

    public async resolve(shortUrl: string): Promise<string | null> {
        const urlRecord = await searchUrl(this.db, shortUrl);
        return urlRecord ? urlRecord.longUrl : null;
    }
}