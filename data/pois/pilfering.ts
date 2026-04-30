import { POI, SkillName, ToolType } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const pilferingPois: Record<string, POI> = {
    pilfering_house_instance: {
        id: "pilfering_house_instance",
        name: "House Interior",
        description: "You've successfully picked the lock and slipped inside. You can hear the faint sounds of the street outside, but for now, you are alone. You'd better be quick before the owners return.",
        connections: [],
        activities: [
            {
                type: "npc",
                name: "Leave House",
                icon: "exit-door",
            },
        ],
        regionId: "wilderness",
        x: -1000,
        y: -1000,
        type: "internal",
    },
};
