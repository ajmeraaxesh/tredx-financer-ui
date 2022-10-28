import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";



invariant(process.env.SESSION_SECRET, "SESSION_SECRET needs to be set")
const sessionSecret = process.env.SESSION_SECRET;

const storage = createCookieSessionStorage({
    cookie: {
        name: "financier_session",
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: process.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 2, // 6 months
        httpOnly: true,
    },
});

export async function createUserSession(
    userId: string, entityId: string, accessToken: string,
    redirectTo: string
) {
    const session = await storage.getSession();
    //TODO: Store userId,  entityId, tokenRole
    session.set("userId", userId);
    session.set("accessToken", accessToken);

    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}

export async function createUserSessionWithoutRedirection(jsonData) {
    // const session = await storage.getSession();
    // console.log("SetSession: ", { activeCompany }, { activeFy })
    // session.set("userId", userId);
    // session.set("accessToken", accessToken);
    // session.set("activeCompany", { id: activeCompany.id });
    // session.set("activeFy", activeFy);
    // return json(jsonData, {
    //     headers: {
    //         "Set-Cookie": await storage.commitSession(session),
    //     },
    // });
}



function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    return userId;
}

export async function getActiveCompany(request: Request) {
    const session = await getUserSession(request);
    const activeCompany = session.get("activeCompany");

    if (!activeCompany || typeof activeCompany !== "object") return null;
    return activeCompany;
}


export async function getAccessToken(request: Request) {
    const session = await getUserSession(request);
    const accessToken = session.get("accessToken");
    if (!accessToken || typeof accessToken !== "string") return null;
    return accessToken;
}

export async function getApiCommonHeaders(request: Request) {

    //TODO:Replace this with actual API TOKEN from the request
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU2NzQyODA5LTRiM2EtNDM3Mi1hZmNhLTI1YzliMjBlNGRlNSIsIm5hbWUiOiJOYXRpb25hbCBCYW5rICIsImVtYWlsIjoibmF0aW9uYWxiYW5rQGdtYWlsLmNvbSIsIm1vYmlsZSI6Ijk4NTY2MjEzODkiLCJpc0FwaVVzZXIiOmZhbHNlLCJhcGlTZXJ2aWNlIjoiRklOQU5DSUVSIiwicm9sZSI6WyJBRE1JTiJdLCJlbnRpdHkiOnsiaWQiOiIxYmZlYzhlMS1mZjg2LTRmMTMtOWJjNi03ODM5M2IzNGE3YzIiLCJuYW1lIjoiTmF0aW9uYWwgQmFuayJ9LCJpYXQiOjE2NjY4NzgxNDIsImV4cCI6MTY2NzA1MDk0Mn0.6sJcdc7179di2Nf7vbQH5cXS9w7HZus3-j2l_d12kxI"
    //await getAccessToken(request)
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    }
}


export async function requireAccessToken(
    request: Request,
    redirectTo = new URL(request.url).pathname
) {
    const session = await getUserSession(request);
    const accessToken = session.get("accessToken");
    if (!accessToken || typeof accessToken !== "string") {
        const searchParams = new URLSearchParams([
            ["redirectTo", redirectTo],
        ]);
        throw redirect(`/login?${searchParams}`);
    }
    return accessToken;
}

export async function logout(request: Request) {
    const session = await getUserSession(request)
    return redirect('/', {
        'headers': {
            'Set-Cookie': await storage.destroySession(session),
        }
    })
}