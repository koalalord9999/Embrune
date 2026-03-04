
import React, { useState } from 'react';
import Button from '../common/Button';
import { useUIState } from '../../hooks/useUIState';
import { useSoundEngine } from '../../hooks/useSoundEngine';

interface SettingsViewProps {
    onResetGame: () => void;
    onExportGame: () => void;
    onImportGame: () => void;
    onClose: () => void;
    isDevMode: boolean;
    onToggleDevPanel: () => void;
    isTouchSimulationEnabled: boolean;
    onToggleTouchSimulation: () => void;
    ui: ReturnType<typeof useUIState>;
    bankPlaceholders: boolean;
    handleToggleBankPlaceholders: () => void;
}

type SettingTab = 'Video' | 'Audio' | 'Gameplay' | 'Account';

const SettingRow: React.FC<{ label: string, description?: string, children: React.ReactNode }> = ({ label, description, children }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-700">
        <div>
            <p className="font-semibold text-gray-200">{label}</p>
            {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const ToggleButton: React.FC<{ enabled: boolean, onClick: () => void }> = ({ enabled, onClick }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <button onClick={handleClick} className={`px-4 py-1 text-xs rounded font-bold transition-colors ${enabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}>{enabled ? 'ON' : 'OFF'}</button>
    );
};


const QualitySelector: React.FC<{ value: string, onChange: (value: 'Low' | 'Medium' | 'High') => void }> = ({ value, onChange }) => (
    <div className="flex gap-1 bg-gray-900/50 p-1 rounded-md">
        {(['Low', 'Medium', 'High'] as const).map(q => (
            <button key={q} onClick={() => onChange(q)} className={`px-3 py-1 text-xs rounded transition-colors ${value === q ? 'bg-yellow-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>{q}</button>
        ))}
    </div>
);

interface TabButtonProps {
    label: SettingTab;
    isActive: boolean;
    onClick: (tab: SettingTab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button 
        onClick={() => onClick(label)} 
        className={`w-full text-left p-3 rounded-md transition-colors text-sm font-semibold ${isActive ? 'bg-yellow-700/80 text-white' : 'hover:bg-gray-700/50'}`}
    >
        {label}
    </button>
);

const SettingsView: React.FC<SettingsViewProps> = ({ onResetGame, onExportGame, onImportGame, onClose, isDevMode, onToggleDevPanel, isTouchSimulationEnabled, onToggleTouchSimulation, ui, bankPlaceholders, handleToggleBankPlaceholders }) => {
    const [activeTab, setActiveTab] = useState<SettingTab>('Audio');
    const [quality, setQuality] = useState<'Low' | 'Medium' | 'High'>('High');
    const { play, initContext } = useSoundEngine();

    const handleAmbientChange = () => {
        initContext();
        play('UI_CLICK');
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Video': return (
                <div>
                    <SettingRow label="Graphics Quality" description="Adjusts animation quality to improve performance.">
                        <QualitySelector value={quality} onChange={setQuality} />
                    </SettingRow>
                    <SettingRow label="Show Tooltips" description="Display helpful popups when hovering over items and UI elements.">
                        <ToggleButton enabled={ui.showTooltips} onClick={() => ui.setShowTooltips(!ui.showTooltips)} />
                    </SettingRow>
                    <SettingRow label="Show XP Drops" description="Display experience gains on-screen.">
                        <ToggleButton enabled={ui.showXpDrops} onClick={() => ui.setShowXpDrops(!ui.showXpDrops)} />
                    </SettingRow>
                    <SettingRow label="Show Hitsplats" description="Display damage numbers in combat.">
                        <ToggleButton enabled={ui.showHitsplats} onClick={() => ui.setShowHitsplats(!ui.showHitsplats)} />
                    </SettingRow>
                    <SettingRow label="Player Health in Combat" description="Show player's HP numbers in the combat view.">
                        <ToggleButton enabled={ui.showCombatPlayerHealth} onClick={() => ui.setShowCombatPlayerHealth(!ui.showCombatPlayerHealth)} />
                    </SettingRow>
                    <SettingRow label="Enemy Health in Combat" description="Show enemy's HP numbers in the combat view.">
                        <ToggleButton enabled={ui.showCombatEnemyHealth} onClick={() => ui.setShowCombatEnemyHealth(!ui.showCombatEnemyHealth)} />
                    </SettingRow>
                    <SettingRow label="Player Health on Minimap" description="Show player's HP numbers on the minimap orb.">
                        <ToggleButton enabled={ui.showMinimapHealth} onClick={() => ui.setShowMinimapHealth(!ui.showMinimapHealth)} />
                    </SettingRow>
                </div>
            );
            case 'Audio': return (
                <div>
                    <SettingRow label="Master Mute" description="Mute all synthesized sound effects.">
                        <ToggleButton enabled={ui.isMuted} onClick={() => ui.setIsMuted(!ui.isMuted)} />
                    </SettingRow>
                    <SettingRow label="Master Volume" description="Adjust the volume of all sounds.">
                        <div className="flex items-center gap-2">
                             <input 
                                type="range" 
                                min="0" max="1" step="0.05"
                                value={ui.masterVolume}
                                onChange={(e) => ui.setMasterVolume(parseFloat(e.target.value))}
                                className="w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-600" 
                            />
                            <span className="text-xs font-mono w-8">{Math.round(ui.masterVolume * 100)}%</span>
                        </div>
                    </SettingRow>
                    <SettingRow label="Music Volume" description="Adjust the volume of background music.">
                        <div className="flex items-center gap-2">
                            <input 
                                type="range" 
                                min="0" max="1" step="0.05"
                                value={ui.musicVolume}
                                onChange={(e) => ui.setMusicVolume(parseFloat(e.target.value))}
                                className="w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-600" 
                            />
                            <span className="text-xs font-mono w-8">{Math.round(ui.musicVolume * 100)}%</span>
                        </div>
                    </SettingRow>
                    <SettingRow label="SFX Volume" description="Adjust the volume of sound effects like combat and skilling.">
                        <div className="flex items-center gap-2">
                            <input 
                                type="range" 
                                min="0" max="1" step="0.05"
                                value={ui.sfxVolume}
                                onChange={(e) => ui.setSfxVolume(parseFloat(e.target.value))}
                                className="w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-600" 
                            />
                            <span className="text-xs font-mono w-8">{Math.round(ui.sfxVolume * 100)}%</span>
                        </div>
                    </SettingRow>
                    <SettingRow label="Ambient Volume" description="Adjust the volume of ambient sounds and UI clicks.">
                        <div className="flex items-center gap-2">
                            <input 
                                type="range" 
                                min="0" max="1" step="0.05"
                                value={ui.ambientVolume}
                                onChange={(e) => ui.setAmbientVolume(parseFloat(e.target.value))}
                                onMouseUp={handleAmbientChange}
                                onTouchEnd={handleAmbientChange}
                                className="w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-600" 
                            />
                            <span className="text-xs font-mono w-8">{Math.round(ui.ambientVolume * 100)}%</span>
                        </div>
                    </SettingRow>
                </div>
            );
            case 'Gameplay': return (
                <div>
                    <SettingRow label="Bank Placeholders" description="Leave a 0-stack placeholder in the bank when withdrawing all of an item.">
                         <ToggleButton enabled={bankPlaceholders} onClick={handleToggleBankPlaceholders} />
                    </SettingRow>
                    <SettingRow label="One-Click Mode" description="Makes single-clicks act like long-presses for context menus.">
                        <ToggleButton enabled={ui.isOneClickMode} onClick={() => ui.setIsOneClickMode(!ui.isOneClickMode)} />
                    </SettingRow>
                    <SettingRow label="Confirm Valuable Drops" description={`Show a confirmation before dropping items worth over ${ui.valuableDropThreshold.toLocaleString()} coins.`}>
                        <ToggleButton enabled={ui.confirmValuableDrops} onClick={() => ui.setConfirmValuableDrops(!ui.confirmValuableDrops)} />
                    </SettingRow>
                    {isDevMode && (
                        <SettingRow label="Simulate Touch" description="Force touch-based controls for testing on desktop.">
                            <ToggleButton enabled={isTouchSimulationEnabled} onClick={onToggleTouchSimulation} />
                        </SettingRow>
                    )}
                </div>
            );
            case 'Account': return (
                <div className="space-y-4 pt-4">
                    <Button onClick={onExportGame} variant="secondary" className="w-full">Export Save</Button>
                    <Button onClick={onImportGame} variant="secondary" className="w-full">Import Save</Button>
                    <Button onClick={onResetGame} variant="secondary" className="w-full">New Game (Reset Progress)</Button>
                </div>
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[600px] flex" onClick={e => e.stopPropagation()}>
                <div className="w-1/4 bg-black/30 p-2 border-r-2 border-gray-700 flex flex-col gap-1">
                    <TabButton label="Video" isActive={activeTab === 'Video'} onClick={setActiveTab} />
                    <TabButton label="Audio" isActive={activeTab === 'Audio'} onClick={setActiveTab} />
                    <TabButton label="Gameplay" isActive={activeTab === 'Gameplay'} onClick={setActiveTab} />
                    <TabButton label="Account" isActive={activeTab === 'Account'} onClick={setActiveTab} />
                </div>
                <div className="w-3/4 flex-grow flex flex-col p-6 overflow-y-auto">
                     <div className="flex justify-between items-center mb-6 flex-shrink-0">
                         <h2 className="text-2xl font-bold text-yellow-400">{activeTab} Settings</h2>
                         <Button onClick={onClose} size="sm">Close</Button>
                    </div>
                    <div className="flex-grow">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
