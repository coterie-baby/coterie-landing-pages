interface Stat {
  id?: number;
  name: string;
  value: string;
}

interface SimpleStatsProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
  { id: 2, name: 'Assets under holding', value: '$119 trillion' },
  { id: 3, name: 'New users annually', value: '46,000' },
];

export default function SimpleStats({
  stats = defaultStats,
}: SimpleStatsProps) {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="px-4 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.id ?? index}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base/7 text-gray-600 dark:text-gray-400">
                {stat.name}
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
