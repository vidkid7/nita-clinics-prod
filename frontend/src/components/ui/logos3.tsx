"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
  website?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  variant?: 'plain' | 'clinical';
}

const Logos3 = ({
  heading = "Trusted by these companies",
  logos = [],
  variant = 'plain',
}: Logos3Props) => {
  if (logos.length === 0) return null;

  /* Duplicate the array enough times so Embla always has overflow to scroll */
  const items = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <div className="py-10">
      {heading && (
        <div className="container-custom flex flex-col items-center text-center mb-8">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">
            {heading}
          </p>
        </div>
      )}

      <div className="relative overflow-hidden w-full">
        {/* Fade edges — sit above the carousel */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

        <Carousel
          opts={{ loop: true }}
          plugins={[
            AutoScroll({ playOnInit: true, speed: 2, stopOnInteraction: false }),
          ]}
        >
          <CarouselContent className="ml-0">
            {items.map((logo, i) => (
              <CarouselItem
                key={`${logo.id}-${i}`}
                className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/4"
              >
                {logo.website ? (
                  <a
                    href={logo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-1.5 flex shrink-0 items-center justify-center"
                    aria-label={logo.description}
                  >
                    <LogoCard logo={logo} variant={variant} />
                  </a>
                ) : (
                  <div className="mx-1.5 flex shrink-0 items-center justify-center">
                    <LogoCard logo={logo} variant={variant} />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

function LogoCard({
  logo,
  variant = 'plain',
}: {
  logo: Logo;
  variant?: 'plain' | 'clinical';
}) {
  if (variant === 'clinical') {
    return (
      <div className="group relative flex h-20 w-48 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-white px-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_40px_-16px_rgba(1,173,165,0.4)]">
        {/* corner doodle cross */}
        <svg className="absolute -left-1 -top-1 h-5 w-5 text-primary-200/80" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {/* top signal bar */}
        <span className="absolute inset-x-3 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-primary-400/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo.image}
          alt={logo.description}
          className={
            logo.className ||
            "max-h-11 w-auto max-w-[140px] object-contain opacity-70 group-hover:opacity-100 transition-all duration-500"
          }
        />
        {/* ECG trace */}
        <svg className="absolute inset-x-3 bottom-0 h-3 w-[calc(100%-1.5rem)]" viewBox="0 0 168 12" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 8 H50 L58 3 L66 10 L72 5 L78 8 H168"
            fill="none"
            stroke="rgba(1,173,165,0.3)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40 10"
            className="animate-ecg-flow"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-16 w-40 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.image}
        alt={logo.description}
        className={
          logo.className ||
          "max-h-12 w-auto max-w-[140px] object-contain opacity-70 group-hover:opacity-100 transition-opacity"
        }
      />
    </div>
  );
}

export { Logos3 };
