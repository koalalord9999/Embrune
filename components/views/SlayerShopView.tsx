
import React, { useMemo, useCallback } from 'react';
import { InventorySlot, PlayerSlayerTask, ItemId } from '../../types';
import { SHOPS, ITEMS, getIconClassName, getIconUrl } from '../../constants';
import Button from '../common/Button';
import { ContextMenuState, MakeXPrompt, TooltipState } from '../../hooks/useUIState';
import { ContextMenuOption } from '../common/ContextMenu';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { getDisplayName } from '../panels/InventorySlot';

const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400';
    if (quantity >= 100000) return 'text-white';
    return 'text-yellow-300';
};

const formatItemQuantity = (quantity: number): string => {
    if (quantity >= 1000000000) return `${Math.floor(quantity / 1000000000)}B`;
    if (quantity >= 1000000) return `${Math.floor(quantity / 1000000)}M`;
    if (quantity >= 10000) return `${Math.floor(quantity / 1000)}k`;
    return quantity.toLocaleString();
};

interface SlayerShopSlotProps {
    slot: InventorySlot;
    price: number;
    stock: number;
    shopId: string;
    slayerCredits: number;
    onBuy: (itemId: string, quantity: number) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isOneClickMode: boolean;
    addLog: (message: string) => void;
}

const SlayerShopSlot: React.FC<SlayerShopSlotProps> = ({ slot, price, stock, shopId, slayerCredits, onBuy, setContextMenu, setMakeXPrompt, setTooltip, isOneClickMode, addLog }) => {
    const item = ITEMS[slot.itemId];
    if (!item) return <div className="w-full aspect-square bg-gray-900 border border-gray-700 rounded-md" />;

    const handleContextMenu = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) eventForMenu = e.touches[0];
        else if ('changedTouches' in e && e.changedTouches.length > 0) eventForMenu = e.changedTouches[0];
        else eventForMenu = e as React.MouseEvent;

        const maxBuyableByCredits = price > 0 ? Math.floor(slayerCredits / price) : Infinity;
        const maxBuyable = Math.min(maxBuyableByCredits, stock);

        const performBuyAction = (quantity: number) => { onBuy(slot.itemId, quantity); setContextMenu(null); };

        const options: ContextMenuOption[] = [
            { label: `Buy 1 (${price})`, onClick: () => performBuyAction(1), disabled: maxBuyable < 1 },
        ];

        // Only allow "Buy X" for stackable items or items that aren't special services
        if (item.stackable && !['slayer_task_expansion', 'slayer_task_shrink', 'slayer_rune_pack'].includes(item.id)) {
            options.push({ label: 'Buy X...', onClick: () => { setContextMenu(null); setMakeXPrompt({ title: `Buy ${item.name}`, max: maxBuyable, onConfirm: (quantity) => performBuyAction(quantity) }); }, disabled: maxBuyable < 1 });
        }

        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: 'touches' in e || 'changedTouches' in e, title: getDisplayName(slot) });
    };

    const handleSingleTap = () => addLog(`[${getDisplayName(slot)}] Price: ${price} Slayer Credits.`);
    const combinedHandlers = useLongPress({ onLongPress: handleContextMenu, onClick: handleSingleTap, isOneClickMode });
    
    const handleMouseEnter = (e: React.MouseEvent) => {
        const priceInfo = (
            <>
                {item.description && <p className="text-sm text-gray-300 mt-1 italic">{item.description}</p>}
                <p className="text-sm mt-2">Price: <span className="font-semibold text-yellow-400">{price} Slayer Credits</span></p>
                {item.id === 'slayer_task_expansion' && <p className="text-xs text-red-300 mt-1">* Task progress must be 0</p>}
                {item.id === 'slayer_task_shrink' && <p className="text-xs text-red-300 mt-1">* Task progress must be 0</p>}
            </>
        );
        setTooltip({ item, slot, content: priceInfo, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div
            className="w-full aspect-square bg-gray-800 border-2 border-gray-600 rounded-md flex items-center justify-center p-1 relative transition-colors cursor-pointer hover:border-yellow-400"
            {...combinedHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <img src={getIconUrl(item.iconUrl)} alt={item.name} className={`w-full h-full ${getIconClassName(item)}`} />
            {stock > 1 && <span className={`absolute bottom-0 right-1 text-xs font-bold ${getQuantityColor(stock)}`} style={{ textShadow: '1px 1px 1px black' }}>{formatItemQuantity(stock)}</span>}
        </div>
    );
};

interface SlayerShopViewProps {
    shopId: string;
    inventory: (InventorySlot | null)[];
    onExit: () => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    addLog: (message: string) => void;
    modifyItem: (itemId: string, quantity: number, quiet?: boolean, slotOverrides?: Partial<Omit<InventorySlot, 'itemId' | 'quantity'>> & { bypassAutoBank?: boolean }) => void;
    isOneClickMode: boolean;
    slayerCredits: number;
    setSlayerCredits: (credits: number) => void;
    slayerTask: PlayerSlayerTask | null;
    expandTask: () => boolean;
    shrinkTask: () => boolean;
}

const SlayerShopView: React.FC<SlayerShopViewProps> = (props) => {
    const { 
        shopId, inventory, onExit, setContextMenu, setMakeXPrompt, setTooltip, addLog, modifyItem, 
        isOneClickMode, slayerCredits, setSlayerCredits, slayerTask, expandTask, shrinkTask 
    } = props;
    
    const shop = SHOPS[shopId];

    const handleBuy = useCallback((itemId: string, quantity: number) => {
        const itemData = ITEMS[itemId];
        const shopItem = shop.inventory.find(i => i.itemId === itemId);
        if (!itemData || !shopItem) return;

        const price = shopItem.priceModifier;
        const totalCost = price * quantity;
        
        if (slayerCredits < totalCost) {
            addLog("You don't have enough Slayer Credits.");
            return;
        }

        // --- Special Service Validation ---
        if (itemId === 'slayer_task_expansion' || itemId === 'slayer_task_shrink') {
            if (!slayerTask) {
                addLog("You do not have an active slayer task.");
                return;
            }
            if (slayerTask.isComplete) {
                addLog("Your current task is already complete.");
                return;
            }
            if (slayerTask.progress > 0) {
                addLog("You can only use this service before starting your task (progress must be 0).");
                return;
            }
        }

        // --- Inventory Space Check ---
        let freeSlots = inventory.filter(s => s === null).length;
        
        // Special case: Rune Pack needs at least 1 or 2 slots depending on what you already have
        if (itemId === 'slayer_rune_pack') {
            const hasNexus = inventory.some(s => s?.itemId === 'nexus_rune' as ItemId);
            const hasGust = inventory.some(s => s?.itemId === 'gust_rune' as ItemId);
            let slotsNeeded = 0;
            if (!hasNexus) slotsNeeded++;
            if (!hasGust) slotsNeeded++;
            if (freeSlots < slotsNeeded) {
                addLog("You don't have enough inventory space for the runes.");
                return;
            }
        } else if (!['slayer_task_expansion', 'slayer_task_shrink'].includes(itemId)) {
             // Normal items (x_mix)
             const hasStack = inventory.some(s => s?.itemId === itemId);
             if (freeSlots < 1 && !itemData.stackable && !hasStack) {
                 addLog("Your inventory is full.");
                 return;
             }
        }

        // --- Execute Purchase ---
        if (itemId === 'slayer_task_expansion') {
            if (expandTask()) {
                setSlayerCredits(slayerCredits - totalCost);
            }
        } else if (itemId === 'slayer_task_shrink') {
            if (shrinkTask()) {
                setSlayerCredits(slayerCredits - totalCost);
            }
        } else if (itemId === 'slayer_rune_pack') {
            setSlayerCredits(slayerCredits - totalCost);
            modifyItem('nexus_rune', 100, false, { bypassAutoBank: true });
            modifyItem('gust_rune', 500, false, { bypassAutoBank: true });
            addLog(`You bought a Rune Pack for ${totalCost} Slayer Credits.`);
        } else if (itemId === 'x_mix') {
            setSlayerCredits(slayerCredits - totalCost);
            modifyItem('x_mix', quantity * 15, false, { bypassAutoBank: true });
            addLog(`You bought ${quantity}x sets of X Mix for ${totalCost} Slayer Credits.`);
        } else {
            // General item purchase (if any others added later)
            setSlayerCredits(slayerCredits - totalCost);
            modifyItem(itemId, quantity, false, { bypassAutoBank: true });
            addLog(`You bought ${quantity}x ${itemData.name} for ${totalCost} Slayer Credits.`);
        }
    }, [slayerCredits, inventory, modifyItem, addLog, shop.inventory, slayerTask, expandTask, shrinkTask, setSlayerCredits]);
    
    if (!shop) return <div className="p-4 text-center">Loading shop...</div>;

    return (
        <div className="flex flex-col h-full text-gray-200 animate-fade-in font-pixel-rpg">
            <div className="flex justify-between items-center p-4 border-b-2 border-gray-600 flex-shrink-0 bg-gray-900/80">
                <div>
                    <h1 className="text-3xl font-bold text-yellow-500">{shop.name}</h1>
                    <p className="text-yellow-200">Your Credits: <span className="font-bold">{slayerCredits.toLocaleString()}</span></p>
                </div>
                <Button onClick={onExit} variant="secondary">Exit</Button>
            </div>
            
            <div className="flex-grow min-h-0 p-4 bg-gray-800/40">
                <div className="bg-black/40 p-4 rounded-lg border border-gray-600 flex flex-col h-full">
                    <h2 className="text-xl font-semibold mb-4 text-center text-yellow-400 border-b border-gray-700 pb-2">Master's Rewards</h2>
                    <div className="flex-grow overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 content-start">
                        {shop.inventory.map(({ itemId, priceModifier, quantity }) => {
                            const item = ITEMS[itemId];
                            if (!item) return null;
                            
                            return (
                                <SlayerShopSlot
                                    key={itemId}
                                    slot={{ itemId, quantity: 1 }}
                                    price={priceModifier}
                                    stock={quantity}
                                    setTooltip={setTooltip}
                                    isOneClickMode={isOneClickMode}
                                    addLog={addLog}
                                    shopId={shopId}
                                    slayerCredits={slayerCredits}
                                    onBuy={handleBuy}
                                    setContextMenu={setContextMenu}
                                    setMakeXPrompt={setMakeXPrompt}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/50 rounded text-sm text-blue-200 italic">
                        "Credits are earned by completing tasks. Streaks grant massive bonuses."
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlayerShopView;
