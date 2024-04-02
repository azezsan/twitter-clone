import { OAuth2RequestError } from "arctic";
import { github, lucia } from "$lib/server/auth";
import type { RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { userAccounts, users } from "$lib/server/schema";
import { eq, and } from "drizzle-orm";

export async function GET(event: RequestEvent): Promise<Response> {
    const code = event.url.searchParams.get("code");
    const state = event.url.searchParams.get("state");

    // const storedState = event.url.searchParams.get("state") ?? null;
    // FIXME: cookie appears empty
    const storedState = event.cookies.get("github_oauth_state") ?? null;

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const githubUser: GitHubUser = await githubUserResponse.json();

        // Replace this with your own DB client.
        const existingUser = await db.select().from(userAccounts).where(and(eq(userAccounts.providerUserId, githubUser.id.toString()), eq(userAccounts.providerId, "github")))

        if (existingUser.length > 0) {
            const session = await lucia.createSession(existingUser[0].userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });
        } else {

            const newUser = await db.insert(users).values({
                username: githubUser.login
            })

            const userID = Number(newUser)

            await db.insert(userAccounts).values({
                providerUserId: githubUser.id.toString(),
                providerId: "github",
                userId: userID
            })

            const session = await lucia.createSession(userID, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });
        }
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    } catch (e) {
        // the specific error message depends on the provider
        if (e instanceof OAuth2RequestError) {
            // invalid code
            return new Response(null, {
                status: 400
            });
        }
        return new Response(null, {
            status: 500
        });
    }
}

interface GitHubUser {
    id: number;
    login: string;
}