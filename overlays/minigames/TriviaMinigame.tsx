import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { FESTIVAL_TRIVIA_QUESTIONS } from '../../constants/festival';

type FestivalGame = 'trivia' | 'lantern_launch' | 'log_balance' | 'whack_lantern' | 'smash_gourd' | 'high_striker' | 'skeeball' | 'balloon_pop';

type Props = {
  questLogic: any;
  inv: any;
  addLog: (msg: string) => void;
  setActiveFestivalMinigame: (val: FestivalGame | null) => void;
};

const TriviaMinigame: React.FC<Props> = ({ questLogic, inv, addLog, setActiveFestivalMinigame }) => {
  const triviaIndex = (questLogic as any).getQuestVariable('trivia_question_index') ?? 0;
  const isTriviaAnswered = (questLogic as any).getQuestVariable('trivia_answered') ?? 0;
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const handleSelectTriviaAnswer = (choiceIndex: number) => {
    if (isTriviaAnswered !== 0) return;
    setSelectedChoice(choiceIndex);
    const currentQuestion = FESTIVAL_TRIVIA_QUESTIONS[triviaIndex];
    const correct = choiceIndex === currentQuestion.correctIndex;
    const today = Math.floor(Date.now() / 86400000);
    (questLogic as any).setQuestVariable('last_played_trivia', today);
    if (correct) {
      (questLogic as any).setQuestVariable('trivia_answered', 1);
      inv.modifyItem('festival_ticket', 10, false);
      addLog('Trivia correct! You earned 10 Festival Tickets.');
    } else {
      addLog('Incorrect trivia answer. Better luck tomorrow!');
    }
  };

  return (
    <div className="bg-gray-900/90 border border-yellow-500/40 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl max-w-lg w-full flex flex-col gap-6 font-pixel-rpg my-auto">
      <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800 text-left">
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-sans">
          {FESTIVAL_TRIVIA_QUESTIONS[triviaIndex].question}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {FESTIVAL_TRIVIA_QUESTIONS[triviaIndex].choices.map((choice, i) => {
          let buttonStyle = 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white';
          if (isTriviaAnswered !== 0) {
            if (i === FESTIVAL_TRIVIA_QUESTIONS[triviaIndex].correctIndex) {
              buttonStyle = 'bg-emerald-900/60 border-emerald-500 text-emerald-200 cursor-default';
            } else if (i === selectedChoice) {
              buttonStyle = 'bg-rose-900/60 border-rose-500 text-rose-200 cursor-default';
            } else {
              buttonStyle = 'bg-gray-950/40 border-gray-900 text-gray-600 cursor-default opacity-50';
            }
          }
          return (
            <button
              key={i}
              disabled={isTriviaAnswered !== 0}
              onClick={() => handleSelectTriviaAnswer(i)}
              className={`w-full py-3 px-4 rounded-xl border text-left text-xs sm:text-sm font-pixel-rpg transition-all duration-200 ${buttonStyle}`}
            >
              <span className="inline-block w-6 text-yellow-500 font-bold">{String.fromCharCode(65 + i)}.</span>
              {choice}
            </button>
          );
        })}
      </div>
      {isTriviaAnswered !== 0 && (
        <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800 text-left flex flex-col gap-2 animate-fade-in font-sans">
          <span className={`text-xs font-bold font-pixel-rpg uppercase ${isTriviaAnswered === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isTriviaAnswered === 1 ? '✓ Correct! (+10 Tickets)' : '✗ Incorrect! (0 Tickets)'}
          </span>
          <p className="text-xs text-gray-400 leading-relaxed">
            {FESTIVAL_TRIVIA_QUESTIONS[triviaIndex].explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default TriviaMinigame;
