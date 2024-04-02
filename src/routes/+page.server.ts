import { lucia } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    return {
        username: locals.user?.username
    }
};

export const actions = {
    default: async (event) => {

        if (!event.locals.session) {
            return fail(401);
        }
        await lucia.invalidateSession(event.locals.session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });
        redirect(302, "/");
    }
};