import { useState } from 'react';
import { SizeOption } from '../pdp-hero';
import posthog from 'posthog-js';

interface PianoKeyProps {
  size: SizeOption;
}

export default function PianoKey({ size }: PianoKeyProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeSelect = () => {
    setSelectedSize(size.id);
    posthog.capture('size_selected', {
      size_id: size.id,
      size_label: size.label,
      weight_range: size.weightRange,
      source: 'pdp_hero',
    });
  };

  return (
    <div
      key={size.id}
      onClick={handleSizeSelect}
      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
        selectedSize === size.id
          ? 'border-[#0000C9] bg-[#0000C9] text-white'
          : 'border-gray-200 bg-white text-black hover:border-gray-300'
      }`}
    >
      <div className="font-semibold">{size.label}</div>
      <div className="text-xs mt-0.5 opacity-75">{size.weightRange}</div>
    </div>
  );
}
