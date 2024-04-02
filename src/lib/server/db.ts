import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";
import * as schema from './schema'
import { DB_HOST, DB_PASSWORD, DB_USERNAME } from "$env/static/private";

export const client = new Client({
    host: DB_HOST!,
    username: DB_USERNAME!,
    password: DB_PASSWORD!,
});

export const db = drizzle(client, { schema });