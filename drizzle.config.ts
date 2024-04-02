import type { Config } from "drizzle-kit";

const uri = [
    "mysql://",
    process.env.DB_USERNAME,
    ":",
    process.env.DB_PASSWORD,
    "@",
    process.env.DB_HOST,
    ":3306/",
    process.env.DB_NAME,
    '?ssl={"rejectUnauthorized":true}',
].join("");

export default {
    schema: "./src/lib/server/schema.ts",
    driver: "mysql2",
    dbCredentials: { uri },
} satisfies Config;