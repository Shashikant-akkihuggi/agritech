import axios from 'axios';

export interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    condition: string;
    rainProbability: number;
}

export interface ForecastData {
    hourly: Array<{
        time: string;
        temperature: number;
        humidity: number;
        rainProbability: number;
        condition: string;
    }>;
    daily: Array<{
        date: string;
        tempMin: number;
        tempMax: number;
        humidity: number;
        rainProbability: number;
        condition: string;
    }>;
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        console.warn('OPENWEATHER_API_KEY not configured. Weather data unavailable.');
        return null;
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = response.data;
        return {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            rainfall: data.rain?.['1h'] || 0,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure,
            condition: data.weather[0].main,
            rainProbability: data.clouds?.all || 0,
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return null;
    }
}

export async function fetchForecastData(lat: number, lon: number): Promise<ForecastData | null> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        console.warn('OPENWEATHER_API_KEY not configured. Forecast data unavailable.');
        return null;
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const hourly = response.data.list.slice(0, 8).map((item: any) => ({
            time: new Date(item.dt * 1000).toISOString(),
            temperature: item.main.temp,
            humidity: item.main.humidity,
            rainProbability: item.pop * 100,
            condition: item.weather[0].main,
        }));

        const dailyMap = new Map();
        response.data.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];
            if (!dailyMap.has(date)) {
                dailyMap.set(date, []);
            }
            dailyMap.get(date).push(item);
        });

        const daily = Array.from(dailyMap.entries()).slice(0, 7).map(([date, items]: [string, any[]]) => {
            const temps = items.map(i => i.main.temp);
            const avgHumidity = items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length;
            const maxRainProb = Math.max(...items.map(i => i.pop * 100));

            return {
                date,
                tempMin: Math.min(...temps),
                tempMax: Math.max(...temps),
                humidity: avgHumidity,
                rainProbability: maxRainProb,
                condition: items[0].weather[0].main,
            };
        });

        return { hourly, daily };
    } catch (error) {
        console.error('Forecast API error:', error);
        return null;
    }
}

// Remove all mock generation functions - no longer needed
