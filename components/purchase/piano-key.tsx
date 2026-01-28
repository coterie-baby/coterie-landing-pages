import { SizeOption } from './context';

interface PianoKeyProps {
  size: SizeOption;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PianoKey({
  size,
  isSelected,
  onSelect,
}: PianoKeyProps) {
  return (
    <div
      onClick={onSelect}
      className={`px-[7px] h-[54px] flex flex-col justify-center rounded-lg border text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
        isSelected
          ? 'border-[#0000C9] bg-white'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <span className="font-semibold text-sm">{size.label}</span>
      <span className="text-xs text-[#515151] font-normal mt-0.5 ">
        {size.weightRange}
      </span>
    </div>
  );
}
