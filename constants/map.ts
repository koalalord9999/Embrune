

export const MAP_DIMENSIONS = {
    width: 2000,
    height: 2000,
};

export const CITY_MAP_DIMENSIONS = {
    width: 500,
    height: 500,
};

export const MAP_CONFIGS: Record<string, {
    dimensions: { width: number, height: number },
    backgroundUrl: string,
    title: string
}> = {
    mainland: {
        dimensions: MAP_DIMENSIONS,
        backgroundUrl: 'https://images.unsplash.com/photo-1505236755279-228d5d36c34b?q=80&w=1024&auto=format=fit=crop',
        title: 'World Map'
    },
    slayers_respite: {
        dimensions: { width: 2000, height: 2000 },
        backgroundUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1024&auto=format=fit=crop',
        title: "Slayer's Respite Map"
    }
};