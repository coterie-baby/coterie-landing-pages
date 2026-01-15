'use client';

import { useState } from 'react';
import PianoKey from './piano-key';
import { SizeOption } from '../pdp-hero';

interface SizeSelectionProps {
  sizes?: SizeOption[];
}

const defaultSizes: SizeOption[] = [
  { id: 'n', label: 'N or N+1', weightRange: 'Under 10 lbs' },
  { id: '1', label: '1', weightRange: '8-12 lbs' },
  { id: '2', label: '2', weightRange: '10-16 lbs' },
  { id: '3', label: '3', weightRange: '14-24 lbs' },
  { id: '4', label: '4', weightRange: '20-32 lbs' },
  { id: '5', label: '5', weightRange: '28-40 lbs' },
  { id: '6', label: '6', weightRange: '35+ lbs' },
  { id: '7', label: '7', weightRange: '41+ lbs' },
];

export default function SizeSelection({
  sizes = defaultSizes,
}: SizeSelectionProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm">Pick your size:</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {sizes.slice(0, 8).map((size) => (
          <PianoKey
            key={size.id}
            size={size}
            isSelected={selectedSize === size.id}
            onSelect={() => setSelectedSize(size.id)}
          />
        ))}
      </div>
    </div>
  );
}
