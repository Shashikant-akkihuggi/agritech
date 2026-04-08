"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Droplets, Cloud, Bug, CheckCircle } from "lucide-react";

const alerts = [
    {
        id: 1,
        type: "water",
        severity: "high",
        title: "Low Soil Moisture Detected",
        message: "Field A moisture level below 20%. Immediate irrigation recommended.",
        time: "2 hours ago",
        isRead: false,
    },
    {
        id: 2,
        type: "weather",
        severity: "medium",
        title: "Heavy Rain Expected",
        message: "85% chance of rain in next 6 hours. Consider postponing irrigation.",
        time: "5 hours ago",
        isRead: false,
    },
    {
        id: 3,
        type: "pest",
        severity: "medium",
        title: "Pest Activity Detected",
        message: "Increased pest activity in Field B. Inspection recommended.",
        time: "1 day ago",
        isRead: true,
    },
    {
        id: 4,
        type: "system",
        severity: "low",
        title: "Irrigation Completed",
        message: "Field A irrigation completed successfully. 450L water used.",
        time: "2 days ago",
        isRead: true,
    },
];

export default function AlertsPage() {
    const getAlertIcon = (type: string) => {
        switch (type) {
            case "water":
                return <Droplets className="w-5 h-5" />;
            case "weather":
                return <Cloud className="w-5 h-5" />;
            case "pest":
                return <Bug className="w-5 h-5" />;
            default:
                return <CheckCircle className="w-5 h-5" />;
        }
    };

    const getAlertColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-50 border-red-200 text-red-900";
            case "medium":
                return "bg-yellow-50 border-yellow-200 text-yellow-900";
            default:
                return "bg-blue-50 border-blue-200 text-blue-900";
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "high":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const unreadCount = alerts.filter((a) => !a.isRead).length;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
                <p className="text-gray-500 mt-1">
                    {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Alerts</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{alerts.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Unread</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">High Priority</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {alerts.filter((a) => a.severity === "high").length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">This Week</CardTitle>
                        <AlertTriangle className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{alerts.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-3 mb-6">
                <Button variant="outline">All Alerts</Button>
                <Button variant="outline">Unread Only</Button>
                <Button variant="outline">High Priority</Button>
                <Button variant="outline">Mark All as Read</Button>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <Card
                        key={alert.id}
                        className={`${getAlertColor(alert.severity)} ${!alert.isRead ? "border-2" : ""
                            }`}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${alert.severity === "high" ? "bg-red-100" :
                                        alert.severity === "medium" ? "bg-yellow-100" : "bg-blue-100"
                                    }`}>
                                    {getAlertIcon(alert.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg">{alert.title}</h3>
                                            <p className="text-sm mt-1">{alert.message}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityBadge(
                                                alert.severity
                                            )}`}
                                        >
                                            {alert.severity.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-xs text-gray-500">{alert.time}</p>
                                        <div className="flex gap-2">
                                            {!alert.isRead && (
                                                <Button size="sm" variant="outline">
                                                    Mark as Read
                                                </Button>
                                            )}
                                            <Button size="sm">Take Action</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mt-6 bg-gray-50">
                <CardHeader>
                    <CardTitle>Alert Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Irrigation Alerts</p>
                                <p className="text-sm text-gray-500">Get notified about irrigation decisions</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Weather Alerts</p>
                                <p className="text-sm text-gray-500">Receive weather-related notifications</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Pest & Disease Alerts</p>
                                <p className="text-sm text-gray-500">Get alerts about crop health issues</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-medium">Market Price Alerts</p>
                                <p className="text-sm text-gray-500">Notify when prices change significantly</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
