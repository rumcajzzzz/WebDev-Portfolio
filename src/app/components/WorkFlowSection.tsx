'use client';

import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';

// Dynamic import: static JSON imports break the RSC client manifest and bloat the main bundle.
const loadWorkflowAnimations = () =>
  Promise.all([
    import('@/assets/lottie/workflow1.json'),
    import('@/assets/lottie/workflow2.json'),
    import('@/assets/lottie/workflow3.json'),
    import('@/assets/lottie/workflow4.json'),
  ]).then((modules) => modules.map((m) => m.default));

const steps = [
  {
    title: 'Szybki kontakt',
    description:
      'Rozmawiamy krótko i konkretnie – telefonicznie lub mailowo. Od razu pokazuję trafne przykłady dopasowane do Twojej branży.',
  },
  {
    title: 'Dopasowana propozycja',
    description:
      'Na podstawie rozmowy przygotowuję koncepcję strony – estetykę, układ i treści dopasowane do celów Twojej firmy.',
  },
  {
    title: 'Projekt i poprawki',
    description:
      'Tworzę stronę od podstaw. Wprowadzam zmiany na bieżąco, zgodnie z Twoimi uwagami – aż do pełnego zadowolenia.',
  },
  {
    title: 'Publikacja i start',
    description:
      'Pomagam z domeną i uruchomieniem strony. Wszystko działa bez zarzutu – Ty możesz skupić się na biznesie.',
  },
];

function WorkflowCard({
  index,
  title,
  description,
  animation,
  cardRef,
}: {
  index: number;
  title: string;
  description: string;
  animation?: unknown;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  // Zigzag: even steps have text on the left, odd on the right.
  const textLeft = index % 2 === 0;

  // Play entrance + start the Lottie once the card is mostly on screen (one-time).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motion = 'transition-all duration-700 ease-out motion-reduce:transition-none';

  return (
    <div
      ref={wrapperRef}
      className="sticky top-0 h-screen flex items-center justify-center px-4 bg-[linear-gradient(to_bottom,transparent,#0a0a0a_30%)]"
    >
      <div
        ref={cardRef}
        className="w-full max-w-6xl min-h-[75vh] md:min-h-[70vh] px-6 py-10 md:px-14 md:py-12 grid md:grid-cols-2 items-center gap-6 md:gap-12 origin-top will-change-transform text-white"
      >
        {/* Text */}
        <div
          className={`${motion} ${textLeft ? 'md:order-1' : 'md:order-2'} ${
            shown ? 'opacity-100 translate-x-0' : `opacity-0 ${textLeft ? '-translate-x-16' : 'translate-x-16'}`
          }`}
        >
          {/* Number overlaps the title slightly (2px less than the original 40/48px). */}
          <div className="text-[80px] sm:text-[100px] md:text-[140px] font-black text-yellow-700 opacity-30 leading-none select-none mb-1 sm:mb-2 translate-y-[38px] sm:translate-y-[46px] md:-translate-x-5">
            {index + 1}
          </div>
          <h3 className="text-3xl md:text-5xl font-semibold">{title}</h3>
          <p className="py-6 text-sm sm:text-base md:text-xl mt-2 sm:mt-3 text-neutral-400 max-w-lg">{description}</p>
        </div>

        {/* Lottie */}
        <div
          className={`flex justify-center ${textLeft ? 'md:order-2' : 'md:order-1'} ${motion} delay-200 ${
            shown ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="h-[220px] sm:h-[280px] md:h-[360px] aspect-square flex items-center justify-center">
            {shown && animation ? (
              <Lottie animationData={animation} loop className="h-full w-full" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkFlowSection() {
  const [workflowAnimations, setWorkflowAnimations] = useState<unknown[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    loadWorkflowAnimations().then(setWorkflowAnimations);
  }, []);

  // Scroll-linked card motion (read-only, never touches scroll). Values are eased toward their
  // scroll targets every frame, so stepped wheel input still looks fluid:
  // - entering card drifts up into place and fades in,
  // - covered card drifts up, shrinks and fades out, so it never just sits still.
  useEffect(() => {
    let frame = 0;
    const EASE = 0.12;
    const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
    const smooth = steps.map(() => ({ enter: 1, cover: 0 }));

    const tick = () => {
      frame = 0;
      const vh = window.innerHeight;
      const cards = cardRefs.current;
      let moving = false;

      cards.forEach((card, i) => {
        if (!card?.parentElement) return;
        const enterTarget = clamp01(1 - card.parentElement.getBoundingClientRect().top / vh);
        const next = cards[i + 1]?.parentElement;
        const coverTarget = next ? clamp01(1 - next.getBoundingClientRect().top / vh) : 0;

        const s = smooth[i];
        s.enter += (enterTarget - s.enter) * EASE;
        s.cover += (coverTarget - s.cover) * EASE;
        if (Math.abs(enterTarget - s.enter) > 0.001 || Math.abs(coverTarget - s.cover) > 0.001) moving = true;

        const y = (1 - s.enter) * 0.12 * vh - s.cover * 0.08 * vh;
        card.style.transform = `translate3d(0, ${y}px, 0) scale(${1 - 0.06 * s.cover})`;
        card.style.opacity = `${(0.3 + 0.7 * s.enter) * (1 - Math.min(s.cover * 1.4, 1))}`;
      });

      if (moving) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="workflow" className="w-full pt-24 pb-12">
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-10 sm:mb-16 text-center text-white fade-in-on-scroll">
        Jak wygląda praca ze mną?
      </h2>

      <div className="relative">
        {/* Snap anchors: one per step, where that card is fully in place. Separate from the
            sticky cards because snap positions on sticky elements are unreliable. */}
        {steps.map((step, i) => (
          <div
            key={`snap-${step.title}`}
            aria-hidden
            className="absolute left-0 w-px h-screen snap-start snap-always pointer-events-none"
            style={{ top: `${i * 100}vh` }}
          />
        ))}
        {steps.map((step, i) => (
          <WorkflowCard
            key={step.title}
            index={i}
            title={step.title}
            description={step.description}
            animation={workflowAnimations[i]}
            cardRef={(el) => {
              cardRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
