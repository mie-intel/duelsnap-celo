'use client';

import { useRef, useEffect, useState } from 'react';

interface QuestionCardProps {
  imageUrl: string;
  questionNum: number;
  totalQuestions: number;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function QuestionCard({
  imageUrl, questionNum, totalQuestions, value, onChange, onSubmit, disabled,
}: QuestionCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    inputRef.current?.focus();
  }, [questionNum]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full max-w-4xl mx-auto lg:items-center">
      {/* Image */}
      <div className="lg:flex-1">
        <div className="flex items-center justify-between text-xs text-text-secondary font-sans mb-3">
          <span>{questionNum} / {totalQuestions}</span>
        </div>
        <div className="relative rounded-3xl overflow-hidden bg-bg-card aspect-square max-h-72 lg:max-h-none w-full flex items-center justify-center shadow-sm">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-surface-1 animate-pulse" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Guess this"
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="eager"
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      </div>

      {/* Input panel */}
      <div className="lg:flex-1 flex flex-col justify-center gap-4">
        <div className="hidden lg:block">
          <p className="text-text-secondary text-sm font-sans mb-1">
            {questionNum === 1 ? "🔍 Let's start — what do you see?" : questionNum === totalQuestions ? "🏁 Last one!" : "🤔 What is this?"}
          </p>
          <p className="text-text-primary font-display font-bold text-2xl">
            Question {questionNum} of {totalQuestions}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\s+/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && !disabled && onSubmit()}
            placeholder="Type your answer..."
            maxLength={40}
            disabled={disabled}
            autoCapitalize="characters"
            className="flex-1 rounded-2xl bg-bg-card border border-text-secondary/20 px-4 py-3 font-sans text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-primary/50 uppercase disabled:opacity-50"
          />
          <button
            onClick={onSubmit}
            disabled={!value.trim() || disabled}
            className="px-5 py-3 rounded-2xl bg-primary text-text-inverse font-semibold text-sm font-sans disabled:opacity-40 active:opacity-80"
          >
            Go
          </button>
        </div>
        <p className="text-text-secondary/50 text-xs font-sans hidden lg:block">
          Press Enter or tap Go to submit
        </p>
      </div>
    </div>
  );
}
