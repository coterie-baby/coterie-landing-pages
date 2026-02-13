import Image from 'next/image';

interface Feature {
  icon: string;
  label: string;
}

interface ProductFeaturesProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    icon: 'https://cdn.sanity.io/images/e4q6bkl9/production/c400940161ea9462755c9f9a6ef13a844f7f570e-100x100.svg?w=2400&h=2400&q=100&fit=crop&auto=format',
    label: 'Designed for sleep',
  },
  {
    icon: 'https://cdn.sanity.io/images/e4q6bkl9/production/a8fde2b9bdfe4f20f408ce7079fffaa052238b0d-100x100.svg?w=2400&h=2400&q=100&fit=crop&auto=format',
    label: 'Minimize leaks and blowouts',
  },
  {
    icon: 'https://cdn.sanity.io/images/e4q6bkl9/production/88f269a5d7e58634b4349f3ef7fef32abd77b532-100x100.svg?w=2400&h=2400&q=100&fit=crop&auto=format',
    label: 'Made without fragrance or lotions',
  },
  {
    icon: 'https://cdn.sanity.io/images/e4q6bkl9/production/4d46231bcd3bb50d1b67631dca5a86bbc18360ba-100x100.svg?w=2400&h=2400&q=100&fit=crop&auto=format',
    label: 'Manage orders via text',
  },
];

export default function ProductFeatures({
  features = defaultFeatures,
}: ProductFeaturesProps) {
  return (
    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center gap-2"
        >
          <div className="relative w-10 h-10 text-[#141414]">
            <Image
              src={feature.icon}
              alt={feature.label}
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs text-[#515151] leading-[140%]">
            {feature.label}
          </p>
        </div>
      ))}
    </div>
  );
}
