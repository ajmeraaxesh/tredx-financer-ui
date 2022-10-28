import { json, LoaderArgs, LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { getApprovedBuyersAndSellers } from "~/apis/buyer-seller.server";

export const loader: LoaderFunction = async  ({request}: LoaderArgs) => {
    const data = await getApprovedBuyersAndSellers(request)
    return json(data)
};


export default function DashboardIndexRoute() {
    const data = useLoaderData<typeof loader>()

    return (
        <div>Need to show the grid of graphs and charts</div>
    )
}