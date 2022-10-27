import { MetaFunction, LinksFunction, LoaderFunction, json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import  tailwindStylesheetUrl from "./styles/tailwind.css"
import { getEnv } from "./env.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "TredX - Financier",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }]
}

type LoaderData = {
  //user: Awaited<ReturnType<typeof getUser>>;
  ENV: ReturnType<typeof getEnv>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    //user: await getUser(request),
    ENV: getEnv(),
  });
};


export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}
