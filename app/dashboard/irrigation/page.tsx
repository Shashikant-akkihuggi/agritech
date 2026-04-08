"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, AlertCircle, CheckCircle, TrendingDown } from "lucide-react";

interface IrrigationDecision {
    decision: string;
    confidence: number;
    waterAmount?: number;
    waterSaved?: number;
    reason: string;
    factors: {
        soilMoisture: string;
        weather: string;
        cropNeed: string;
    };
}

export default function IrrigationPage() {
    const token = useAuthStore((state) => state.token);
    const selectedFarm = useFarmStore((state) => state.selectedFarm);
    const [decision, setDecision] = useState<IrrigationDecision | null>(null);
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        if (selectedFarm) {
            setFields((selectedFarm as any).fields || []);
        }
    }, [selectedFarm]);

    const getDecision = async (fieldId: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/irrigation/decision", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ fieldId }),
            });

            const data = await res.json();
            setDecision(data);
        } catch (error) {
            console.error("Failed to get decision:", error);
        } finally {
            setLoading(false);
        }
    };

    const getDecisionColor = (dec: string) => {
        if (dec === "IRRIGATE") return "bg-green-50 border-green-200 text-green-900";
        if (dec === "DO_NOT_IRRIGATE") return "bg-red-50 border-red-200 text-red-900";
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
    };

    const getDecisionIcon = (dec: string) => {
        if (dec === "IRRIGATE") return <CheckCircle className="w-6 h-6 text-green-600" />;
        if (dec === "DO_NOT_IRRIGATE") return <AlertCircle className="w-6 h-6 text-red-600" />;
        return <TrendingDown className="w-6 h-6 text-yellow-600" />;
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Smart Irrigation</h1>
                <p className="text-gray-500 mt-1">AI-powered irrigation decisions</p>
            </div>

            {!selectedFarm && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">Please select a farm to view irrigation recommendations</p>
                    </CardContent>
                </Card>
            )}

            {selectedFarm && fields.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">No fields found. Add fields to your farm to get started.</p>
                    </CardContent>
                </Card>
            )}

            {selectedFarm && fields.length > 0 && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Field</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {fields.map((field) => (
                                    <button
                                        key={field.id}
                                        onClick={() => getDecision(field.id)}
                                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 transition-all text-left"
                                    >
                                        <h3 className="font-semibold">{field.name}</h3>
                                        <p className="text-sm text-gray-500">{field.area} acres</p>
                                        <p className="text-sm text-gray-500">{field.cropType || "No crop"}</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    )}

                    {decision && !loading && (
                        <>
                            <Card className={`border-2 ${getDecisionColor(decision.decision)}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        {getDecisionIcon(decision.decision)}
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold mb-2">
                                                {decision.decision.replace(/_/g, " ")}
                                            </h2>
                                            <p className="text-lg mb-4">{decision.reason}</p>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-sm font-medium">Confidence</p>
                                                    <p className="text-2xl font-bold">{decision.confidence.toFixed(0)}%</p>
                                                </div>
                                                {decision.waterAmount && (
                                                    <div>
                                                        <p className="text-sm font-medium">Water Required</p>
                                                        <p className="text-2xl font-bold">{decision.waterAmount.toFixed(0)} L</p>
                                                    </div>
                                                )}
                                                {decision.waterSaved && (
                                                    <div>
                                                        <p className="text-sm font-medium">Water Saved</p>
                                                        <p className="text-2xl font-bold">{decision.waterSaved.toFixed(0)} L</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Why This Decision?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <Droplets className="w-4 h-4" />
                                                Soil Moisture
                                            </h3>
                                            <p className="text-sm">{decision.factors.soilMoisture}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h3 className="font-semibold mb-2">Weather Conditions</h3>
                                            <p className="text-sm">{decision.factors.weather}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <h3 className="font-semibold mb-2">Crop Requirements</h3>
                                            <p className="text-sm">{decision.factors.cropNeed}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {decision.decision === "IRRIGATE" && (
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">Ready to irrigate?</h3>
                                                <p className="text-sm text-gray-600">Execute irrigation based on this recommendation</p>
                                            </div>
                                            <Button size="lg">
                                                <Droplets className="w-4 h-4 mr-2" />
                                                Start Irrigation
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
