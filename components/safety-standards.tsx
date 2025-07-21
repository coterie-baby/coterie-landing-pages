import Image from 'next/image';
import { Button } from './ui/button';

export default function SafetyStandards() {
  const icons = [
    {
      src: '/chlorine.svg',
      alt: 'Zero Chlorine Bleaching',
    },
    {
      src: '/dermatologist-tested.svg',
      alt: 'Dermatologist Tested',
    },
    {
      src: '/hypoallergenic.svg',
      alt: 'Clinically Proven Hypoallergenic',
    },
    {
      src: '/paraben-free.svg',
      alt: 'No Parabens, Dyes, Phthalates, Fragrance',
    },
  ];
  return (
    <div className="px-4 py-15 md:px-10">
      <div className="md:flex gap-[140px]">
        <h4 className="hidden md:block md:max-w-[337px]">
          Made better in every way
        </h4>
        <div className="flex flex-col gap-10 md:max-w-[883px]">
          <div className="flex flex-col gap-4">
            <h3 className="md:hidden">Made better in every way</h3>
            <h5 className="md:text-[24px] md:tracking-[-0.24px] md:leading-[120%]">
              Our diapers are free of fragrance, lotion, latex, rubber, dyes,
              alcohol, heavy metals, parabens, phthalates, chlorine bleaching,
              VOCs, and optical brighteners. They’re third-party tested (never
              on animals) by independent labs, and we publish the results for
              transparency
            </h5>
          </div>
          <div className="flex justify-between md:justify-start md:gap-15">
            {icons.map((icon, i) => (
              <Image
                key={i}
                src={icon.src}
                alt={icon.alt}
                width={80}
                height={80}
              />
            ))}
          </div>
          <div>
            <Button className="md:w-[347px]">Read the safety reports</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
