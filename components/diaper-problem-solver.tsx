'use client';

import { useState } from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Problem {
  id: string;
  problem: string;
  symptom: string;
  rootCause: string;
  solution: string;
  icon?: string;
}

interface DiaperProblemSolverProps {
  problems?: Problem[];
}

const defaultProblems: Problem[] = [
  {
    id: '1',
    problem: 'Poor Sleep',
    symptom: 'Baby wakes frequently at night, seems restless',
    rootCause:
      'Diaper isn’t absorbent enough, leaving skin wet and uncomfortable',
    solution:
      'Coterie’s fast-wicking technology keeps skin dry all night long',
  },
  {
    id: '2',
    problem: 'Diaper Rash',
    symptom: 'Red, irritated skin that won’t clear up',
    rootCause:
      'Harsh chemicals, fragrances, or wetness from poor absorbency',
    solution:
      'Clean ingredients—no fragrance, lotion, latex, dyes, chlorine, or parabens',
  },
  {
    id: '3',
    problem: 'Frequent Leaks',
    symptom: 'Clothing and bedding constantly getting wet',
    rootCause: 'Inferior absorbency and poor fit',
    solution:
      'Superior absorbency with 360° stretch for perfect fit and leak protection',
  },
  {
    id: '4',
    problem: 'Fussiness',
    symptom: 'Baby seems uncomfortable, especially during changes',
    rootCause: 'Diaper material is rough or causing irritation',
    solution:
      'Soft, hypoallergenic material that’s dermatologist tested for sensitive skin',
  },
];

export default function DiaperProblemSolver({
  problems = defaultProblems,
}: DiaperProblemSolverProps) {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0000C9] mb-4">
            It&apos;s Not You, It&apos;s Your Diaper
          </h2>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto">
            Many common parenting challenges are actually caused by the diaper
            itself. Here&apos;s how Coterie solves them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((item) => {
            const isSelected = selectedProblem === item.id;

            return (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#0000C9] bg-[#D1E3FB]/20 shadow-lg'
                    : 'border-gray-200 hover:border-[#0000C9]/50'
                }`}
                onClick={() =>
                  setSelectedProblem(isSelected ? null : item.id)
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#0000C9]' : 'bg-gray-100'
                    }`}
                  >
                    <ExclamationTriangleIcon
                      className={`w-6 h-6 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#0000C9] mb-2">
                      {item.problem}
                    </h3>
                    <p className="text-sm text-[#525252] mb-3">
                      <span className="font-medium">Symptom:</span> {item.symptom}
                    </p>

                    {isSelected && (
                      <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs font-semibold text-red-600 uppercase mb-1">
                            Root Cause
                          </p>
                          <p className="text-sm text-[#525252]">
                            {item.rootCause}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircleIcon className="w-5 h-5 text-[#0000C9] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-[#0000C9] uppercase mb-1">
                              Coterie Solution
                            </p>
                            <p className="text-sm text-[#525252]">
                              {item.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

