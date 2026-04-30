
import React from 'react';
import { Equipment, InventorySlot, Item } from '../../types';
import {  ITEMS, getIconClassName, getIconUrl  } from '../../constants';
import Button from '../common/Button';
import { useUIState, TooltipState, ContextMenuState } from '../../hooks/useUIState';
import { ContextMenuOption } from '../common/ContextMenu';
import { useLongPress } from '../../hooks/useLongPress';
import { getIsTouchDevice, useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { getDisplayName, ItemIcon } from './InventorySlot';

interface EquipmentPanelProps {
    equipment: Equipment;
    inventory: (InventorySlot | null)[];
    coins: number;
    onUnequip: (slot: keyof Equipment) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    ui: ReturnType<typeof useUIState>;
    addLog: (message: string) => void;
    onExamine: (item: Item, quantity?: number) => void;
    isTouchSimulationEnabled: boolean;
    isOneClickMode: boolean;
    onTeleport: (itemSlot: InventorySlot, slotIdentifier: number | keyof Equipment, from: 'inventory' | keyof Equipment, poiId: string) => void;
}

const SLOT_PLACEHOLDERS: Record<keyof Equipment, string> = {
    head: 'light-helm',
    cape: 'cloak',
    necklace: 'gem-pendant',
    ammo: 'broadhead-arrow',
    weapon: 'broadsword',
    body: 'leather-vest',
    shield: 'shield',
    legs: 'armored-pants',
    gloves: 'gloves',
    boots: 'leather-boot',
    ring: 'ring',
};

interface EquipmentSlotDisplayProps {
    slotKey: keyof Equipment;
    itemSlot: InventorySlot | null;
    onUnequip: (slot: keyof Equipment) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    addLog: (message: string) => void;
    onExamine: (item: Item, quantity?: number) => void;
    isTouchSimulationEnabled: boolean;
    isOneClickMode: boolean;
    onTeleport: (itemSlot: InventorySlot, slotIdentifier: number | keyof Equipment, from: 'inventory' | keyof Equipment, poiId: string) => void;
}

const EquipmentSlotDisplay: React.FC<EquipmentSlotDisplayProps> = ({ slotKey, itemSlot, onUnequip, setTooltip, setContextMenu, addLog, onExamine, isTouchSimulationEnabled, isOneClickMode, onTeleport }) => {
    const item = itemSlot ? ITEMS[itemSlot.itemId] : null;

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (!item || !itemSlot) {
            const slotName = slotKey.charAt(0).toUpperCase() + slotKey.slice(1);
            setTooltip({
                content: <p className="font-bold text-yellow-300">{slotName} Slot</p>,
                position: { x: e.clientX, y: e.clientY }
            });
            return;
        }
        setTooltip({ item, slot: itemSlot, position: { x: e.clientX, y: e.clientY } });
    };

    const handleUnequip = () => { if (item) { onUnequip(slotKey); setTooltip(null); } };
    
    const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
        if (!item || !itemSlot) return;
        e.preventDefault();
        
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }
        
        const options: ContextMenuOption[] = [];
        
        const performAction = (action: () => void) => { action(); setTooltip(null); setContextMenu(null); };

        if (item.consumable?.teleportOptions) {
            const charges = itemSlot.charges ?? item.charges ?? 0;
            const isDisabled = item.destroyOnEmpty === false && charges <= 0;
            options.push({
                label: 'Rub',
                disabled: isDisabled,
                onClick: () => {
                    const teleportOptions: ContextMenuOption[] = item.consumable!.teleportOptions!.map(opt => ({
                        label: opt.label,
                        disabled: opt.disabled,
                        onClick: () => performAction(() => onTeleport(itemSlot, slotKey, slotKey, opt.poiId))
                    }));
                    setContextMenu({
                        options: teleportOptions,
                        title: getDisplayName(itemSlot),
                        triggerEvent: eventForMenu,
                        isTouchInteraction: 'touches' in e || 'changedTouches' in e,
                    });
                    return true; // Keep the menu open to show the sub-menu
                }
            });
        }
        
        options.push({ label: 'Unequip', onClick: () => performAction(handleUnequip) });
        
        const charges = itemSlot.charges ?? item.charges;
        if (charges !== undefined && !item.consumable?.teleportOptions) {
            options.push({
                label: 'Inspect',
                onClick: () => performAction(() => addLog(`Your ${item.name} has ${charges} charges left.`))
            });
        }
        
        options.push({ label: 'Examine', onClick: () => performAction(() => onExamine(item, itemSlot.quantity)) });
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: 'touches' in e || 'changedTouches' in e, title: getDisplayName(itemSlot) });
    };

    const handleSingleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (isOneClickMode) {
            handleContextMenu(e);
        } else {
            handleUnequip();
        }
    };

    const longPressHandlers = useLongPress({
        onLongPress: handleContextMenu,
        onClick: handleSingleTap,
    });

    return (
        <div
            data-tutorial-id={`equipment-slot-${slotKey}`}
            className="w-full aspect-square bg-gray-900 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-colors cursor-pointer hover:border-yellow-400"
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            {item && itemSlot ? (
                <>
                    <ItemIcon item={item} slot={itemSlot} className="w-full h-full" />
                    {itemSlot?.statsOverride?.poisoned && (
                        <img 
                            src={getIconUrl("boiling-bubbles")} 
                            alt="Poisoned"
                            className="poison-overlay-icon item-icon-uncut-emerald"
                            title="Poisoned"
                        />
                    )}
                    {item.stackable && itemSlot && itemSlot.quantity > 0 && (
                        <span className="absolute bottom-0 right-1 text-lg font-pixel-rpg font-bold text-yellow-300" style={{ textShadow: '1px 1px 1px black' }}>
                            {itemSlot.quantity > 999 ? `${Math.floor(itemSlot.quantity/1000)}k` : itemSlot.quantity.toLocaleString()}
                        </span>
                    )}
                </>
            ) : (
                <img src={getIconUrl(SLOT_PLACEHOLDERS[slotKey])} alt={slotKey} className="w-8 h-8 opacity-20 filter invert" />
            )}
        </div>
    );
};

const EmptySlot = () => <div className="w-full aspect-square" />;

const EquipmentPanel: React.FC<EquipmentPanelProps> = (props) => {
    const { equipment, inventory, coins, onUnequip, setTooltip, ui, addLog, onExamine, isTouchSimulationEnabled, isOneClickMode, onTeleport } = props;

    const equipmentSlotDisplayProps = {
        onUnequip,
        setTooltip,
        setContextMenu: ui.setContextMenu,
        addLog,
        onExamine,
        isTouchSimulationEnabled,
        isOneClickMode,
        onTeleport,
    };

    return (
        <div className="flex flex-col h-full text-gray-300 pt-2">
            <div className="flex flex-col justify-center items-center">
                <div className="grid grid-cols-3 gap-2 w-full max-w-[180px]">
                    <EmptySlot />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="head" itemSlot={equipment.head} />
                    <EmptySlot />

                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="cape" itemSlot={equipment.cape} />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="necklace" itemSlot={equipment.necklace} />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="ammo" itemSlot={equipment.ammo} />

                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="weapon" itemSlot={equipment.weapon} />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="body" itemSlot={equipment.body} />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="shield" itemSlot={equipment.shield} />

                    <EmptySlot />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="legs" itemSlot={equipment.legs} />
                    <EmptySlot />

                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="gloves" itemSlot={equipment.gloves} />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="boots" itemSlot={equipment.boots} />
                    <EquipmentSlotDisplay {...equipmentSlotDisplayProps} slotKey="ring" itemSlot={equipment.ring} />
                </div>
            </div>
            
            <div className="mt-auto pt-2 p-1 bg-gray-900 rounded-md border border-gray-600 grid grid-cols-3 gap-1 font-pixel-rpg">
                <button 
                    onClick={() => ui.setIsEquipmentStatsViewOpen(true)} 
                    onMouseEnter={(e) => setTooltip({ content: <p className="font-bold text-yellow-300">Equipment Stats</p>, position: { x: e.clientX, y: e.clientY } })}
                    onMouseLeave={() => setTooltip(null)}
                    className="text-center py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors leading-none truncate"
                >
                    Stats
                </button>
                 <button 
                    onClick={() => ui.setItemsOnDeathData({ inventory, equipment, coins })} 
                    onMouseEnter={(e) => setTooltip({ content: <p className="font-bold text-yellow-300">Items Kept on Death</p>, position: { x: e.clientX, y: e.clientY } })}
                    onMouseLeave={() => setTooltip(null)}
                    className="text-center py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors leading-none truncate"
                >
                    Death
                </button>
                <button 
                    onClick={() => ui.setPriceCheckerInventory(inventory)} 
                    onMouseEnter={(e) => setTooltip({ content: <p className="font-bold text-yellow-300">Price Checker</p>, position: { x: e.clientX, y: e.clientY } })}
                    onMouseLeave={() => setTooltip(null)}
                    className="text-center py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded border border-gray-500 transition-colors leading-none truncate"
                >
                    Price
                </button>
            </div>
        </div>
    );
};

export default EquipmentPanel;
