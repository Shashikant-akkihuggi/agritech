"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Gauge, CloudRain } from "lucide-react";

export default function WeatherPage() {
    const token = useAuthStore((state) => state.token);
    const selectedFarm = useFarmStore((state) => state.selectedFarm);
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!selectedFarm) return;

            try {
                const [weatherRes, forecastRes] = await Promise.all([
                    fetch(
                        `/api/weather?lat=${selectedFarm.latitude}&lon=${selectedFarm.longitude}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    ),
                    fetch(
                        `/api/weather?lat=${selectedFarm.latitude}&lon=${selectedFarm.longitude}&type=forecast`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    ),
                ]);

                const weatherData = await weatherRes.json();
                const forecastData = await forecastRes.json();

                setWeather(weatherData);
                setForecast(forecastData);
            } catch (error) {
                console.error("Failed to fetch weather:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [selectedFarm, token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!selectedFarm) {
        return (
            <div className="p-8">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500">Please select a farm to view weather data</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Weather</h1>
                <p className="text-gray-500 mt-1">{selectedFarm.location}</p>
            </div>

            {weather && (
                <>
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Current Weather</p>
                                    <div className="flex items-center gap-4">
                                        <div className="text-6xl font-bold">{weather.temperature.toFixed(1)}°C</div>
                                        <div>
                                            <p className="text-xl font-semibold">{weather.condition}</p>
                                            <p className="text-sm text-gray-500">Feels like {weather.temperature.toFixed(1)}°C</p>
                                        </div>
                                    </div>
                                </div>
                                <Cloud className="w-24 h-24 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Humidity</CardTitle>
                                <Droplets className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{weather.humidity.toFixed(0)}%</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Wind Speed</CardTitle>
                                <Wind className="w-4 h-4 text-gray-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{weather.windSpeed.toFixed(1)} m/s</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Pressure</CardTitle>
                                <Gauge className="w-4 h-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{weather.pressure.toFixed(0)} hPa</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Rain Probability</CardTitle>
                                <CloudRain className="w-4 h-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{weather.rainProbability.toFixed(0)}%</div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {forecast && (
                <>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Hourly Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {forecast.hourly.map((hour: any, idx: number) => (
                                    <div key={idx} className="flex-shrink-0 text-center p-4 bg-gray-50 rounded-lg min-w-[100px]">
                                        <p className="text-sm font-medium mb-2">
                                            {new Date(hour.time).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                hour12: true,
                                            })}
                                        </p>
                                        <Cloud className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-lg font-bold">{hour.temperature.toFixed(0)}°C</p>
                                        <p className="text-xs text-gray-500 mt-1">{hour.rainProbability.toFixed(0)}% rain</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>7-Day Forecast</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {forecast.daily.map((day: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4 flex-1">
                                            <p className="font-medium w-24">
                                                {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                                            </p>
                                            <Cloud className="w-6 h-6 text-gray-400" />
                                            <p className="text-sm text-gray-600">{day.condition}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Rain</p>
                                                <p className="font-semibold">{day.rainProbability.toFixed(0)}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Temp</p>
                                                <p className="font-semibold">
                                                    {day.tempMax.toFixed(0)}° / {day.tempMin.toFixed(0)}°
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle>Impact on Irrigation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {forecast.daily[0].rainProbability > 70 && (
                                    <p className="text-sm">
                                        ⚠️ High rain probability today. Consider postponing irrigation.
                                    </p>
                                )}
                                {weather.temperature > 35 && (
                                    <p className="text-sm">
                                        🌡️ High temperature detected. Crops may need additional water.
                                    </p>
                                )}
                                {weather.humidity < 40 && (
                                    <p className="text-sm">
                                        💧 Low humidity. Increased evaporation expected.
                                    </p>
                                )}
                                {forecast.daily[0].rainProbability < 30 && weather.temperature < 35 && weather.humidity > 40 && (
                                    <p className="text-sm">
                                        ✅ Favorable conditions for irrigation if needed.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
