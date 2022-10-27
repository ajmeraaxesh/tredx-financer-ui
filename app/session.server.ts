import { createCookieSessionStorage, json, redirect, Request } from "@remix-run/node";
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

export async function getActiveFy(request) {
    ;
    const session = await getUserSession(request);
    const activeFy = session.get("activeFy")
    if (!activeFy || typeof activeFy !== "object") return null;
    return activeFy;
}

export async function getAccessToken(request: Request) {
    const session = await getUserSession(request);
    const accessToken = session.get("accessToken");
    if (!accessToken || typeof accessToken !== "string") return null;
    return accessToken;
}

export async function getApiCommonHeaders(request: Request) {
    const accessToken = await getAccessToken(request)
    const activeCompany = await getActiveCompany(request)
    const activeFy = await getActiveFy(request)
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'company_details': JSON.stringify(activeCompany),
        // { "id": 162, "name": "Ashirwad trading", "fy_details": [{ "id": 2, "fy_id": 2, "name": "2021-22", "fy_start": "2021-03-31T18:30:00.000Z", "fy_end": "2022-04-01T17:59:59.000Z" }, { "id": 3, "fy_id": 3, "name": "2022-23", "fy_start": "2022-03-31T18:30:00.000Z", "fy_end": "2023-04-01T17:59:59.000Z" }] }
        'fy_details': JSON.stringify({ "id": activeFy.fy_id })
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