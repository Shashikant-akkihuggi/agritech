"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function MarketplacePage() {
    const token = useAuthStore((state) => state.token);
    const [prices, setPrices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch("/api/marketplace/prices", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setPrices(data);
            } catch (error) {
                console.error("Failed to fetch prices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrices();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const commodities = [...new Set(prices.map((p) => p.commodity))];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-500 mt-1">Live Mandi Data & Price Trends</p>
            </div>

            <div className="mb-6">
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={selectedCommodity === null ? "default" : "outline"}
                        onClick={() => setSelectedCommodity(null)}
                    >
                        All Commodities
                    </Button>
                    {commodities.map((commodity) => (
                        <Button
                            key={commodity}
                            variant={selectedCommodity === commodity ? "default" : "outline"}
                            onClick={() => setSelectedCommodity(commodity)}
                        >
                            {commodity}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg Market Price</CardTitle>
                        <Activity className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{(prices.reduce((sum, p) => sum + p.modalPrice, 0) / prices.length).toFixed(0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Per quintal</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Highest Price</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{Math.max(...prices.map((p) => p.maxPrice)).toFixed(0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {prices.find((p) => p.maxPrice === Math.max(...prices.map((p) => p.maxPrice)))?.commodity}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Markets Tracked</CardTitle>
                        <Activity className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Set(prices.map((p) => p.market)).size}</div>
                        <p className="text-xs text-gray-500 mt-1">Across India</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Live Mandi Prices</CardTitle>
                    <p className="text-sm text-gray-500">Updated: {new Date().toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Commodity</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Market</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">State</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">Min Price</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">Max Price</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">Modal Price</th>
                                    <th className="text-center py-3 px-4 font-semibold text-sm">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prices
                                    .filter((p) => !selectedCommodity || p.commodity === selectedCommodity)
                                    .map((price, idx) => {
                                        const trend = Math.random() > 0.5;
                                        return (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium">{price.commodity}</td>
                                                <td className="py-3 px-4 text-sm">{price.market}</td>
                                                <td className="py-3 px-4 text-sm">{price.state}</td>
                                                <td className="py-3 px-4 text-right">₹{price.minPrice.toFixed(0)}</td>
                                                <td className="py-3 px-4 text-right">₹{price.maxPrice.toFixed(0)}</td>
                                                <td className="py-3 px-4 text-right font-semibold">₹{price.modalPrice.toFixed(0)}</td>
                                                <td className="py-3 px-4 text-center">
                                                    {trend ? (
                                                        <TrendingUp className="w-4 h-4 text-green-600 inline" />
                                                    ) : (
                                                        <TrendingDown className="w-4 h-4 text-red-600 inline" />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6 bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Sell Your Produce</h3>
                            <p className="text-sm text-gray-600">List your crops and connect with buyers</p>
                        </div>
                        <Button size="lg">Create Listing</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
