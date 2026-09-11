import express from 'express';
import { URLShortener } from './lld/Shortener';
import { Controller } from './controller';
import { PG } from './db/pg';
import { IdGenerator } from './lld/id-generator';
import { Cache } from './cache/redis';
import { loadConfig } from "./config/config"

const app = express();

const cfg = loadConfig();

const generator = new IdGenerator();
const shortener = new URLShortener(cfg.baseUrl);
const db = new PG(cfg.pgUrl);
const cache = new Cache(cfg.redisUrl);
const controller = new Controller(db.client, cache.get(), shortener, generator);

app.get('/api/v1', (req, res) => {
    try {
        const longUrl =
            typeof req.query.longUrl === "string"
                ? req.query.longUrl
                : null;

        if (!longUrl) {
            res.status(400).json({
                message: "Missing longUrl query parameter"
            });
            return;
        }
        const shortUrl = controller.persistAndReturn(longUrl);
        if (!shortUrl) {
            res.status(400).json({ message: "Failed to shorten URL" });
            return;
        }
        res.status(200).json({ shortUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: String(error) });
    }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = req.params.shortUrl;
        const longUrl = await controller.resolve(shortUrl);
        if (!longUrl) {
            res.status(404).json({ message: "URL not found" });
            return;
        }
        res.status(301).redirect(longUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: String(error) });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});