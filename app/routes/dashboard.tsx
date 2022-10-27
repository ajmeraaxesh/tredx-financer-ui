import { Outlet } from "@remix-run/react";
import DashboardNavbar from '~/components/dashboardnavbar'

export default function DashboardRoute() {
    return (
        <main className="h-full bg-gray-100">
            <DashboardNavbar>
                <Outlet  />
            </DashboardNavbar>
        </main>
    )
}