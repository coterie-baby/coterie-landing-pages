import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '../ui/card';

interface MetricsCardProps {
  label: string;
  value: string;
  trend: number;
  trendMessage: string;
  subtitle: string;
  className?: string;
}

export function MetricsCard({ label, value, className }: MetricsCardProps) {
  return (
    <Card
      className={`@container/card py-0 bg-white border-[#DEDFE2] ${className ?? ''}`}
    >
      <CardHeader className="h-max-content !pb-3 py-3 flex flex-col gap-1 border-b border-[#DEDFE2]">
        <CardDescription className="font-medium !text-sm">
          {label}
        </CardDescription>
        <CardDescription className="text-xs text-[#5A5E68]">
          Last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
    </Card>
  );
}

export function MetricsCardSkeleton() {
  return (
    <Card className="@container/card bg-white border-[#DEDFE2]">
      <CardHeader>
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200 @[250px]/card:h-9" />
        <CardAction>
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
    </Card>
  );
}
