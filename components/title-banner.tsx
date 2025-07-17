interface TitleBannerProps {
  headline: string;
  subheader: string;
}

export default function TitleBanner({ headline, subheader }: TitleBannerProps) {
  return (
    <section className="px-4 py-20 md:px-20">
      <div className="flex flex-col gap-4 text-center max-w-[846px] md:mx-auto">
        <h2 className="md:text-[112px]! md:leading-[100%]! md:tracking-[-2.24px]!">
          {headline}
        </h2>
        <p className="text-sm text-[#525252] leading-[140%] md:max-w-[670px] md:mx-auto md:text-[17px] md:leading-[140%]">
          {subheader}
        </p>
      </div>
    </section>
  );
}
