import invariant from "tiny-invariant";

export function getEnv() {
    invariant(process.env.BUYER_SELLER_URL, "BUYER_SELLER_URL should be defined");
    invariant(process.env.FINANCIER_URL, "FINANCIER_URL should be defined");
    invariant(process.env.PLATFORM_URL, "PLATFORM_URL should be defined");

    return {
        BUYER_SELLER_URL: process.env.BUYER_SELLER_URL,
        FINANCIER_URL: process.env.FINANCIER_URL,
        PLATFORM_URL: process.env.PLATFORM_URL,
    };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
    var ENV: ENV;
    interface Window {
        ENV: ENV;
    }
}