import { Pool } from "pg"
import * as path from "path"
import * as fs from "fs"

export class PG {
    public client: Pool;

    constructor(dbUrl: string) {
        this.client = new Pool({
            connectionString: dbUrl,
            max: 10,
            idleTimeoutMillis: 30000
        });
    }

    async RunMigrations(): Promise<void> {
        const migrationsDir = path.join(__dirname, "..", "migrations");
        const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();

        for (const file of files) {
            const filePath = path.join(migrationsDir, file);
            const query = fs.readFileSync(filePath, "utf-8");
            this.client.query(query);
        }
    }

    async close(): Promise<void> {
        await this.client.end();
    }
}