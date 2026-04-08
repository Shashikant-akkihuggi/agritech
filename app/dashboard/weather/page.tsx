"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useFarmStore } from "@/store/useFarmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Gauge, CloudRain, AlertCircle } from "lucide-react";
import { formatDecimal } from "@/lib/utils";

export default function WeatherPage() {
    const token = useAuthStore((state) => state.token);
    const selectedFarm = useFarmStore((state) => state.selectedFarm);
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!selectedFarm) {
                setLoading(false);
                return;
            }

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
                setError(!weatherData || !forecastData);
            } catch (error) {
                console.error("Failed to fetch weather:", error);
                setError(true);
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

    if (error || !weather) {
        return (
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Weather</h1>
                    <p className="text-gray-500 mt-1">{selectedFarm.location}</p>
                </div>

                <Card>
                    <CardContent className="p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Weather Data Unavailable</h3>
                        <p className="text-gray-500 mb-4">
                            Unable to fetch weather information for your location
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg text-left max-w-md mx-auto">
                            <p className="text-sm font-medium mb-2">To enable weather data:</p>
                            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                <li>Get free API key from openweathermap.org</li>
                                <li>Add OPENWEATHER_API_KEY to .env file</li>
                                <li>Restart the application</li>
                            </ol>
                        </div>
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

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Current Weather</p>
                            <div className="flex items-center gap-4">
                                <div className="text-6xl font-bold">{formatDecimal(weather.temperature, 1)}°C</div>
                                <div>
                                    <p className="text-xl font-semibold">{weather.condition}</p>
                                    <p className="text-sm text-gray-500">Feels like {formatDecimal(weather.temperature, 1)}°C</p>
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
                        <div className="text-2xl font-bold">{formatDecimal(weather.humidity, 0)}%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Wind Speed</CardTitle>
                        <Wind className="w-4 h-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDecimal(weather.windSpeed, 1)} m/s</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pressure</CardTitle>
                        <Gauge className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDecimal(weather.pressure, 0)} hPa</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Rain Probability</CardTitle>
                        <CloudRain className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatDecimal(weather.rainProbability, 0)}%</div>
                    </CardContent>
                </Card>
            </div>

            {forecast && forecast.hourly && forecast.hourly.length > 0 && (
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
                                    <p className="text-lg font-bold">{formatDecimal(hour.temperature, 0)}°C</p>
                                    <p className="text-xs text-gray-500 mt-1">{formatDecimal(hour.rainProbability, 0)}% rain</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {forecast && forecast.daily && forecast.daily.length > 0 && (
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
                                            <p className="font-semibold">{formatDecimal(day.rainProbability, 0)}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Temp</p>
                                            <p className="font-semibold">
                                                {formatDecimal(day.tempMax, 0)}° / {formatDecimal(day.tempMin, 0)}°
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="mt-6 bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle>Impact on Irrigation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {forecast && forecast.daily && forecast.daily[0]?.rainProbability > 70 && (
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
                        {(!forecast || !forecast.daily || forecast.daily[0]?.rainProbability < 30) &&
                            weather.temperature < 35 &&
                            weather.humidity > 40 && (
                                <p className="text-sm">
                                    ✅ Favorable conditions for irrigation if needed.
                                </p>
                            )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
