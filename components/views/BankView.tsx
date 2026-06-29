
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { InventorySlot, Item, BankTab } from '../../types';
import {  ITEMS, BANK_CAPACITY, getIconClassName, MAX_BANK_TABS, getIconUrl  } from '../../constants';
import Button from '../common/Button';
import { ContextMenuOption } from '../common/ContextMenu';
import { MakeXPrompt, TooltipState, ContextMenuState, useUIState, WithdrawMode } from '../../hooks/useUIState';
import { useLongPress } from '../../hooks/useLongPress';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { getDisplayName, ItemIcon } from '../panels/InventorySlot';

const formatQuantity = (quantity: number): string => {
    if (quantity >= 1000000000) return `${Math.floor(quantity / 1000000000)}B`;
    if (quantity >= 1000000) return `${Math.floor(quantity / 1000000)}M`;
    if (quantity >= 10000) return `${Math.floor(quantity / 1000)}k`;
    return quantity.toLocaleString();
};

const getQuantityColor = (quantity: number): string => {
    if (quantity >= 10000000) return 'text-green-400';
    if (quantity >= 100000) return 'text-white';
    return 'text-yellow-300';
};

interface BankSlotProps {
    slot: InventorySlot | null;
    index: number;
    asNote: boolean;
    activeTabId: number;
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean) => void;
    onPrimaryAction: () => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    isOneClickMode: boolean;
    onClearPlaceholder: (tabId: number, itemIndex: number) => void;
    isDraggable: boolean;
    isDragging: boolean;
    isDragOver: boolean;
    onDragStart: (e: React.DragEvent, index: number, tabId: number) => void;
    onDragOver: (e: React.DragEvent, index: number) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent, index: number) => void;
    onDragEnd: () => void;
    // Primitive props for stable positioning
    row: number;
    col: number;
    rowHeight: number;
    colWidth: number;
    onExamine: (item: Item, quantity?: number) => void;
}

const BankSlot: React.FC<BankSlotProps> = React.memo((props) => {
    const { 
        slot, index, asNote, activeTabId, onWithdraw, onPrimaryAction, 
        setContextMenu, setMakeXPrompt, setTooltip, isOneClickMode, onClearPlaceholder,
        isDraggable, isDragging, isDragOver, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
        row, col, rowHeight, colWidth,
        onExamine
    } = props;

    const isTouchDevice = useIsTouchDevice(false);
    const isPlaceholder = slot?.quantity === 0;

    const performWithdrawAction = (quantity: number | 'all' | 'all-but-1') => {
        if (isPlaceholder) return;
        onWithdraw(index, quantity, asNote);
        setTooltip(null);
    };

    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) {
            eventForMenu = e.touches[0];
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
            eventForMenu = e.changedTouches[0];
        } else {
            eventForMenu = e as React.MouseEvent;
        }

        const item = slot ? ITEMS[slot.itemId] : null;
        if (!slot || !item) return;
        
        const performActionAndClose = (action: () => void) => { action(); setTooltip(null); setContextMenu(null); };

        if (isPlaceholder) {
            setContextMenu({
                options: [
                    { label: 'Clear placeholder', onClick: () => performActionAndClose(() => onClearPlaceholder(activeTabId, index)) },
                    { label: 'Examine', onClick: () => { setTooltip(null); setContextMenu(null); onExamine(item, 0); } }
                ],
                triggerEvent: eventForMenu,
                isTouchInteraction: 'touches' in e || 'changedTouches' in e,
                title: getDisplayName(slot)
            });
            return;
        }

        const options: ContextMenuOption[] = [
            { label: `Withdraw 1`, onClick: () => performActionAndClose(() => performWithdrawAction(1)), disabled: slot.quantity < 1 || isPlaceholder },
        ];
        if (slot.quantity > 1) {
            options.push({ label: `Withdraw 5`, onClick: () => performActionAndClose(() => performWithdrawAction(5)), disabled: slot.quantity < 5 || isPlaceholder });
            options.push({ label: `Withdraw 10`, onClick: () => performActionAndClose(() => performWithdrawAction(10)), disabled: slot.quantity < 10 || isPlaceholder });
            options.push({
                label: 'Withdraw X...',
                onClick: () => {
                    setContextMenu(null);
                    setMakeXPrompt({
                        title: `Withdraw ${item.name}`,
                        max: slot.quantity,
                        onConfirm: (quantity) => performWithdrawAction(quantity)
                    });
                },
                disabled: slot.quantity < 1 || isPlaceholder
            });
            options.push({ label: `Withdraw All-but-1`, onClick: () => performActionAndClose(() => performWithdrawAction('all-but-1')), disabled: slot.quantity < 2 || isPlaceholder });
            options.push({ label: `Withdraw All`, onClick: () => performActionAndClose(() => performWithdrawAction('all')), disabled: isPlaceholder });
        }
        options.push({ label: 'Examine', onClick: () => { setTooltip(null); setContextMenu(null); onExamine(item, slot.quantity); } });
        setContextMenu({ options, triggerEvent: eventForMenu, isTouchInteraction: isTouchDevice, title: getDisplayName(slot) });
    };

    const handleSingleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (slot && !isPlaceholder) {
            if ('shiftKey' in e && e.shiftKey) {
                performWithdrawAction('all');
            } else {
                onPrimaryAction();
            }
        }
    };

    const combinedHandlers = { 
        ...useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap, isOneClickMode }),
        draggable: isDraggable,
        onDragStart: (e: React.DragEvent) => onDragStart(e, index, activeTabId),
        onDragOver: (e: React.DragEvent) => onDragOver(e, index),
        onDragLeave,
        onDrop: (e: React.DragEvent) => onDrop(e, index),
        onDragEnd
    };
    const item = slot ? ITEMS[slot.itemId] : null;

    return (
        <div {...combinedHandlers}
            onMouseEnter={(e) => {
                if (item && slot) {
                    const content = isPlaceholder ? null : <p className="text-sm mt-1 text-gray-400">Quantity: {slot.quantity.toLocaleString()}</p>;
                    setTooltip({ item, slot, content, position: { x: e.clientX, y: e.clientY } });
                }
            }}
            onMouseLeave={() => setTooltip(null)}
            className={`bg-gray-900 border-2 border-gray-700 rounded-md flex items-center justify-center p-1 absolute transition-all duration-150 ${slot ? 'cursor-grab' : ''} ${isDragging ? 'opacity-25' : ''} ${isDragOver ? 'border-green-400 scale-105 bg-green-900/50' : slot ? 'cursor-pointer hover:border-yellow-400' : ''}`}
            data-bank-index={index}
            style={{ 
                left: col * colWidth, 
                top: row * rowHeight, 
                width: 80, 
                height: 80, 
                willChange: 'transform, opacity' // Hardware acceleration
            }}
        >
            {slot && item && (
                <>
                    <ItemIcon 
                        item={item} 
                        slot={slot} 
                        className="w-full h-full" 
                        style={isPlaceholder ? { opacity: 0.1 } : undefined} 
                    />
                    {slot.statsOverride?.poisoned && (
                        <img 
                            src={getIconUrl("boiling-bubbles")} 
                            alt="Poisoned"
                            className="poison-overlay-icon item-icon-uncut-emerald"
                            title="Poisoned"
                        />
                    )}
                    <span className={`absolute bottom-0 right-1 text-lg font-pixel-rpg font-bold ${getQuantityColor(slot.quantity)} ${isPlaceholder ? 'opacity-20' : ''}`} style={{ textShadow: '1px 1px 1px black' }}>
                        {isPlaceholder ? '0' : formatQuantity(slot.quantity)}
                    </span>
                </>
            )}
        </div>
    );
});

interface BankViewProps {
    bank: BankTab[];
    onClose: () => void;
    onWithdraw: (bankIndex: number, quantity: number | 'all' | 'all-but-1', asNote: boolean, activeTabId: number) => void;
    onDepositBackpack: () => void;
    onDepositEquipment: () => void;
    onMoveItem: (from: number, to: number, activeTabId: number) => void;
    onAddTab: () => void;
    onRemoveTab: (tabId: number) => void;
    onMoveItemToTab: (fromItemIndex: number, fromTabId: number, toTabId: number) => void;
    onRenameTab: (tabId: number, newName: string) => void;
    setContextMenu: (menu: ContextMenuState | null) => void;
    setMakeXPrompt: (prompt: MakeXPrompt | null) => void;
    setTooltip: (tooltip: TooltipState | null) => void;
    bankPlaceholders: boolean;
    handleToggleBankPlaceholders: () => void;
    ui: ReturnType<typeof useUIState>;
    isOneClickMode: boolean;
    onClearPlaceholder: (tabId: number, itemIndex: number) => void;
    onExamine: (item: Item, quantity?: number) => void;
}

const ITEM_SIZE = 88; // 80px slot + 8px gap
const VISIBLE_BUFFER = 3; // extra rows at top/bottom

const BankView: React.FC<BankViewProps> = (props) => {
    const { 
        bank, onClose, onWithdraw, onDepositBackpack, onDepositEquipment, onMoveItem, 
        onAddTab, onRemoveTab, onMoveItemToTab, onRenameTab, setContextMenu, 
        setMakeXPrompt, setTooltip, bankPlaceholders, handleToggleBankPlaceholders, 
        ui, isOneClickMode, onClearPlaceholder, onExamine
    } = props;
    
    const { activeBankTabId, setActiveBankTabId, activeWithdrawMode, setActiveWithdrawMode, customWithdrawAmount, setCustomWithdrawAmount } = ui;
    const [draggingIndex, setDraggingIndex] = useState<{ tabId: number; index: number } | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [dragOverTabId, setDragOverTabId] = useState<number | null>(null);
    const [withdrawAsNote, setWithdrawAsNote] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Virtualization state
    const [scrollTop, setScrollTop] = useState(0);
    const [containerWidth, setContainerWidth] = useState(600);
    const [containerHeight, setContainerHeight] = useState(400);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollFrameId = useRef<number | null>(null);

    const isTouchDevice = useIsTouchDevice(false);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const activeTab = bank.find(t => t.id === activeBankTabId) ?? bank[0];

    // Measure container size
    useEffect(() => {
        const panel = scrollContainerRef.current;
        if (!panel) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width);
                setContainerHeight(entry.contentRect.height);
            }
        });

        resizeObserver.observe(panel);
        return () => resizeObserver.disconnect();
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (!isScrolling) setIsScrolling(true);
        if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
        scrollEndTimer.current = setTimeout(() => setIsScrolling(false), 150);

        // Throttled scroll state update via rAF
        if (scrollFrameId.current) cancelAnimationFrame(scrollFrameId.current);
        const st = e.currentTarget.scrollTop;
        scrollFrameId.current = requestAnimationFrame(() => {
            setScrollTop(st);
        });
    }, [isScrolling]);

    useEffect(() => {
        return () => {
            if (scrollFrameId.current) cancelAnimationFrame(scrollFrameId.current);
            if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
        };
    }, []);


    const itemsToDisplay = useMemo(() => {
        if (!searchTerm) {
            return (activeTab?.items ?? []).map((slot, index) => ({
                slot,
                tabId: activeTab.id,
                index
            }));
        }
        const results: { slot: InventorySlot | null; tabId: number; index: number }[] = [];
        bank.forEach(tab => {
            tab.items.forEach((slot, index) => {
                if (!slot) return;
                const itemData = ITEMS[slot.itemId];
                if (itemData && itemData.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push({ slot, tabId: tab.id, index });
                }
            });
        });
        return results;
    }, [activeTab, bank, searchTerm]);

    const totalBankedItems = useMemo(() => {
        return bank.reduce((total, tab) => total + tab.items.filter(item => item !== null && item.quantity > 0).length, 0);
    }, [bank]);

    const virtualization = useMemo(() => {
        const gap = 8;
        const availableWidth = containerWidth - 16; // padding
        const cols = Math.max(1, Math.floor((availableWidth + gap) / (80 + gap)));
        const totalRows = Math.ceil(itemsToDisplay.length / cols);
        
        const rowHeight = ITEM_SIZE;
        const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - VISIBLE_BUFFER);
        const endRow = Math.min(totalRows, Math.ceil((scrollTop + containerHeight) / rowHeight) + VISIBLE_BUFFER);
        
        return {
            cols,
            totalRows,
            startIndex: startRow * cols,
            endIndex: endRow * cols,
            totalHeight: totalRows * rowHeight,
            rowHeight,
            colWidth: 80 + gap
        };
    }, [containerWidth, containerHeight, scrollTop, itemsToDisplay.length]);


    const handleToggleClick = (mode: WithdrawMode) => {
        setActiveWithdrawMode(mode);
        if (mode !== 'x') setCustomWithdrawAmount(null);
    };

    const handleSlotPrimaryAction = useCallback((itemInfo: { slot: InventorySlot | null, tabId: number, index: number }) => {
        const { slot, tabId, index: realIndex } = itemInfo;
        if (!slot || slot.quantity === 0) return;

        let quantityToWithdraw: number | 'all' = 1;
        if (activeWithdrawMode === 'all') quantityToWithdraw = 'all';
        else if (activeWithdrawMode === 'x') {
            if (customWithdrawAmount !== null) quantityToWithdraw = customWithdrawAmount;
            else {
                const item = ITEMS[slot.itemId];
                setMakeXPrompt({
                    title: `Withdraw ${item.name}`,
                    max: slot.quantity,
                    onConfirm: (val) => {
                        setCustomWithdrawAmount(val);
                        onWithdraw(realIndex, val, withdrawAsNote, tabId);
                    }
                });
                return;
            }
        } else quantityToWithdraw = activeWithdrawMode;

        onWithdraw(realIndex, quantityToWithdraw, withdrawAsNote, tabId);
        setTooltip(null);
    }, [activeWithdrawMode, customWithdrawAmount, onWithdraw, setCustomWithdrawAmount, setMakeXPrompt, setTooltip, withdrawAsNote]);

    const handleDragStart = useCallback((e: React.DragEvent, displayIndex: number, tabId: number) => {
        setTooltip(null);
        if (searchTerm) { e.preventDefault(); return; }
        e.dataTransfer.setData('application/json', JSON.stringify({ index: displayIndex, tabId }));
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => setDraggingIndex({ index: displayIndex, tabId }), 0);
    }, [searchTerm, setTooltip]);

    const handleDragOver = useCallback((e: React.DragEvent, realIndex: number) => {
        e.preventDefault();
        if (draggingIndex !== null) setDragOverIndex(realIndex);
    }, [draggingIndex]);

    const handleDragLeave = useCallback(() => {
        setDragOverIndex(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, toDisplayIndex: number) => {
        e.preventDefault();
        setTooltip(null);
        if (searchTerm) return;
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.tabId === activeBankTabId && data.index !== toDisplayIndex) {
                onMoveItem(data.index, toDisplayIndex, activeBankTabId);
            }
        } catch (error) { console.error("Drop failed:", error); }
        setDraggingIndex(null);
        setDragOverIndex(null);
    }, [activeBankTabId, onMoveItem, searchTerm, setTooltip]);

    const handleDragEnd = useCallback(() => {
        setDraggingIndex(null);
        setDragOverIndex(null);
        setTooltip(null);
    }, [setTooltip]);

    const handleTabDrop = (e: React.DragEvent, toTabId: number) => {
        e.preventDefault();
        setDragOverTabId(null);
        if (searchTerm) return;
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data && data.tabId !== toTabId) {
                onMoveItemToTab(data.index, data.tabId, toTabId);
            }
        } catch (error) { console.error("Tab drop failed:", error); }
    };
    
    const handleTouchStart = (e: React.TouchEvent) => {
        if (draggingIndex !== null || searchTerm) return;
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        let currentElement = target;
        let index = -1;
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-bank-index');
            if (indexStr) { index = parseInt(indexStr, 10); break; }
            currentElement = currentElement.parentElement;
        }
        if (index > -1 && itemsToDisplay[index]?.slot) {
            holdTimer.current = setTimeout(() => {
                const itemInfo = itemsToDisplay[index];
                setDraggingIndex({ index: itemInfo.index, tabId: itemInfo.tabId });
            }, 100);
        }
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (draggingIndex === null) {
            if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
            return;
        }
        if (e.cancelable) e.preventDefault();
        const touch = e.touches[0];
        const overElement = document.elementFromPoint(touch.clientX, touch.clientY);
        let targetDisplayIndex: number | null = null;
        let currentElement = overElement;
        while (currentElement) {
            const indexStr = currentElement.getAttribute('data-bank-index');
            if (indexStr) { targetDisplayIndex = parseInt(indexStr, 10); break; }
            currentElement = currentElement.parentElement;
        }
        if (targetDisplayIndex !== null && itemsToDisplay[targetDisplayIndex]) {
            setDragOverIndex(itemsToDisplay[targetDisplayIndex].index);
        } else setDragOverIndex(null);
    }, [draggingIndex, itemsToDisplay]);

    const handleTouchEnd = () => {
        if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
        if (draggingIndex && dragOverIndex !== null) {
            if (draggingIndex.tabId === activeBankTabId && draggingIndex.index !== dragOverIndex) {
                 onMoveItem(draggingIndex.index, dragOverIndex, draggingIndex.tabId);
            }
        }
        setDraggingIndex(null);
        setDragOverIndex(null);
    };
    
    useEffect(() => {
        const panel = scrollContainerRef.current;
        if (!panel) return;
        panel.addEventListener('touchmove', handleTouchMove, { passive: false });
        return () => panel.removeEventListener('touchmove', handleTouchMove);
    }, [handleTouchMove]);

    const handleTabContextMenu = (e: React.MouseEvent, tab: BankTab) => {
        e.preventDefault();
        setContextMenu({
            triggerEvent: e, isTouchInteraction: isTouchDevice,
            options: [
                { label: 'Rename', onClick: () => {
                    const newName = window.prompt("Enter new tab name (max 12 chars):", tab.name);
                    if (newName) onRenameTab(tab.id, newName);
                }},
                { label: 'Delete Tab', onClick: () => onRemoveTab(tab.id), disabled: tab.id === 0 },
            ],
        });
    };
    
    const handleTabClick = (tabId: number) => {
        setActiveBankTabId(tabId);
        setTooltip(null);
    };

    const handleStartTutorial = useCallback(() => {
        ui.setActiveTutorial({
            id: 'bank-tour',
            currentStepIndex: 0,
            steps: [
                { targetId: 'bank-container', description: <p>Welcome to the <span className="text-yellow-400 font-bold">Bank of Embrune</span>! Here you can store your valuables safely. Even if you fall in battle, items kept here remain secure.</p> },
                { targetId: 'bank-tabs', description: <p>These are your <span className="text-yellow-300 font-bold">Bank Tabs</span>. You can organize your items by dragging them into different tabs. You can have up to 6 tabs!</p> },
                { targetId: 'bank-item-grid', description: <p>This is the <span className="text-yellow-300 font-bold">Main Vault</span>. It shows all the items in your current tab. Click an item to withdraw it, or drag to reorganize.</p> },
                { targetId: 'bank-quantity-toggles', description: <p>Choose <span className="text-yellow-300 font-bold">how many</span> items you want to move at once. Select 1, 5, 10, or 'All'. Use 'X' to set a custom amount.</p> },
                { targetId: 'bank-withdraw-mode', description: <p>You can withdraw items as physical objects or as <span className="text-yellow-300 font-bold">Bank Notes</span>. Notes stack in your bag, making them easier to carry in bulk!<br /><br />However, these cannot be used as normal items. It's great for trading with players (NYI) or selling to a shop in large quantities.</p> },
                { targetId: 'bank-search', description: <p>Need to find something specific? Use the <span className="text-yellow-300 font-bold">Search Bar</span> to filter items across all your tabs instantly.</p> },
                { targetId: 'bank-deposit-backpack', description: <p>Need space? Click this to <span className="text-yellow-300 font-bold">deposit everything</span> currently in your inventory into the bank.</p> },
                { targetId: 'bank-deposit-equipment', description: <p>Use this to quickly <span className="text-yellow-300 font-bold">deposit all equipped items</span>. Great for changing gear sets in a hurry!</p> },
                { targetId: 'bank-placeholders', description: <p>This padlock icon toggles <span className="text-yellow-300 font-bold">Bank Placeholders</span>. When ON, withdrawing all of an item leaves a slot so your bank stays organized.</p> },
                { targetId: 'bank-exit', description: <p>That's the basics! Click <span className="text-yellow-300 font-bold">Exit Bank</span> when you're finished to return to the world.</p> },
            ]
        });
    }, [ui]);

    return (
        <div data-tut="bank-container" className="flex flex-col h-[60vh] min-h-[380px] md:h-full max-h-[500px] md:max-h-none animate-fade-in text-gray-200" onClick={() => setTooltip(null)}>
            <div className="flex justify-between items-start mb-2 pb-2 border-b-2 border-gray-600">
                <h1 className="text-3xl font-bold text-yellow-400">Bank of Embrune</h1>
                <div className="text-right">
                    <p className="text-gray-400">{totalBankedItems} / {BANK_CAPACITY} Slots Used</p>
                    <div className="flex gap-2 items-center mt-1">
                        <Button onClick={handleStartTutorial} size="sm" variant="secondary" className="w-8 h-8 flex items-center justify-center font-bold text-lg">?</Button>
                        <Button data-tut="bank-exit" onClick={() => { if (ui.activeTutorial?.id === 'bank-tour') ui.setActiveTutorial(null); onClose(); }} size="sm">Exit Bank</Button>
                    </div>
                </div>
            </div>
            <div data-tut="bank-tabs" className="bank-tabs-container flex items-end overflow-x-auto pb-1">
                {bank.map(tab => {
                    let iconContent = null;
                    if (tab.id === 0) iconContent = <img src={getIconUrl("infinity")} alt="Main Tab" className="bank-tab-icon filter invert w-8 h-8" />;
                    else {
                        const firstItem = tab.items.find(item => item !== null && item.quantity > 0);
                        if (firstItem) {
                            const itemData = ITEMS[firstItem.itemId];
                            if (itemData) iconContent = <ItemIcon item={itemData} slot={firstItem} className="bank-tab-icon w-8 h-8" />;
                        } else iconContent = <img src={getIconUrl("bank")} alt="Empty Tab" className="bank-tab-icon filter invert opacity-50 w-8 h-8 " />;
                    }

                    const dndHandlers = !isTouchDevice ? {
                        onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragOverTabId(tab.id); },
                        onDragLeave: () => setDragOverTabId(null),
                        onDrop: (e: React.DragEvent) => handleTabDrop(e, tab.id),
                    } : {};

                    return (
                        <button key={tab.id} className={`bank-tab ${tab.id === activeBankTabId ? 'active' : ''} ${dragOverTabId === tab.id ? 'bank-tab-drag-over' : ''}`} onClick={() => handleTabClick(tab.id)} onContextMenu={(e) => handleTabContextMenu(e, tab)} onMouseEnter={(e) => setTooltip({ content: tab.name, position: { x: e.clientX, y: e.clientY } })} onMouseLeave={() => setTooltip(null)} {...dndHandlers}>
                            {iconContent}
                        </button>
                    );
                })}
                {bank.length < MAX_BANK_TABS && (
                     <button className="bank-tab" onClick={() => { onAddTab(); setTooltip(null); }} onMouseEnter={(e) => setTooltip({ content: 'Add new tab', position: { x: e.clientX, y: e.clientY }})} onMouseLeave={() => setTooltip(null)}>
                        <img src={getIconUrl("health-normal")} alt="Add Tab" className="bank-tab-icon filter invert opacity-50 w-8 h-8" />
                    </button>
                )}
            </div>

            <div 
                data-tut="bank-item-grid"
                className="flex-grow bg-black/40 p-2 rounded-lg border-2 border-gray-600 border-t-0 rounded-t-none pr-1 overflow-y-auto"
                ref={scrollContainerRef}
                onScroll={handleScroll}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="relative w-full" style={{ height: virtualization.totalHeight }}>
                    {itemsToDisplay.slice(virtualization.startIndex, virtualization.endIndex).map((displayItem, sliceIdx) => {
                        const displayIndex = virtualization.startIndex + sliceIdx;
                        const { slot, tabId, index: realIndex } = displayItem;
                        const row = Math.floor(displayIndex / virtualization.cols);
                        const col = displayIndex % virtualization.cols;

                        return <BankSlot 
                            key={`${tabId}-${realIndex}`}
                            row={row}
                            col={col}
                            rowHeight={virtualization.rowHeight}
                            colWidth={virtualization.colWidth}
                            slot={slot} 
                            index={realIndex}
                            asNote={withdrawAsNote} 
                            activeTabId={tabId}
                            onWithdraw={(idx, qty, asNote) => onWithdraw(idx, qty, asNote, tabId)}
                            onPrimaryAction={() => handleSlotPrimaryAction(displayItem)}
                            setContextMenu={setContextMenu} 
                            setMakeXPrompt={setMakeXPrompt} 
                            setTooltip={isScrolling ? () => {} : setTooltip}
                            isOneClickMode={isOneClickMode} 
                            onClearPlaceholder={onClearPlaceholder}
                            isDraggable={!!slot && !searchTerm}
                            isDragging={draggingIndex?.tabId === tabId && draggingIndex?.index === realIndex}
                            isDragOver={dragOverIndex === realIndex && tabId === activeBankTabId}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                            onExamine={onExamine}
                        />;
                    })}
                    {itemsToDisplay.length === 0 && searchTerm && (
                         <div className="col-span-full text-center text-gray-400 italic py-4">No items found matching "{searchTerm}".</div>
                    )}
                </div>
            </div>

            <div className="mt-2 pt-2 border-t-2 border-gray-600 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                    <button data-tut="bank-withdraw-mode" onClick={() => setWithdrawAsNote(prev => !prev)} className={`w-10 h-10 relative overflow-hidden rounded ${withdrawAsNote ? 'bg-yellow-600 border-2 border-yellow-500' : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'}`}>
                        <img src={getIconUrl("folded-paper")} alt="Note" className="item-note-paper" />
                    </button>
                    <button data-tut="bank-placeholders" onClick={handleToggleBankPlaceholders} className={`w-10 h-10 flex items-center justify-center rounded ${bankPlaceholders ? 'bg-yellow-600 border-2 border-yellow-500' : 'bg-gray-700 border-2 border-gray-600 hover:bg-gray-600'}`}>
                        <img src={bankPlaceholders ? "https://api.iconify.design/game-icons:padlock.svg" : "https://api.iconify.design/game-icons:padlock-open.svg"} alt="Placeholders" className="w-6 h-6 filter invert" />
                    </button>
                </div>
                <div data-tut="bank-quantity-toggles" className="flex items-center gap-1">
                     {[1, 5, 10, 'x', 'all'].map(qty => (
                        <button key={qty} onClick={() => handleToggleClick(qty as WithdrawMode)} className={`h-10 px-3 rounded font-bold text-sm ${activeWithdrawMode === qty ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                            {qty === 'x' ? (customWithdrawAmount ? `X: ${customWithdrawAmount}` : 'X') : qty}
                        </button>
                     ))}
                </div>
                <div className="flex-grow max-w-xs mx-2">
                    <input data-tut="bank-search" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-10 px-3 rounded bg-gray-800 border border-gray-600 text-sm text-white focus:outline-none focus:border-yellow-500" />
                </div>
                <div className="flex justify-center gap-2">
                    <button data-tut="bank-deposit-backpack" onClick={() => onDepositBackpack()} className="w-10 h-10 flex items-center justify-center rounded bg-gray-700 border-2 border-gray-600 hover:bg-gray-600"><img src={getIconUrl("profit")} alt="Deposit" className="w-6 h-6 filter invert" /></button>
                    <button data-tut="bank-deposit-equipment" onClick={() => onDepositEquipment()} className="w-10 h-10 relative flex items-center justify-center rounded bg-gray-700 border-2 border-gray-600 hover:bg-gray-600 overflow-hidden"><img src={getIconUrl("contract")} alt="" className="bank-action-bg-icon" /><img src={getIconUrl("battle-gear")} alt="Deposit" className="relative w-6 h-6 filter invert" /></button>
                </div>
            </div>
        </div>
    );
};

export default BankView;
