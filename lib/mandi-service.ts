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
    // Mock data - replace with actual AGMARKNET API when available
    return generateMockMandiPrices(commodity);
}

function generateMockMandiPrices(commodity?: string): MandiPrice[] {
    const commodities = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Tomato', 'Potato', 'Onion'];
    const markets = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'];
    const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Telangana', 'Maharashtra', 'Gujarat'];

    const targetCommodities = commodity ? [commodity] : commodities;

    return targetCommodities.flatMap((comm, idx) => {
        return markets.slice(0, 3).map((market, midx) => {
            const basePrice = 2000 + Math.random() * 3000;
            return {
                commodity: comm,
                market: market,
                state: states[midx],
                district: market,
                minPrice: basePrice * 0.9,
                maxPrice: basePrice * 1.1,
                modalPrice: basePrice,
                date: new Date().toISOString().split('T')[0],
            };
        });
    });
}

export async function fetchCommodityTrend(commodity: string, days: number = 30): Promise<Array<{ date: string; price: number }>> {
    const trend = [];
    const basePrice = 2000 + Math.random() * 3000;
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 86400000);
        const variance = (Math.random() - 0.5) * 200;
        trend.push({
            date: date.toISOString().split('T')[0],
            price: basePrice + variance,
        });
    }

    return trend;
}
