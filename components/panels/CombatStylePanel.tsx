import React from 'react';
import { CombatStance, Equipment, WeaponType } from '../../types';
import { ITEMS, ATTACK_STYLES } from '../../constants';
import Button from '../common/Button';
import { useUIState } from '../../hooks/useUIState';

interface CombatStylePanelProps {
    combatStance: CombatStance;
    setCombatStance: (stance: CombatStance) => void;
    equipment: Equipment;
    combatLevel: number;
    activeCombatStyleHighlight?: CombatStance | null;
    ui: ReturnType<typeof useUIState>;
    combatAttackType: 'stab' | 'slash' | 'crush';
    setCombatAttackType: React.Dispatch<React.SetStateAction<'stab' | 'slash' | 'crush'>>;
    stylesByWeaponType: Partial<Record<WeaponType, number>>;
    setStylesByWeaponType: React.Dispatch<React.SetStateAction<Partial<Record<WeaponType, number>>>>;
}

const CombatStylePanel: React.FC<CombatStylePanelProps> = ({ 
    combatStance, setCombatStance, equipment, combatLevel, 
    activeCombatStyleHighlight, ui, 
    combatAttackType, setCombatAttackType, 
    stylesByWeaponType, setStylesByWeaponType 
}) => {
    const weaponSlot = equipment.weapon;
    const itemData = weaponSlot ? ITEMS[weaponSlot.itemId] : null;
    const weaponType = itemData?.equipment?.weaponType ?? WeaponType.Unarmed;

    const handleStanceChange = (stance: CombatStance, index?: number, attackType?: 'stab'|'slash'|'crush') => {
        setCombatStance(stance);
        
        if (attackType) {
            setCombatAttackType(attackType);
        }
        
        if (index !== undefined) {
            setStylesByWeaponType(prev => ({
                ...prev,
                [weaponType]: index
            }));
        }

        if (stance === CombatStance.Autocast || stance === CombatStance.DefensiveAutocast) {
            ui.setIsSelectingAutocastSpell(true);
            ui.setActivePanel('spellbook');
        }
    };

    const renderStyles = () => {
        const styles = ATTACK_STYLES[weaponType] || ATTACK_STYLES[WeaponType.Unarmed]!;
        
        return (
            <div className="grid grid-cols-2 gap-2">
                {styles.map((style: any, idx: number) => {
                    const isActive = combatStance === style.stance && combatAttackType === style.attackType;
                    const tooltipContent = (
                        <div className="text-sm">
                            <p className="font-bold">{style.description}</p>
                            <p className="text-gray-400 text-xs mt-1 capitalize">Combat Style: {style.stance}</p>
                        </div>
                    );

                    return (
                        <div 
                            key={style.name + idx}
                            onMouseEnter={(e) => ui.setTooltip({ content: tooltipContent, position: { x: e.clientX, y: e.clientY }})}
                            onMouseLeave={() => ui.setTooltip(null)}
                            className="w-full"
                        >
                            <Button
                                onClick={() => handleStanceChange(style.stance, idx, style.attackType)}
                                className={`w-full h-full text-lg py-3 flex flex-col items-center justify-center ${isActive ? 'ring-2 ring-yellow-400' : ''} ${activeCombatStyleHighlight === style.stance ? 'tutorial-highlight-target' : ''}`}
                                variant={isActive ? 'primary' : 'secondary'}
                            >
                                <span className="font-bold">{style.name}</span>
                                <span className="text-xs opacity-75">{style.stance === CombatStance.Controlled ? 'Shared XP' : style.stance}</span>
                            </Button>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full text-gray-300 font-pixel-rpg">
            <div className="text-center mb-4">
                <p className="text-xl">Combat Level: <span className="font-bold text-yellow-300">{combatLevel}</span></p>
                <p className="text-sm text-gray-400">{itemData ? itemData.name : 'Unarmed'}</p>
            </div>
            {renderStyles()}
        </div>
    );
};

export default CombatStylePanel;