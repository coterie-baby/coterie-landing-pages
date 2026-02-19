'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Card {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  label?: string;
  modalDescription?: string;
  modalSectionLabel?: string;
  modalSectionText?: string;
  modalImageUrl?: string;
  modalImageAlt?: string;
  modalLinkText?: string;
  modalLinkUrl?: string;
}

interface ValuePropCardsProps {
  headline?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  cards?: Card[];
}

export default function ValuePropCards({
  headline,
  description,
  linkText,
  linkUrl,
  cards = [],
}: ValuePropCardsProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  return (
    <section className="bg-[#F9F4EC] px-6 md:px-16 py-14">
      {/* Section header */}
      <div className="text-center mb-10 max-w-lg mx-auto">
        {headline && (
          <h4 className="text-4xl font-bold text-[#1B1F3B] mb-4">{headline}</h4>
        )}
        {description && (
          <p className="text-base text-[#525252] leading-relaxed mb-4">{description}</p>
        )}
        {linkText && linkUrl && (
          <a href={linkUrl} className="text-[#1B1F3B] underline text-base">
            {linkText}
          </a>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative bg-white rounded-2xl overflow-hidden min-h-[100px]"
          >
            {/* Card image — bleeds from top-right corner */}
            {card.imageUrl && (
              <div className="absolute top-0 right-0 w-36 h-28 pointer-events-none">
                <Image
                  src={card.imageUrl}
                  alt={card.imageAlt || card.title}
                  fill
                  className="object-cover object-left-bottom"
                />
              </div>
            )}

            {/* Card content */}
            <div className="px-4 pt-4 pb-3">
              <p className="text-base font-medium text-[#1B1F3B]">{card.title}</p>
              {card.subtitle && (
                <p className="text-sm text-[#525252] mt-1">{card.subtitle}</p>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-end px-4 pb-4">
              {/* {card.label ? (
                <p className="text-sm font-bold text-[#1B1F3B]">{card.label}</p>
              ) : (
                <span />
              )} */}
              <button
                onClick={() => setActiveCard(card)}
                className="w-6 h-6 rounded-full bg-gray-300/70 flex items-center justify-center text-gray-600 hover:bg-gray-400/70 transition-colors flex-shrink-0"
                aria-label={`Learn more about ${card.title}`}
              >
                <span className="text-lg leading-none pb-0.5">+</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setActiveCard(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveCard(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black text-xl"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="px-6 pt-6 pb-8">
              {/* Modal title */}
              <h3 className="text-2xl font-bold text-[#1B1F3B] mb-4">{activeCard.title}</h3>
              <hr className="border-gray-200 mb-5" />

              {/* Main description */}
              {activeCard.modalDescription && (
                <p className="text-base text-gray-700 leading-relaxed mb-6">
                  {activeCard.modalDescription}
                </p>
              )}

              {/* Section label */}
              {activeCard.modalSectionLabel && (
                <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                  {activeCard.modalSectionLabel}
                </p>
              )}

              {/* Section text */}
              {activeCard.modalSectionText && (
                <p className="text-base text-gray-700 leading-relaxed mb-6">
                  {activeCard.modalSectionText}
                </p>
              )}

              {/* Modal image */}
              {activeCard.modalImageUrl && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={activeCard.modalImageUrl}
                    alt={activeCard.modalImageAlt || activeCard.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Learn more link */}
              {activeCard.modalLinkText && activeCard.modalLinkUrl && (
                <a
                  href={activeCard.modalLinkUrl}
                  className="text-base font-semibold text-[#1B1F3B] underline"
                >
                  {activeCard.modalLinkText}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
