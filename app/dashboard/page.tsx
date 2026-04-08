"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";

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

        fetchFarms();
    }, [token, setFarms, selectedFarm, setSelectedFarm]);

    useEffect(() => {
        setStats({
            waterSaved: 12500,
            efficiency: 87,
            alerts: 3,
            revenue: 45000,
        });
    }, []);

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
                        <div className="text-2xl font-bold">{stats.waterSaved.toLocaleString()} L</div>
                        <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Efficiency</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.efficiency}%</div>
                        <p className="text-xs text-green-600 mt-1">+5% from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
                        <p className="text-xs text-green-600 mt-1">+8% from last month</p>
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
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Irrigation completed</p>
                                    <p className="text-xs text-gray-500">Field A - 2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Weather alert received</p>
                                    <p className="text-xs text-gray-500">Rain expected - 5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Marketplace listing created</p>
                                    <p className="text-xs text-gray-500">Wheat 500kg - 1 day ago</p>
                                </div>
                            </div>
                        </div>
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
