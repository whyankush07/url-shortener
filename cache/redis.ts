import Redis from "ioredis";

export class Cache {
    private readonly client: Redis;

    constructor(redisUrl: string) {
        this.client = new Redis(redisUrl, {
            enableOfflineQueue: false,
            retryStrategy: (times) => {
                if (times > 5) {
                    return null;
                }
                return Math.min(times * 500, 2000);
            }
        });
    }

    public get(): Redis {
        return this.client;
    }

    quit() {
        this.client.quit();
    }
}