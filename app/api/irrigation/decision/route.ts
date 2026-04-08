import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { calculateIrrigationDecision } from '@/lib/irrigation-engine';
import { fetchWeatherData } from '@/lib/weather-service';

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { fieldId } = await req.json();

        const field = await prisma.field.findUnique({
            where: { id: fieldId },
            include: {
                farm: true,
                crops: { where: { status: 'growing' }, orderBy: { createdAt: 'desc' }, take: 1 },
                soilData: { orderBy: { timestamp: 'desc' }, take: 1 },
            },
        });

        if (!field) {
            return NextResponse.json({ error: 'Field not found' }, { status: 404 });
        }

        const weather = await fetchWeatherData(field.farm.latitude, field.farm.longitude);
        const soilData = field.soilData[0];
        const crop = field.crops[0];

        if (!soilData || !crop) {
            return NextResponse.json({ error: 'Insufficient data' }, { status: 400 });
        }

        const decision = calculateIrrigationDecision({
            soilType: field.farm.soilType,
            cropType: crop.name,
            soilMoisture: soilData.moisture,
            temperature: weather.temperature,
            humidity: weather.humidity,
            rainProbability: weather.rainProbability,
            growthStage: crop.growthStage,
        });

        const log = await prisma.irrigationLog.create({
            data: {
                fieldId: field.id,
                decision: decision.decision,
                confidence: decision.confidence,
                waterAmount: decision.waterAmount,
                waterSaved: decision.waterSaved,
                reason: decision.reason,
                soilMoisture: soilData.moisture,
                temperature: weather.temperature,
                humidity: weather.humidity,
                rainProbability: weather.rainProbability,
            },
        });

        return NextResponse.json({ ...decision, logId: log.id });
    } catch (error) {
        console.error('Irrigation decision error:', error);
        return NextResponse.json({ error: 'Failed to calculate decision' }, { status: 500 });
    }
}
