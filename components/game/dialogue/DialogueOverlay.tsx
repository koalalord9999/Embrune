import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ActivePanel, DialogueNode, DialogueResponse, DialogueCheckRequirement } from '../../../types';
import Button from '../../common/Button';
import { DialogueState, useUIState } from '../../../hooks/useUIState';
import { getIconUrl } from '../../../constants';

interface DialogueOverlayProps {
    dialogue: DialogueState;
    setActivePanel: (panel: ActivePanel) => void;
    onResponse: (response: DialogueResponse) => { success: boolean, error?: string };
    handleDialogueCheck: (requirements: DialogueCheckRequirement[]) => boolean;
    onNavigate: (nextNodeKey: string) => void;
    isDialogueProcessing?: boolean;
}

const DialogueOverlay: React.FC<DialogueOverlayProps> = ({ dialogue, setActivePanel, onResponse, handleDialogueCheck, onNavigate, isDialogueProcessing }) => {
    const { npcName, npcIcon, nodes, currentNodeKey, onEnd } = dialogue;
    
    const resolvedIcon = useMemo(() => {
        if (!npcIcon) return getIconUrl('person');
        if (npcIcon.startsWith('http') || npcIcon.startsWith('/') || npcIcon.startsWith('data:')) {
            return npcIcon;
        }
        return getIconUrl(npcIcon);
    }, [npcIcon]);

    const ui = useUIState();
    const { textSpeed } = ui;

    const [textPage, setTextPage] = useState(0);
    const [optionPage, setOptionPage] = useState(0);
    const [tooltip, setTooltip] = useState<{ message: string, x: number, y: number, visible: boolean } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [displayedCharCount, setDisplayedCharCount] = useState(0);
    const [isSkipped, setIsSkipped] = useState(false);
    const [showOptionsState, setShowOptionsState] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const currentNode = nodes[currentNodeKey];

    const paginatedText = useMemo(() => {
        if (!currentNode) return [];
        const limit = isMobile ? 128 : 250;

        // Tokenize by whitespace and newlines, but preserve them
        const tokens = currentNode.text.match(/\S+|\s+/g) || [];
        const pages: string[] = [];
        let current = "";

        for (const token of tokens) {
            if (current.length + token.length <= limit) {
                current += token;
            } else {
                if (current.trim().length > 0) {
                    pages.push(current.trimEnd());
                }
                current = token.trimStart();

                // If a single word is longer than limit, we have to split it
                while (current.length > limit) {
                    pages.push(current.slice(0, limit));
                    current = current.slice(limit);
                }
            }
        }
        if (current.length > 0) {
            pages.push(current.trimEnd());
        }
        return pages;
    }, [currentNode, isMobile]);

    const activePageText = paginatedText[textPage] || "";

    const isTypingFinished = textSpeed === 'instant' || displayedCharCount >= activePageText.length;
    const displayedText = textSpeed === 'instant' ? activePageText : isSkipped ? activePageText : activePageText.slice(0, displayedCharCount);

    useEffect(() => {
        if (textSpeed === 'instant') {
            // Instant mode: all text shown, no skip needed
            return;
        }

        if (isSkipped) {
            return;
        }

        setDisplayedCharCount(0);
        const speedMs = textSpeed === 'slow' ? 100 : textSpeed === 'fast' ? 35 : 60;

        let currentCount = 0;
        const interval = setInterval(() => {
            currentCount += 1;
            if (currentCount >= activePageText.length) {
                setDisplayedCharCount(activePageText.length);
                clearInterval(interval);
            } else {
                setDisplayedCharCount(currentCount);
            }
        }, speedMs);

        return () => clearInterval(interval);
    }, [activePageText, textSpeed, isSkipped]);

    useEffect(() => {
        const node = nodes[currentNodeKey];
        if (node && node.conditionalResponses && onNavigate && handleDialogueCheck) {
            // Find the first matching conditional response that acts as a router
            const routerResponse = node.conditionalResponses.find(res =>
                res.check && (res.text === "" || res.text === undefined) && handleDialogueCheck(res.check.requirements)
            );
            if (routerResponse) {
                onNavigate(routerResponse.check!.successNode);
                return; // Navigate and prevent rendering this node
            }
        }
    }, [currentNodeKey, nodes, onNavigate, handleDialogueCheck]);

    const visibleResponses = useMemo(() => {
        if (!currentNode) return [];

        const unfilteredResponses = [...(currentNode.responses || [])];
        const alwaysVisibleResponses = unfilteredResponses.filter(res => {
            if (!res.check) return true;
            // Branching checks handle their own success/failure and should remain visible.
            if (res.check.successNode || res.check.failureNode) return true;
            return handleDialogueCheck(res.check.requirements);
        });

        let conditionalVisibleResponses: DialogueResponse[] = [];
        if (currentNode.conditionalResponses && handleDialogueCheck) {
            conditionalVisibleResponses = currentNode.conditionalResponses.filter(res => {
                if (!res.check) return true; // Show if no check is defined
                if (res.text === "" || res.text === undefined) return false; // Hide router responses
                return handleDialogueCheck(res.check.requirements);
            });
        }

        return [...alwaysVisibleResponses, ...conditionalVisibleResponses];
    }, [currentNode, handleDialogueCheck]);


    const hasResponses = useMemo(() => visibleResponses && visibleResponses.length > 0, [visibleResponses]);

    const hasRealOptions = useMemo(() => {
        if (!visibleResponses || visibleResponses.length === 0) return false;
        if (visibleResponses.length === 1) {
            const text = visibleResponses[0].text.trim().toLowerCase();
            if (text === 'continue' || text === '(continue)') {
                return false;
            }
        }
        return true;
    }, [visibleResponses]);

    const handleResponseClick = useCallback((e: React.MouseEvent | React.KeyboardEvent, response: DialogueResponse) => {
        const result = onResponse(response);
        if (result && !result.success && result.error) {
            let x = 0;
            let y = 0;
            if ('clientX' in e) {
                x = (e as React.MouseEvent).clientX;
                y = (e as React.MouseEvent).clientY;
            } else {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top;
            }
            setTooltip({ message: result.error, x, y, visible: true });
        }
    }, [onResponse]);

    useEffect(() => {
        setTextPage(0);
        setOptionPage(0);
        setTooltip(null);
        setDisplayedCharCount(0);
        setIsSkipped(false);
        setShowOptionsState(false);
    }, [currentNodeKey]);

    useEffect(() => {
        setIsSkipped(false);
        setShowOptionsState(false);
    }, [textPage]);

    useEffect(() => {
        if (tooltip && tooltip.visible) {
            const hideTimer = setTimeout(() => {
                setTooltip(prev => prev ? { ...prev, visible: false } : null);
            }, 1200);

            const removeTimer = setTimeout(() => {
                setTooltip(null);
            }, 1500);

            return () => {
                clearTimeout(hideTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [tooltip]);

    const handleNextPage = useCallback(() => {
        if (!isTypingFinished) {
            setIsSkipped(true);
            setDisplayedCharCount(activePageText.length);
            return;
        }
        if (textPage < paginatedText.length - 1) {
            setTextPage(p => p + 1);
        } else {
            if (hasResponses) {
                if (!hasRealOptions && visibleResponses[0]) {
                    handleResponseClick(new MouseEvent('click') as any, visibleResponses[0]);
                } else if (!showOptionsState) {
                    setShowOptionsState(true);
                } else {
                    onEnd();
                }
            } else {
                onEnd();
            }
        }
    }, [textPage, paginatedText, onEnd, isTypingFinished, activePageText.length, hasResponses, hasRealOptions, visibleResponses, showOptionsState, handleResponseClick]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!currentNode || isDialogueProcessing) return;
            const isLastTextPage = textPage >= paginatedText.length - 1;

            if (e.key === 'Escape') {
                e.preventDefault();
                onEnd();
                return;
            }

            if (e.code === 'Space') {
                e.preventDefault();
                if (!isLastTextPage || !isTypingFinished || !hasRealOptions || !showOptionsState) {
                    handleNextPage();
                }
            }

            if (isLastTextPage && isTypingFinished && hasRealOptions && showOptionsState) {
                const keyNum = parseInt(e.key, 10);
                if (keyNum >= 1 && keyNum <= 4) {
                    e.preventDefault();
                    const optionsPerPage = 4;
                    const displayedOptions = visibleResponses.slice(optionPage * (optionsPerPage - 1), (optionPage + 1) * (optionsPerPage - 1));
                    const hasMore = visibleResponses.length > (optionPage + 1) * (optionsPerPage - 1);

                    if (keyNum === 4 && hasMore) {
                        setOptionPage(p => (p + 1) % Math.ceil(visibleResponses.length / (optionsPerPage - 1)));
                    } else if (keyNum <= displayedOptions.length) {
                        handleResponseClick(e as any, displayedOptions[keyNum - 1]);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleNextPage, handleResponseClick, currentNode, textPage, paginatedText, optionPage, visibleResponses, isTypingFinished, hasRealOptions, showOptionsState, onEnd]);

    useEffect(() => {
        // Cleanup function to remove highlights when the dialogue closes or node changes
        const cleanupHighlights = () => {
            document.querySelectorAll('.tutorial-highlight-target').forEach(el => {
                el.classList.remove('tutorial-highlight-target');
            });
        };

        cleanupHighlights(); // Clean up previous highlights on each render

        if (currentNode?.highlight) {
            const highlightIds = Array.isArray(currentNode.highlight) ? currentNode.highlight : [currentNode.highlight];
            highlightIds.forEach(id => {
                const element = document.querySelector(`[data-tutorial-id="${id}"]`);
                if (element) {
                    element.classList.add('tutorial-highlight-target');
                    // Scroll the first highlighted element into view if it exists.
                    if (highlightIds.indexOf(id) === 0) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    }
                }
                if (id.startsWith('side-panel-button-')) {
                    const panelName = id.replace('side-panel-button-', '') as ActivePanel;
                    setActivePanel(panelName);
                }
            });
        }

        return cleanupHighlights; // Cleanup on component unmount
    }, [currentNode, setActivePanel]);

    if (!currentNode) return null;

    const isLastTextPage = textPage >= paginatedText.length - 1;

    const optionsPerPage = 4;
    const hasMoreOptions = hasResponses && visibleResponses.length > optionsPerPage;
    const numOptionPages = hasMoreOptions ? Math.ceil(visibleResponses.length / (optionsPerPage - 1)) : 1;
    const optionSliceStart = hasMoreOptions ? optionPage * (optionsPerPage - 1) : 0;
    const optionSliceEnd = hasMoreOptions ? (optionPage + 1) * (optionsPerPage - 1) : optionsPerPage;
    const displayedResponses = hasResponses ? visibleResponses.slice(optionSliceStart, optionSliceEnd) : [];
    const optionsList = [...displayedResponses];
    if (hasMoreOptions) {
        optionsList.push({ text: "View more options...", isViewMore: true } as any);
    }

    const renderButton = (res: DialogueResponse & { isViewMore?: boolean }, i: number) => {
        if (res.isViewMore) {
            return (
                <Button 
                    key="view-more" 
                    size="sm" 
                    className="w-full text-left justify-start font-pixel-rpg text-lg py-1 px-2.5 border border-yellow-700/60 bg-gray-900/80 hover:bg-yellow-950/40 hover:border-yellow-500 transition-all duration-200 leading-tight" 
                    onClick={() => setOptionPage(p => (p + 1) % numOptionPages)} 
                    disabled={isDialogueProcessing}
                >
                    <span className="text-yellow-400 mr-2.5 font-bold">4.</span>
                    <span className="text-gray-300 italic">{res.text}</span>
                </Button>
            );
        }
        
        return (
            <Button 
                key={i} 
                size="sm" 
                className="w-full text-left justify-start font-pixel-rpg text-lg py-1 px-2.5 border border-yellow-700/60 bg-gray-900/80 hover:bg-yellow-950/40 hover:border-yellow-500 transition-all duration-200 leading-tight" 
                onClick={(e) => handleResponseClick(e, res)} 
                disabled={isDialogueProcessing}
            >
                <span className="text-yellow-400 mr-2.5 font-bold">{i + 1}.</span>
                <span className="text-gray-100">{res.text}</span>
            </Button>
        );
    };

    const renderOptionsGrid = () => {
        const total = optionsList.length;
        if (total <= 2) {
            return (
                <div className="flex flex-col gap-2 w-full max-w-md items-start justify-center">
                    {optionsList.map((opt, idx) => renderButton(opt, idx))}
                </div>
            );
        } else {
            return (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full max-w-2xl">
                    <div className="flex flex-col gap-2">
                        {optionsList[0] && renderButton(optionsList[0], 0)}
                        {optionsList[1] && renderButton(optionsList[1], 1)}
                    </div>
                    <div className="flex flex-col gap-2">
                        {optionsList[2] && renderButton(optionsList[2], 2)}
                        {optionsList[3] && renderButton(optionsList[3], 3)}
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            {currentNode?.dim && (
                <div className="fixed inset-0 bg-black/60 z-[55] pointer-events-none animate-fade-in" />
            )}
            
            <div className="absolute inset-0 bg-gray-950 rounded-lg shadow-2xl p-4 pointer-events-auto transition-opacity duration-300 ease-in-out opacity-100 flex flex-col h-full gap-3 animate-fade-in md:overflow-y-hidden overflow-y-auto z-[70] font-sans select-none">
                {/* Visual Facelift Custom RPG Border */}
                <div className="absolute inset-0 pointer-events-none border border-yellow-600/30 rounded-lg m-[2px]" />
                
                {/* SVG Corner Decorations (Scales cleanly, rotated appropriately) */}
                <svg className="absolute top-1.5 left-1.5 w-6 h-6 text-yellow-500/80 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v3H3v21H0V0z" />
                    <rect x="5" y="5" width="4" height="4" />
                </svg>
                <svg className="absolute top-1.5 right-1.5 w-6 h-6 text-yellow-500/80 pointer-events-none rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v3H3v21H0V0z" />
                    <rect x="5" y="5" width="4" height="4" />
                </svg>
                <svg className="absolute bottom-1.5 left-1.5 w-6 h-6 text-yellow-500/80 pointer-events-none -rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v3H3v21H0V0z" />
                    <rect x="5" y="5" width="4" height="4" />
                </svg>
                <svg className="absolute bottom-1.5 right-1.5 w-6 h-6 text-yellow-500/80 pointer-events-none rotate-180" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v3H3v21H0V0z" />
                    <rect x="5" y="5" width="4" height="4" />
                </svg>
                
                {/* Elegant border lines with gold/bronze gradients */}
                <div className="absolute top-1.5 left-7 right-7 h-[2px] bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 pointer-events-none opacity-80" />
                <div className="absolute bottom-1.5 left-7 right-7 h-[2px] bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 pointer-events-none opacity-80" />
                <div className="absolute left-1.5 top-7 bottom-7 w-[2px] bg-gradient-to-b from-yellow-700 via-yellow-500 to-yellow-700 pointer-events-none opacity-80" />
                <div className="absolute right-1.5 top-7 bottom-7 w-[2px] bg-gradient-to-b from-yellow-700 via-yellow-500 to-yellow-700 pointer-events-none opacity-80" />

                {isLastTextPage && isTypingFinished && hasRealOptions && showOptionsState ? (
                    /* Second Window: Options Only */
                    <div className="flex items-start gap-4 w-full h-full relative z-10 p-2">
                        <img src={resolvedIcon} alt={npcName} className="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-full flex-shrink-0 pixelated-image npc-icon-white mt-1" />
                        <div className="flex-grow flex flex-col justify-between h-full pr-1">
                            <div>
                                <h3 className="font-bold text-yellow-400 font-pixel-rpg text-xl tracking-wide">{npcName}</h3>
                                <div className="mt-2 w-full">
                                    {renderOptionsGrid()}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Dialogue Text Window */
                    <div className="flex items-start gap-4 w-full h-full relative z-10 p-2">
                        <img src={resolvedIcon} alt={npcName} className="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-full flex-shrink-0 pixelated-image npc-icon-white mt-1" />
                        <div className="flex-grow flex flex-col justify-between h-full pr-1">
                            <div>
                                <h3 className="font-bold text-yellow-400 font-pixel-rpg text-xl tracking-wide">{npcName}</h3>
                                <p className="text-xl text-gray-200 font-pixel-rpg py-1 leading-none mt-1">{displayedText}</p>
                            </div>
                            <div className="flex justify-center pb-1 mt-auto">
                                <button onClick={handleNextPage} className="text-blue-400 hover:text-blue-300 font-pixel-rpg text-xl font-bold underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed animate-pulse" disabled={isDialogueProcessing}>
                                    {textSpeed === 'instant' || isTypingFinished ? "Click here to continue" : "Click here to skip"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {tooltip && (
                <div
                    className={`fixed z-[9999] pointer-events-none bg-red-900/95 text-white border border-red-500 rounded px-3 py-1.5 font-pixel-rpg text-lg shadow-xl transition-all duration-300 ease-out whitespace-nowrap ${tooltip.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
                    style={{
                        left: tooltip.x,
                        top: tooltip.y - 40,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-500" />
                    {tooltip.message}
                </div>
            )}
        </>
    );
};

export default DialogueOverlay;
