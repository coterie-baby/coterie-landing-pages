interface QuoteProps {
  quote: string;
}

export default function Quote({ quote = '' }: QuoteProps) {
  return (
    <div className="px-4 py-10 text-center">
      <div>
        <span className="text-3xl text-[#0000C9]">&quot;{quote}&quot;</span>
      </div>
    </div>
  );
}
