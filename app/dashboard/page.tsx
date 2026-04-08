"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function DashboardPage() {
    const token = useAuthStore((state) => state.token);
    const { farms, setFarms, selectedFarm, setSelectedFarm } = useFarmStore();
    const [stats, setStats] = useState({
        waterSaved: 0,
        efficiency: 0,
        alerts: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const res = await fetch("/api/farms", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setFarms(data);
                if (data.length > 0 && !selectedFarm) {
                    setSelectedFarm(data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch farms:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const res = await fetch("/api/analytics/summary", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            }
        };

        fetchFarms();
        fetchStats();
    }, [token, setFarms, selectedFarm, setSelectedFarm]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your farm overview</p>
            </div>

            {selectedFarm && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">{selectedFarm.name}</h2>
                            <p className="text-sm text-gray-500">{selectedFarm.location}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Area</p>
                            <p className="text-lg font-semibold">{selectedFarm.totalArea} acres</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Water Saved</CardTitle>
                        <Droplets className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumber(stats.waterSaved)} L</div>
                        {stats.waterSaved > 0 ? (
                            <p className="text-xs text-gray-500 mt-1">From irrigation logs</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">No data yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Efficiency</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.efficiency}%</div>
                        {stats.efficiency > 0 ? (
                            <p className="text-xs text-gray-500 mt-1">Based on irrigation data</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">No data yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{formatNumber(stats.revenue)}</div>
                        <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Alerts</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.alerts}</div>
                        <p className="text-xs text-gray-500 mt-1">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.waterSaved > 0 || stats.alerts > 0 ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">Activity tracking coming soon</p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-500">No activity yet</p>
                                <p className="text-xs text-gray-400 mt-1">Start using the system to see activity</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Droplets className="w-6 h-6 text-blue-600 mb-2" />
                                <p className="text-sm font-medium">Check Irrigation</p>
                            </button>
                            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                                <p className="text-sm font-medium">View Analytics</p>
                            </button>
                            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <DollarSign className="w-6 h-6 text-yellow-600 mb-2" />
                                <p className="text-sm font-medium">Apply for Loan</p>
                            </button>
                            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <AlertTriangle className="w-6 h-6 text-red-600 mb-2" />
                                <p className="text-sm font-medium">View Alerts</p>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
