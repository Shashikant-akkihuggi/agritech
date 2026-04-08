import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { phone, name, password, language } = await req.json();

        // Validate input
        if (!phone || !name || !password) {
            return NextResponse.json({
                error: 'Missing required fields: phone, name, and password are required'
            }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({
                error: 'Password must be at least 6 characters long'
            }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: { phone, name, password: hashedPassword, language: language || 'en' },
        });

        const token = generateToken({ userId: user.id, phone: user.phone });

        return NextResponse.json({
            user: { id: user.id, phone: user.phone, name: user.name, language: user.language },
            token,
        });
    } catch (error: any) {
        console.error('Registration error:', error);

        // Provide more specific error messages
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
        }

        if (error.code === 'P2021' || error.message?.includes('does not exist')) {
            return NextResponse.json({
                error: 'Database not initialized. Please run: npm run db:push'
            }, { status: 500 });
        }

        if (error.message?.includes('connect') || error.code === 'P1001') {
            return NextResponse.json({
                error: 'Cannot connect to database. Check your DATABASE_URL in .env'
            }, { status: 500 });
        }

        return NextResponse.json({
            error: error.message || 'Registration failed. Please check server logs.'
        }, { status: 500 });
    }
}
