"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
    Home,
    Droplets,
    Cloud,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Map,
    Bell,
    LogOut,
    Sprout,
} from "lucide-react";

const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Droplets, label: "Smart Irrigation", href: "/dashboard/irrigation" },
    { icon: Cloud, label: "Weather", href: "/dashboard/weather" },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
    { icon: ShoppingCart, label: "Marketplace", href: "/dashboard/marketplace" },
    { icon: DollarSign, label: "Finance", href: "/dashboard/finance" },
    { icon: Map, label: "Farm Management", href: "/dashboard/farm" },
    { icon: Bell, label: "Alerts", href: "/dashboard/alerts" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Smart Agro</h1>
                        <p className="text-xs text-gray-500">Farming Platform</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-green-50 text-green-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="mb-3 px-4">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.phone}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
