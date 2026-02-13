'use client';

import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

interface AccordionItem {
  title: string;
  content?: React.ReactNode | PortableTextBlock[];
}

interface ProductAccordionProps {
  items?: AccordionItem[];
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-sm text-[#525252] leading-[160%]">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc pl-5 text-sm text-[#525252] leading-[160%]">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal pl-5 text-sm text-[#525252] leading-[160%]">
        {children}
      </ol>
    ),
  },
};

function isPortableText(
  content: React.ReactNode | PortableTextBlock[]
): content is PortableTextBlock[] {
  return (
    Array.isArray(content) &&
    content.length > 0 &&
    typeof content[0] === 'object' &&
    content[0] !== null &&
    '_type' in content[0]
  );
}

function AccordionContent({
  content,
}: {
  content: React.ReactNode | PortableTextBlock[];
}) {
  if (isPortableText(content)) {
    return (
      <div className="flex flex-col gap-2">
        <PortableText value={content} components={portableTextComponents} />
      </div>
    );
  }
  return <>{content}</>;
}

const defaultItems: AccordionItem[] = [
  {
    title: 'Size + pack details',
    content: (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#525252] leading-[160%]">
          We optimize our boxes according to the average number of changes
          babies need as they grow. Each box contains 6 packs of diapers,
          approximately a one-month supply:
        </p>
        <ul className="list-disc pl-5 text-sm text-[#525252] leading-[160%]">
          <li>N (&lt;10 lbs): 186 total count/box (~6 changes/ day)</li>
          <li>
            N+1 (&lt;10-12 lbs): 192 total count/box (~7 changes/ day); this box
            includes 3 packs of Size Newborn (93 count) + 3 packs of Size 1 (99
            count)
          </li>
          <li>1 (8-12 lbs): 198 total count/box (~7 changes/ day)</li>
          <li>2 (10-16 lbs): 186 total count/box (~6 changes/ day)</li>
          <li>3 (14-24 lbs): 168 total count/box (~6 changes/ day)</li>
          <li>4 (20-32 lbs): 150 total count/box (~5 changes/ day)</li>
          <li>5 (27+ lbs): 132 total count/box (~5 changes/ day)</li>
          <li>6 (35+ lbs): 108 total count/box (~4 changes/ day)</li>
          <li>7 (41+ lbs): 96 total count/box (~4 changes/ day)</li>
        </ul>
        <p className="text-sm text-[#525252] leading-[160%]">
          Every baby is different! You can modify Auto-Renew delivery frequency
          on your Account Page.
        </p>
      </div>
    ),
  },
  {
    title: 'Clean ingredients',
    content: (
      <div className="flex flex-col gap-2">
        <ul className="list-disc pl-5 text-sm text-[#525252] leading-[160%]">
          <li>
            Hypoallergenic, dermatologist tested, cruelty free, 25% plant-based
            materials
          </li>
          <li>
            No added fragrance, lotion, latex, rubber, alcohol, parabens,
            phthalates, pesticides, chlorine bleaching, VOCs, or optical
            brighteners
          </li>
          <li>Certified safe from 1,000+ potentially harmful chemicals* </li>
          <li>
            Ingredient list: Absorbent core made of sodium polyacrylate (SAP)
            and Totally Chlorine Free (TCF) wood pulp from sustainably managed
            forests. Backsheet made from polypropylene, polyester and
            polyethylene. Topsheet made of polypropylene. High loft nonwoven
            acquisition layer made of polyester. Fastening system made of
            polypropylene/polyethylene. Adhesives, elastics, wetness indicator.
          </li>
        </ul>
        <p className="text-sm text-[#525252] leading-[160%]">
          <em>
            *Certified to OEKO-TEX® STANDARD 100, #25.HUS.21438 Hohenstein
          </em>
        </p>
      </div>
    ),
  },
  {
    title: 'Benefits of Auto-Renew',
    content: (
      <ul className="list-disc pl-5 text-sm text-[#525252] leading-[160%]">
        <li>Save 10% on every order</li>
        <li>
          Delivered to your door on your schedule (every 3, 4, or 5 weeks)
        </li>
        <li>Manage everything—from product size to delivery date—via text</li>
        <li>
          Happiness guarantee: we&apos;re standing by to help with any questions
          or issues
        </li>
      </ul>
    ),
  },
  {
    title: 'Why we love it',
    content: (
      <ul className="list-disc pl-5 text-sm text-[#525252] leading-[160%]">
        <li>
          Holds over 16 oz liquid (based on lab testing of size 4 diapers)
        </li>
        <li>
          Up to 12-hr leak protection (we especially love this for overnights)
        </li>
        <li>Absorbs liquid in seconds to minimize leaks and blowouts</li>
        <li>
          Keeps skin dry, day + night, to reduce the likelihood of diaper rash
        </li>
        <li>Ultra-soft, apparel-grade materials for comfort</li>
        <li>Wetness indicator alerts when a change is needed</li>
        <li>
          Newborn size includes an umbilical cord notch + Newborn size and Size
          1 include overlapping tabs for a snug, customizable fit
        </li>
      </ul>
    ),
  },
];

export default function ProductAccordion({
  items = defaultItems,
}: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div key={index}>
          <div className="border-t border-gray-200" />
          <button
            onClick={() => toggleItem(index)}
            className="flex items-center justify-between w-full py-5 text-left"
          >
            <span className="text-sm text-[#141414]">{item.title}</span>
            <span className="text-xl text-[#525252] flex-shrink-0 ml-4 w-3 h-3 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
                className={`w-[1.2rem] h-[1.2rem] transition-transform duration-200 ${
                  openIndex === index ? '' : 'rotate-45'
                }`}
              >
                <path stroke="currentColor" d="M1 15 15 1M15 15 1 1" />
              </svg>
            </span>
          </button>
          {openIndex === index && (
            <div className="pb-5">
              <AccordionContent content={item.content} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
