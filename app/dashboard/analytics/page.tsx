"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Droplets, DollarSign, Activity } from "lucide-react";

const waterUsageData = [
    { month: "Jan", usage: 4500, saved: 1200 },
    { month: "Feb", usage: 4200, saved: 1400 },
    { month: "Mar", usage: 5100, saved: 1100 },
    { month: "Apr", usage: 5800, saved: 900 },
    { month: "May", usage: 6200, saved: 800 },
    { month: "Jun", usage: 5500, saved: 1300 },
];

const efficiencyData = [
    { week: "Week 1", efficiency: 78 },
    { week: "Week 2", efficiency: 82 },
    { week: "Week 3", efficiency: 85 },
    { week: "Week 4", efficiency: 87 },
];

const cropYieldData = [
    { crop: "Rice", yield: 4.2, target: 5.0 },
    { crop: "Wheat", yield: 3.8, target: 4.5 },
    { crop: "Cotton", yield: 2.1, target: 2.5 },
    { crop: "Maize", yield: 3.5, target: 4.0 },
];

export default function AnalyticsPage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
                <p className="text-gray-500 mt-1">Track your farm performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Water Used</CardTitle>
                        <Droplets className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">31,300 L</div>
                        <p className="text-xs text-green-600 mt-1">-8% from last period</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Water Saved</CardTitle>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6,700 L</div>
                        <p className="text-xs text-green-600 mt-1">+15% from last period</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Cost Savings</CardTitle>
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹3,350</div>
                        <p className="text-xs text-green-600 mt-1">+12% from last period</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avg Efficiency</CardTitle>
                        <Activity className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87%</div>
                        <p className="text-xs text-green-600 mt-1">+5% from last period</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Water Usage Trends</CardTitle>
                        <p className="text-sm text-gray-500">Monthly water consumption and savings</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={waterUsageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} name="Usage (L)" />
                                <Line type="monotone" dataKey="saved" stroke="#10b981" strokeWidth={2} name="Saved (L)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Irrigation Efficiency</CardTitle>
                        <p className="text-sm text-gray-500">Weekly efficiency percentage</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={efficiencyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Crop Yield Analysis</CardTitle>
                    <p className="text-sm text-gray-500">Actual vs target yield (tons/acre)</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={cropYieldData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="crop" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="yield" fill="#3b82f6" name="Actual Yield" />
                            <Bar dataKey="target" fill="#94a3b8" name="Target Yield" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="font-semibold text-green-900 mb-1">✓ Excellent Water Management</p>
                                <p className="text-sm text-green-700">
                                    You've saved 21% more water compared to traditional methods
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="font-semibold text-blue-900 mb-1">→ Efficiency Improving</p>
                                <p className="text-sm text-blue-700">
                                    Your irrigation efficiency has increased by 9% this month
                                </p>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <p className="font-semibold text-yellow-900 mb-1">⚠ Yield Gap Detected</p>
                                <p className="text-sm text-yellow-700">
                                    Rice and wheat yields are below target. Consider soil testing.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 text-sm font-bold">1</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Optimize irrigation timing</p>
                                    <p className="text-xs text-gray-600">
                                        Schedule irrigation during early morning hours to reduce evaporation
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 text-sm font-bold">2</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Soil health check</p>
                                    <p className="text-xs text-gray-600">
                                        Conduct soil testing to improve nutrient management
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 text-sm font-bold">3</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Crop rotation</p>
                                    <p className="text-xs text-gray-600">
                                        Consider rotating crops to improve soil fertility
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
