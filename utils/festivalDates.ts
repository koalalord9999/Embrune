export function getMemorialDay(year: number): Date {
    // Last Monday of May
    const date = new Date(year, 4, 31); // May 31
    while (date.getDay() !== 1) date.setDate(date.getDate() - 1);
    return date;
}

export function isFestivalActive(): boolean {
    // DEV OVERRIDE: For testing/evaluation, allow override via localStorage or environment
    if (typeof window !== 'undefined' && window.localStorage?.getItem('force_festival_active') === 'true') {
        return true;
    }
    
    const now = new Date();
    const start = getMemorialDay(now.getUTCFullYear());
    // Second Sunday after Memorial Day
    const end = new Date(start);
    end.setDate(start.getDate() + 13); // +13 days reaches the second Sunday
    // Advance to the Sunday of that week
    while (end.getDay() !== 0) end.setDate(end.getDate() + 1);
    end.setHours(23, 59, 59, 999); // inclusive of end day
    return now >= start && now <= end;
}
