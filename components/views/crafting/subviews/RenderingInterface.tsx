import React from 'react';
import { SkillName } from '../../../../types';
import { RENDERING_RECIPES, ITEMS, getIconClassName } from '../../../../constants';
import { CraftingViewProps } from '../CraftingView';
import { useLongPress } from '../../../../hooks/useLongPress';
import { useIsTouchDevice } from '../../../../hooks/useIsTouchDevice';

const RenderingSlot: React.FC<{
    recipe: typeof RENDERING_RECIPES[0];
    cookingLevel: number;
    getItemCount: (itemId: string) => number;
    handleRendering: (fatId: string, quantity: number) => void;
    setContextMenu: CraftingViewProps['setContextMenu'];
    setMakeXPrompt: CraftingViewProps['setMakeXPrompt'];
    setTooltip: CraftingViewProps['setTooltip'];
    isTouchDevice: boolean;
}> = ({ recipe, cookingLevel, getItemCount, handleRendering, setContextMenu, setMakeXPrompt, setTooltip, isTouchDevice }) => {
    const fatItem = ITEMS[recipe.fatId];
    const flaskItem = ITEMS[recipe.flaskId];
    if (!fatItem || !flaskItem) return null;

    const hasLevel = cookingLevel >= recipe.level;
    const fatCount = getItemCount(recipe.fatId);
    const hasFat = fatCount > 0;
    const canRender = hasLevel && hasFat;

    const handleSingleTap = () => { if (canRender) { handleRendering(recipe.fatId, 1); setTooltip(null); } };
    
    const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        let eventForMenu: React.MouseEvent | React.Touch;
        if ('touches' in e && e.touches.length > 0) eventForMenu = e.touches[0];
        else if ('changedTouches' in e && e.changedTouches.length > 0) eventForMenu = e.changedTouches[0];
        else eventForMenu = e as React.MouseEvent;

        setContextMenu({
            options: [
                { label: 'Render 1', onClick: () => handleRendering(recipe.fatId, 1), disabled: !canRender },
                { label: 'Render 5', onClick: () => handleRendering(recipe.fatId, 5), disabled: !canRender || fatCount < 5 },
                { label: 'Render All', onClick: () => handleRendering(recipe.fatId, fatCount), disabled: !canRender },
                { 
                    label: 'Render X...', 
                    onClick: () => setMakeXPrompt({
                        title: `Render ${fatItem.name}`, max: fatCount,
                        onConfirm: (quantity) => handleRendering(recipe.fatId, quantity)
                    }), 
                    disabled: !canRender 
                },
            ],
            triggerEvent: eventForMenu,
            isTouchInteraction: isTouchDevice,
            title: `Render ${fatItem.name}`
        });
    };

    const longPressHandlers = useLongPress({ onLongPress: handleLongPress, onClick: handleSingleTap });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const craftTime = 1.8;
    
        const tooltipContent = (
            <div className="text-sm text-left w-48">
                <p className="font-bold text-yellow-300 mb-2 pb-1 border-b border-gray-600">Render {fatItem.name}</p>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Materials</p>
                <ul className="list-disc list-inside mb-2">
                    <li className={hasFat ? 'text-green-400' : 'text-red-400'}>{fatItem.name} x1</li>
                    <li className="text-green-400">Rendering Kit (Empty)</li>
                </ul>
                <p className="font-semibold text-gray-400 uppercase text-xs mb-1">Output</p>
                <p className="mb-2 text-gray-300">4 doses of oil</p>
                
                <div className="grid grid-cols-2 gap-x-4 text-xs">
                    <span className="text-gray-400">{SkillName.Cooking} XP:</span>
                    <span className="font-semibold text-right">{recipe.xp.toLocaleString()}</span>
                    <span className="text-gray-400">Craft Time:</span>
                    <span className="font-semibold text-right">{craftTime.toFixed(1)}s</span>
                </div>
            </div>
        );
    
        setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY } });
    };

    return (
        <div 
            className={`crafting-slot ${!canRender ? 'disabled' : ''}`} 
            {...longPressHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setTooltip(null)}
        >
            <div className={`crafting-slot-level ${hasLevel ? 'met' : 'unmet'}`}>
                Lvl {recipe.level}
            </div>
            <img src={fatItem.iconUrl} alt={fatItem.name} className={`crafting-slot-icon ${getIconClassName(fatItem)}`} />
            <div className="crafting-slot-ingredients">
                <div className="ingredient-icon" title={`${fatItem.name} (${fatCount})`}>
                    <img src={fatItem.iconUrl} alt={fatItem.name} className={getIconClassName(fatItem)} />
                    <span className="ingredient-quantity">{fatCount}</span>
                </div>
            </div>
        </div>
    );
};

const RenderingInterface: React.FC<CraftingViewProps> = (props) => {
    const { inventory, skills, handleRendering, setContextMenu, setMakeXPrompt, setTooltip } = props;
    if (!handleRendering) return <p>Rendering handler not available.</p>;

    const cookingLevel = skills.find(s => s.name === SkillName.Cooking)?.currentLevel ?? 1;
    const isTouchDevice = useIsTouchDevice(false);
    
    const getItemCount = (itemId: string): number => {
        return inventory.reduce((total, slot) => {
            if (slot && slot.itemId === itemId && !slot.noted) {
                return total + slot.quantity;
            }
            return total;
        }, 0);
    };

    const availableRecipes = RENDERING_RECIPES.filter(r => getItemCount(r.fatId) > 0);

    return (
        <div className="flex-grow overflow-y-auto pr-2">
            {availableRecipes.length === 0 ? (
                <p className="text-center text-gray-400 italic mt-8">You don't have any fat to render.</p>
            ) : (
                <div className="crafting-grid">
                    {availableRecipes.map((recipe) => (
                        <RenderingSlot
                            key={recipe.fatId}
                            recipe={recipe}
                            cookingLevel={cookingLevel}
                            getItemCount={getItemCount}
                            handleRendering={handleRendering}
                            setContextMenu={setContextMenu}
                            setMakeXPrompt={setMakeXPrompt}
                            setTooltip={setTooltip}
                            isTouchDevice={isTouchDevice}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RenderingInterface;
