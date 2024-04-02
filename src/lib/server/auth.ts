import { Lucia } from "lucia";
import { PlanetScaleAdapter } from "@lucia-auth/adapter-mysql";
import { client } from "./db";
import { GitHub } from "arctic";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";

const adapter = new PlanetScaleAdapter(client, {
    user: "users",
    session: "user_session"
});


export const github = new GitHub(
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET
);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        }
    }
});

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        UserId: number;
    }
}
