import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { fetchWeatherData, fetchForecastData } from '@/lib/weather-service';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lon = parseFloat(searchParams.get('lon') || '0');
        const type = searchParams.get('type') || 'current';

        if (type === 'forecast') {
            const forecast = await fetchForecastData(lat, lon);
            return NextResponse.json(forecast);
        }

        const weather = await fetchWeatherData(lat, lon);
        return NextResponse.json(weather);
    } catch (error) {
        console.error('Weather fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
