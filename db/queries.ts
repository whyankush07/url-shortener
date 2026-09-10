import type { Pool } from "pg";
import type { URL } from "../types/types";

export async function persistUrl(db: Pool, url: URL) : Promise<boolean> {
    try {
        const query = `
            INSERT INTO "urlTable" (id, shortUrl, longUrl)
            VALUES ($1, $2, $3)
        `
        await db.query(query, [url.id, url.shortUrl, url.longUrl]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function searchUrl(db: Pool, shortUrl: string) : Promise<URL | null> {
    try {
        const query = `
            SELECT * FROM "urlTable"
            WHERE shortUrl = $1
        `
        const result = await db.query<URL>(query, [shortUrl]);
        return result.rows[0] ?? null;
    } catch (error) {
        return null;
    }
}