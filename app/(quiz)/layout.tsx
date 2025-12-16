import { QuizProvider } from '@/lib/quiz';

export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QuizProvider>
      <div className="flex flex-col h-dvh overflow-hidden">{children}</div>
    </QuizProvider>
  );
}
