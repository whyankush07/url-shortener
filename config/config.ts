interface Config {
    baseUrl: string;
    redisUrl: string;
    pgUrl: string;
}

export function loadConfig(): Config {
    const baseUrl = process.env["BASE_URL"];
    const redisUrl = process.env["REDIS_URL"];
    const pgUrl = process.env["POSTGRES_URL"];

    if (!baseUrl || !redisUrl || !pgUrl) {
        throw new Error("Config file is missing some parameteres");
    }

    return {
        baseUrl,
        redisUrl,
        pgUrl
    }
}