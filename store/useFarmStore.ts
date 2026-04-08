import { create } from 'zustand';

interface Farm {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    totalArea: number;
    soilType: string;
}

interface FarmState {
    selectedFarm: Farm | null;
    farms: Farm[];
    setSelectedFarm: (farm: Farm) => void;
    setFarms: (farms: Farm[]) => void;
}

export const useFarmStore = create<FarmState>((set) => ({
    selectedFarm: null,
    farms: [],
    setSelectedFarm: (farm) => set({ selectedFarm: farm }),
    setFarms: (farms) => set({ farms }),
}));
