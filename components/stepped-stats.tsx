interface SteppedStat {
  value: string;
  title: string;
  description?: string;
  color?: 'light' | 'dark' | 'brand';
}

interface SteppedStatsProps {
  headline?: string;
  description?: string;
  stats?: SteppedStat[];
}

const colorStyles: Record<string, { bg: string; valueColor: string; titleColor: string; descColor: string }> = {
  light: {
    bg: 'bg-gray-50 dark:bg-white/5 dark:inset-ring dark:inset-ring-white/10',
    valueColor: 'text-gray-900 dark:text-white',
    titleColor: 'text-gray-900 dark:text-white',
    descColor: 'text-gray-600 dark:text-gray-300',
  },
  dark: {
    bg: 'bg-gray-900 dark:bg-gray-700 dark:inset-ring dark:inset-ring-white/10',
    valueColor: 'text-white',
    titleColor: 'text-white',
    descColor: 'text-gray-400 dark:text-gray-300',
  },
  brand: {
    bg: 'bg-indigo-600 dark:inset-ring dark:inset-ring-white/10',
    valueColor: 'text-white',
    titleColor: 'text-white',
    descColor: 'text-indigo-200 dark:text-indigo-100',
  },
};

const sizeStyles = [
  'sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start',
  'sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44',
  'sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28',
];

const defaultStats: SteppedStat[] = [
  { value: '250k', title: 'Users on the platform', description: 'Vel labore deleniti veniam consequuntur sunt nobis.', color: 'light' },
  { value: '$8.9 billion', title: "We're proud that our customers have made over $8 billion in total revenue.", description: 'Eu duis porta aliquam ornare. Elementum eget magna egestas.', color: 'dark' },
  { value: '401,093', title: 'Transactions this year', description: 'Eu duis porta aliquam ornare. Elementum eget magna egestas. Eu duis porta aliquam ornare.', color: 'brand' },
];

export default function SteppedStats({
  headline = 'We approach work as a place to make the world better',
  description = 'Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est non placerat nam arcu. Cras purus nibh cursus sit eu in id. Integer vel nibh.',
  stats = defaultStats,
}: SteppedStatsProps) {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="px-4 lg:px-10">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            {headline}
          </h2>
          <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
          {stats.map((stat, index) => {
            const colors = colorStyles[stat.color || 'light'];
            const size = sizeStyles[index] || sizeStyles[0];
            return (
              <div
                key={index}
                className={`flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 ${colors.bg} ${size}`}
              >
                <p className={`flex-none text-3xl font-bold tracking-tight ${colors.valueColor}`}>
                  {stat.value}
                </p>
                <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                  <p className={`text-lg font-semibold tracking-tight ${colors.titleColor}`}>
                    {stat.title}
                  </p>
                  {stat.description && (
                    <p className={`mt-2 text-base/7 ${colors.descColor}`}>
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
