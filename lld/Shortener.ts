import { Base62Encoder } from './base-62';

interface URLRecord {
    longUrl: string;
    createdAt: Date;
}

class URLShortener {
    private store: Map<string, URLRecord>;
    //! remove the Map later and use a database for persistence
    private idCounter: number;
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.store = new Map();
        this.idCounter = 1;
        this.baseUrl = baseUrl;
    }

    public shorten(longUrl: string): string {
        const shortUrl = Base62Encoder.encode(this.idCounter);
        this.store.set(shortUrl, { longUrl, createdAt: new Date() });
        return `${this.baseUrl}/${shortUrl}`;
    }

    public resolve(shortUrl: string): string | null {
        const record = this.store.get(shortUrl);

        return record ? record.longUrl : null;
    }
}

export { URLShortener };