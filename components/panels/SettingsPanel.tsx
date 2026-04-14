
import React, { useState } from 'react';
import Button from '../common/Button';
import { useUIState } from '../../hooks/useUIState';
import { useSoundEngine } from '../../hooks/useSoundEngine';
import { FONT_OPTIONS, GameFont } from '../../hooks/useUIState';

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

type SettingTab = 'Video' | 'Audio' | 'Gameplay' | 'Keybinds' | 'Account' | 'Credits';

const SettingRow: React.FC<{ label: string, description?: string, children: React.ReactNode }> = ({ label, description, children }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-700">
        <div className="font-pixel-rpg">
            <p className="font-bold text-xl text-gray-200">{label}</p>
            {description && <p className="text-lg text-gray-400 leading-tight">{description}</p>}
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
        <button onClick={handleClick} className={`px-4 py-1 text-xl rounded font-bold transition-colors font-pixel-rpg ${enabled ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}>{enabled ? 'ON' : 'OFF'}</button>
    );
};


const QualitySelector: React.FC<{ value: string, onChange: (value: 'Low' | 'Medium' | 'High') => void }> = ({ value, onChange }) => (
    <div className="flex gap-1 bg-gray-900/50 p-1 rounded-md">
        {(['Low', 'Medium', 'High'] as const).map(q => (
            <button key={q} onClick={() => onChange(q)} className={`px-3 py-1 text-xl rounded transition-colors font-pixel-rpg ${value === q ? 'bg-yellow-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>{q}</button>
        ))}
    </div>
);

const FontSelector: React.FC<{ value: GameFont; onChange: (v: GameFont) => void }> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = FONT_OPTIONS.find(o => o.value === value) ?? FONT_OPTIONS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(o => !o)}
                className="flex items-center justify-between gap-3 bg-gray-900/50 border border-gray-600 hover:border-yellow-600 px-3 py-1.5 rounded-md transition-colors min-w-[210px]"
            >
                <span className="text-xl text-white" style={{ fontFamily: selected.family }}>
                    {selected.label}
                </span>
                <span className="text-gray-400 text-sm font-pixel-rpg">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-600 rounded-md shadow-xl z-50 min-w-[210px] overflow-hidden">
                    {FONT_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xl transition-colors hover:bg-gray-700 ${
                                opt.value === value ? 'bg-yellow-700/60 text-white' : 'text-gray-200'
                            }`}
                            style={{ fontFamily: opt.family }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const KeybindRow: React.FC<{ label: string, value: string, isRemapping: boolean, onRemap: () => void }> = ({ label, value, isRemapping, onRemap }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
        <p className="text-sm text-gray-300 font-medium">{label}</p>
        <button
            onClick={onRemap}
            className={`px-3 py-1.5 rounded text-sm font-mono min-w-[80px] transition-all ${isRemapping ? 'bg-yellow-600 animate-pulse text-white' : 'bg-gray-700 hover:bg-gray-600 text-yellow-400'}`}
        >
            {isRemapping ? '...' : value.replace('Arrow', '')}
        </button>
    </div>
);

const KeybindDropdown: React.FC<{ label: string, value: string, onChange: (value: string) => void }> = ({ label, value, onChange }) => {
    const options = ['Disabled', ...Array.from({ length: 12 }, (_, i) => `F${i + 1}`)];

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
            <p className="text-sm text-gray-300 font-medium">{label}</p>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-gray-700 hover:bg-gray-600 text-yellow-400 px-2 py-1.5 rounded text-sm font-mono min-w-[80px] outline-none border-none"
            >
                {options.map(opt => (
                    <option key={opt} value={opt === 'Disabled' ? '' : opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
};

interface TabButtonProps {
    label: SettingTab;
    isActive: boolean;
    onClick: (tab: SettingTab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={() => onClick(label)}
        className={`w-full text-left p-3 rounded-md transition-colors text-xl font-bold font-pixel-rpg ${isActive ? 'bg-yellow-700/80 text-white' : 'hover:bg-gray-700/50'}`}
    >
        {label}
    </button>
);

const SettingsView: React.FC<SettingsViewProps> = ({ onResetGame, onExportGame, onImportGame, onClose, isDevMode, onToggleDevPanel, isTouchSimulationEnabled, onToggleTouchSimulation, ui, bankPlaceholders, handleToggleBankPlaceholders }) => {
    const [activeTab, setActiveTab] = useState<SettingTab>('Audio');
    const [quality, setQuality] = useState<'Low' | 'Medium' | 'High'>('High');
    const [remappingAction, setRemappingAction] = useState<string | null>(null);
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
                    <SettingRow label="Font Style" description="Change the typeface used across the entire game UI.">
                        <FontSelector value={ui.gameFont} onChange={ui.setGameFont} />
                    </SettingRow>
                    <SettingRow label="Font Size" description="Adjust the scale of the text throughout the game.">
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="0.8" max="1.5" step="0.05"
                                value={ui.gameFontScale}
                                onChange={(e) => ui.setGameFontScale(parseFloat(e.target.value))}
                                className="w-40 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                            />
                            <span className="text-xs font-mono w-8">{Math.round(ui.gameFontScale * 100)}%</span>
                        </div>
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
            case 'Keybinds': {
                const handleRemap = (action: string) => {
                    setRemappingAction(action);
                    const listener = (e: KeyboardEvent) => {
                        e.preventDefault();

                        // Protect Escape key
                        if (e.key === 'Escape') {
                            setRemappingAction(null);
                            window.removeEventListener('keydown', listener);
                            return;
                        }

                        ui.setKeybindings(prev => {
                            const newBinds = { ...prev };

                            // Check for conflicts: if another action uses this key, clear it
                            Object.keys(newBinds).forEach(key => {
                                if (newBinds[key as keyof typeof newBinds] === e.key) {
                                    (newBinds as any)[key] = '';
                                }
                            });

                            newBinds[action as keyof typeof newBinds] = e.key;
                            return newBinds;
                        });

                        setRemappingAction(null);
                        window.removeEventListener('keydown', listener);
                    };
                    window.addEventListener('keydown', listener);
                };

                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-3">Travel</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <KeybindRow label="Move North" value={ui.keybindings.move_n} isRemapping={remappingAction === 'move_n'} onRemap={() => handleRemap('move_n')} />
                                <KeybindRow label="Move South" value={ui.keybindings.move_s} isRemapping={remappingAction === 'move_s'} onRemap={() => handleRemap('move_s')} />
                                <KeybindRow label="Move West" value={ui.keybindings.move_w} isRemapping={remappingAction === 'move_w'} onRemap={() => handleRemap('move_w')} />
                                <KeybindRow label="Move East" value={ui.keybindings.move_e} isRemapping={remappingAction === 'move_e'} onRemap={() => handleRemap('move_e')} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-3">Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <KeybindRow
                                        key={num}
                                        label={`Action ${num}`}
                                        value={ui.keybindings[`action_${num}` as keyof typeof ui.keybindings]}
                                        isRemapping={remappingAction === `action_${num}`}
                                        onRemap={() => handleRemap(`action_${num}`)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-3 px-1 border-l-4 border-yellow-600">Interface</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <KeybindDropdown label="Combat Styles" value={ui.keybindings.panel_combat} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_combat: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_combat' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Skills Tab" value={ui.keybindings.panel_skills} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_skills: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_skills' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Quests Tab" value={ui.keybindings.panel_quests} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_quests: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_quests' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Inventory" value={ui.keybindings.panel_inventory} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_inventory: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_inventory' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Equipment" value={ui.keybindings.panel_equipment} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_equipment: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_equipment' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Prayer Tab" value={ui.keybindings.panel_prayer} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_prayer: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_prayer' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Spellbook" value={ui.keybindings.panel_spells} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_spells: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_spells' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Music Player" value={ui.keybindings.panel_music} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_music: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_music' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                <KeybindDropdown label="Game Settings" value={ui.keybindings.panel_settings} onChange={(val) => {
                                    ui.setKeybindings(prev => {
                                        const next = { ...prev, panel_settings: val };
                                        if (val) Object.keys(next).forEach(k => { if (k !== 'panel_settings' && (next as any)[k] === val) (next as any)[k] = ''; });
                                        return next;
                                    });
                                }} />
                                {isDevMode && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                        <p className="text-sm text-gray-300 font-medium">Developer Panel</p>
                                        <span className="text-xs font-mono text-gray-500 px-2 py-1.5 bg-gray-900/50 rounded">Backquote (`)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button onClick={ui.resetKeybindings} variant="secondary" size="sm" className="w-full md:w-auto">
                                Reset to Defaults
                            </Button>
                        </div>
                    </div>
                );
            }
            case 'Account': return (
                <div className="space-y-4 pt-4">
                    <Button onClick={onExportGame} variant="secondary" className="w-full">Export Save</Button>
                    <Button onClick={onImportGame} variant="secondary" className="w-full">Import Save</Button>
                    <Button onClick={onResetGame} variant="secondary" className="w-full">New Game (Reset Progress)</Button>
                </div>
            );
            case 'Credits': return (
                <div className="space-y-6 pt-2 font-pixel-rpg">
                    <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold text-yellow-300 mb-2">Visual Assets</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            The vast majority of our icons are provided by the wonderful artists at <a href="https://game-icons.net" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400 underline decoration-yellow-500/30">Game-icons.net</a>.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-base text-gray-400">
                            <ul className="list-disc list-inside">
                                <li>Delapouite</li>
                                <li>Lorc</li>
                                <li>Skoll</li>
                            </ul>
                            <ul className="list-disc list-inside">
                                <li>Sbed</li>
                                <li>Cathelineau</li>
                                <li>And many more!</li>
                            </ul>
                        </div>
                        <p className="mt-3 text-xs text-gray-500 italic">
                            All icons used under the <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400">CC BY 3.0</a> license.
                        </p>
                    </div>

                    <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold text-yellow-300 mb-2">Typography</h3>
                        <p className="text-gray-300 text-lg">
                            Embrune features beautiful open-source typefaces from <span className="text-yellow-500">Google Fonts</span>:
                        </p>
                        <ul className="mt-2 text-base text-gray-400 space-y-1">
                            <li className="flex justify-between"><span>MedievalSharp</span> <span className="text-xs italic">Heading Style</span></li>
                            <li className="flex justify-between"><span>VT323</span> <span className="text-xs italic">Retro Pixel Style</span></li>
                            <li className="flex justify-between"><span>Inter</span> <span className="text-xs italic">UI Clarity</span></li>
                        </ul>
                    </div>



                    <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold text-yellow-300 mb-2">Technology</h3>
                        <div className="space-y-3 text-lg">
                            <p className="flex justify-between items-center text-gray-300">
                                <span>Icon Delivery</span>
                                <span className="text-gray-500 text-base">Iconify</span>
                            </p>
                            <p className="flex justify-between items-center text-gray-300">
                                <span>Audio Engine</span>
                                <span className="text-gray-500 text-base">Tone.js</span>
                            </p>
                            <p className="flex justify-between items-center text-gray-300">
                                <span>Framework</span>
                                <span className="text-gray-500 text-base">React & TypeScript</span>
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-black/40 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold text-yellow-300 mb-2">Development Team</h3>
                        <div className="space-y-3 text-lg">
                            <p className="flex justify-between items-center text-gray-300">
                                <span className="text-yellow-100 italic text-base">Lead Development Curator</span>
                                <span className="text-white font-bold">John O</span>
                            </p>
                            <p className="flex justify-between items-center text-gray-300">
                                <span className="text-yellow-100 italic text-base">Lead Developer</span>
                                <span className="text-white font-bold">Antigravity (AI)</span>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-gray-500 italic text-base mt-4">
                        Special thanks to the Open Source gaming community for providing the tools and assets that make Embrune possible.
                    </p>
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
                    <TabButton label="Keybinds" isActive={activeTab === 'Keybinds'} onClick={setActiveTab} />
                    <TabButton label="Account" isActive={activeTab === 'Account'} onClick={setActiveTab} />
                    <TabButton label="Credits" isActive={activeTab === 'Credits'} onClick={setActiveTab} />
                </div>
                <div className="w-3/4 flex-grow flex flex-col p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6 flex-shrink-0 font-pixel-rpg">
                        <h2 className="text-3xl font-bold text-yellow-400">{activeTab} Settings</h2>
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
