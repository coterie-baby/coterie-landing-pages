'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface MythReality {
  id: string;
  myth: string;
  reality: string;
  explanation: string;
}

interface DiaperMythRealityProps {
  items?: MythReality[];
}

const defaultItems: MythReality[] = [
  {
    id: '1',
    myth: 'Babies naturally wake up at night',
    reality: 'Wet diapers disrupt sleep',
    explanation:
      'When diapers don’t wick moisture away quickly, your baby’s skin stays wet, causing discomfort that wakes them. Coterie’s fast-wicking technology keeps skin dry for uninterrupted sleep.',
  },
  {
    id: '2',
    myth: 'Diaper rash is just part of parenting',
    reality: 'Rash is often caused by diaper ingredients',
    explanation:
      'Many diapers contain fragrances, lotions, chlorine, and other chemicals that irritate sensitive skin. Coterie uses clean ingredients—no fragrance, lotion, latex, dyes, chlorine, or parabens.',
  },
  {
    id: '3',
    myth: 'Leaks mean you need to change more often',
    reality: 'Leaks mean the diaper isn’t working properly',
    explanation:
      'Frequent leaks indicate poor absorbency and fit. Coterie’s superior absorbency and 360° stretch provide better coverage and leak protection, so you can change on your schedule, not the diaper’s.',
  },
  {
    id: '4',
    myth: 'All diapers are basically the same',
    reality: 'Diaper quality directly impacts your baby’s comfort',
    explanation:
      'The difference between a good and bad diaper affects sleep, skin health, and your baby’s overall comfort. Coterie is hypoallergenic, dermatologist tested, and designed for sensitive skin.',
  },
];

export default function DiaperMythReality({
  items = defaultItems,
}: DiaperMythRealityProps) {
  return (
    <section className="py-12 px-4 bg-[#D1E3FB]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h5 className="text-3xl md:text-4xl font-semibold text-[#0000C9] mb-4">
            Myth vs. Reality
          </h5>
          <p className="text-lg text-[#525252] max-w-2xl mx-auto">
            Common beliefs about baby care that might actually be diaper-related
            issues
          </p>
        </div>

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-6 md:p-8 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* Myth */}
                <div className="border-l-4 border-red-200 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                      Myth
                    </span>
                  </div>
                  <p className="text-base md:text-lg text-[#525252] font-medium">
                    {item.myth}
                  </p>
                </div>

                {/* Reality */}
                <div className="border-l-4 border-[#0000C9] pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckIcon className="w-5 h-5 text-[#0000C9]" />
                    <span className="text-xs font-semibold text-[#0000C9] uppercase tracking-wide">
                      Reality
                    </span>
                  </div>
                  <p className="text-base md:text-lg text-[#0000C9] font-semibold">
                    {item.reality}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm md:text-base text-[#525252] leading-relaxed">
                  {item.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
