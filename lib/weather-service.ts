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

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        return generateMockWeatherData();
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
        return generateMockWeatherData();
    }
}

export async function fetchForecastData(lat: number, lon: number): Promise<ForecastData> {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        return generateMockForecastData();
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
        return generateMockForecastData();
    }
}

function generateMockWeatherData(): WeatherData {
    return {
        temperature: 28 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() > 0.7 ? Math.random() * 5 : 0,
        windSpeed: 5 + Math.random() * 10,
        pressure: 1010 + Math.random() * 20,
        condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
        rainProbability: Math.random() * 100,
    };
}

function generateMockForecastData(): ForecastData {
    const now = new Date();

    const hourly = Array.from({ length: 8 }, (_, i) => {
        const time = new Date(now.getTime() + i * 3600000);
        return {
            time: time.toISOString(),
            temperature: 25 + Math.random() * 10,
            humidity: 60 + Math.random() * 30,
            rainProbability: Math.random() * 100,
            condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
        };
    });

    const daily = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() + i * 86400000);
        return {
            date: date.toISOString().split('T')[0],
            tempMin: 20 + Math.random() * 5,
            tempMax: 30 + Math.random() * 10,
            humidity: 60 + Math.random() * 30,
            rainProbability: Math.random() * 100,
            condition: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
        };
    });

    return { hourly, daily };
}
