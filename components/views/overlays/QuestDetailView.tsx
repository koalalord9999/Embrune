import React from 'react';
import { PlayerQuestState, SkillName } from '../../../types';
import { QUESTS } from '../../../constants';
import Button from '../../common/Button';

interface QuestDetailViewProps {
    questId: string;
    playerQuests: PlayerQuestState[];
    skills?: { skill: SkillName; level: number }[];
    combatLevel?: number;
    onClose: () => void;
}

const QuestDetailView: React.FC<QuestDetailViewProps> = ({ questId, playerQuests, skills = [], combatLevel = 1, onClose }) => {
    const questData = QUESTS[questId];
    const playerQuest = playerQuests.find(q => q.questId === questId);

    const isQuestMet = (reqId: string) => playerQuests.some(pq => pq.questId === reqId && pq.isComplete);
    const isSkillMet = (reqSkill: { skill: SkillName; level: number }) => {
        const playerSkill = skills.find(s => s.skill === reqSkill.skill);
        return (playerSkill?.level || 1) >= reqSkill.level;
    };
    const isCombatMet = (reqLevel: number) => combatLevel >= reqLevel;

    if (!questData) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div
                    className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-lg p-6 text-center"
                    onClick={e => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Quest Not Found</h2>
                    <p>The details for this quest could not be loaded.</p>
                    <Button onClick={onClose} className="mt-6">Close</Button>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        if (!playerQuest) { // Not Started
            const reqs = questData.requirements;
            const questsMet = reqs?.quests?.every(id => isQuestMet(id)) ?? true;
            const skillsMet = reqs?.skills?.every(s => isSkillMet(s)) ?? true;
            const actualMet = questsMet && skillsMet;
            const recommendedMet = reqs?.recommendedCombatLevel ? isCombatMet(reqs.recommendedCombatLevel) : true;

            let bgColor = 'bg-red-900/20 border-red-900/40';
            let titleColor = 'text-red-400';

            if (!reqs) {
                bgColor = 'bg-green-900/20 border-green-900/40';
                titleColor = 'text-green-400';
            } else if (actualMet && recommendedMet) {
                bgColor = 'bg-green-900/20 border-green-900/40';
                titleColor = 'text-green-400';
            } else if (actualMet && !recommendedMet) {
                bgColor = 'bg-yellow-900/20 border-yellow-900/40';
                titleColor = 'text-yellow-400';
            }

            return (
                <>
                    <p className="mb-4 text-gray-400 italic">{questData.description}</p>

                    <div className={`${bgColor} p-4 rounded-lg border mb-4 shadow-inner overflow-hidden transition-colors duration-500`}>
                        <h3 className={`font-bold ${titleColor} mb-2 flex items-center font-pixel-rpg text-lg py-1 uppercase tracking-widest`}>
                            {(!reqs || (actualMet && recommendedMet)) ? (
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                            Requirements
                        </h3>
                        <ul className="space-y-2">
                            {reqs ? (
                                <>
                                    {reqs.quests?.map(reqId => {
                                        const met = isQuestMet(reqId);
                                        return (
                                            <li key={reqId} className="text-sm flex items-center text-gray-300">
                                                <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'} mr-3`}></div>
                                                Quest: <span className={`ml-1 ${met ? 'text-green-300' : 'text-red-200'} font-medium`}>{QUESTS[reqId as any]?.name || reqId}</span>
                                            </li>
                                        );
                                    })}
                                    {reqs.skills?.map(reqSkill => {
                                        const met = isSkillMet(reqSkill);
                                        return (
                                            <li key={reqSkill.skill} className="text-sm flex items-center text-gray-300">
                                                <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]'} mr-3`}></div>
                                                {reqSkill.skill}: <span className={`ml-1 ${met ? 'text-green-300' : 'text-yellow-100'} font-bold`}>Level {reqSkill.level}</span>
                                            </li>
                                        );
                                    })}
                                    {reqs.recommendedCombatLevel && (
                                        <li className={`text-sm flex items-center text-gray-300 pt-2 mt-2 border-t ${actualMet ? 'border-green-900/20' : 'border-red-900/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isCombatMet(reqs.recommendedCombatLevel) ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]'} mr-3`}></div>
                                            Recommended Combat: <span className={`ml-1 ${isCombatMet(reqs.recommendedCombatLevel) ? 'text-green-300' : 'text-orange-200'} font-bold`}>Level {reqs.recommendedCombatLevel}</span>
                                        </li>
                                    )}
                                    {reqs.notes?.map((note, index) => (
                                        <li key={index} className="text-sm flex items-start text-gray-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3 mt-1.5 shadow-[0_0_5px_rgba(96,165,250,0.5)]"></div>
                                            <span className="text-blue-100 italic">{note}</span>
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <li className="text-sm flex items-center text-gray-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                                    <span className="text-green-200 font-medium tracking-wide">None</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="bg-black/40 p-4 rounded-lg border border-gray-600 shadow-lg">
                        <h3 className="font-bold text-yellow-300 mb-2 text-xs uppercase tracking-widest">How to Start</h3>
                        <p className="text-gray-300 leading-relaxed">{questData.startHint}</p>
                    </div>
                </>
            );
        }

        if (playerQuest.isComplete) { // Completed
            return (
                <>
                    <p className="mb-4 text-gray-400 italic">{questData.description}</p>
                    <div className="space-y-2 mb-4">
                        {questData.playerStagePerspectives.map((perspective, index) => (
                            <p key={index} className="text-gray-500 line-through text-sm">
                                {perspective}
                            </p>
                        ))}
                    </div>
                    <div className="bg-black/40 p-3 rounded-lg border border-gray-600">
                        <p className="italic text-yellow-100">"{questData.completionSummary}"</p>
                    </div>
                </>
            );
        }

        // In Progress
        const currentStageDescription = questData.stages[playerQuest.currentStage]?.description || "Objective unknown.";
        const historyPerspectives = questData.playerStagePerspectives.slice(0, playerQuest.currentStage);

        return (
            <>
                <p className="mb-4 text-gray-400 italic">{questData.description}</p>
                <div className="space-y-2">
                    {/* Render past completed stages as narrative history */}
                    {historyPerspectives.map((perspective, index) => (
                        <p key={index} className="text-gray-500 line-through text-sm">
                            {perspective}
                        </p>
                    ))}

                    {/* Render current active objective as the instructional description */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-widest">Current Objective:</h3>
                        <p className="font-bold text-yellow-400 animate-pulse text-lg">
                            {currentStageDescription}
                        </p>
                    </div>
                </div>
            </>
        );
    };

    const statusColor = !playerQuest ? 'text-red-400' : playerQuest.isComplete ? 'text-green-400' : 'text-yellow-400';

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in font-sans" onClick={onClose}>
            <div
                className="bg-gray-800 border-4 border-gray-600 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b-2 border-gray-600 flex-shrink-0 bg-gray-900/50">
                    <h2 className={`text-3xl font-bold ${statusColor} font-medieval tracking-wide`}>{questData.name}</h2>
                    <Button onClick={onClose}>Close</Button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 text-gray-200">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default QuestDetailView;