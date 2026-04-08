import axios from 'axios';

export interface MandiPrice {
    commodity: string;
    market: string;
    state: string;
    district: string;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    date: string;
}

export async function fetchMandiPrices(commodity?: string): Promise<MandiPrice[]> {
    // TODO: Integrate with AGMARKNET API
    // For now, return empty array until real API is configured
    console.warn('AGMARKNET API not configured. Marketplace prices unavailable.');
    return [];
}

export async function fetchCommodityTrend(commodity: string, days: number = 30): Promise<Array<{ date: string; price: number }>> {
    // TODO: Integrate with AGMARKNET API for historical data
    console.warn('AGMARKNET API not configured. Price trends unavailable.');
    return [];
}
