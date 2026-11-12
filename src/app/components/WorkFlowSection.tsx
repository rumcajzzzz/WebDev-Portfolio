'use client';

import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { ChevronDown } from 'lucide-react';

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

const introHeight = 600;
const stepHeight = 600;
const lastStepHeight = 1800;
const totalSteps = steps.length;
const sectionHeight = introHeight + stepHeight * (totalSteps - 1) + lastStepHeight;
const MIN_STEP_MS = 1200;
const SEEN_KEY = 'workflowSeen';

export default function WorkFlowSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  // Step the scroll position points at; stepIndex (displayed) catches up to it.
  const [targetIndex, setTargetIndex] = useState(-1);
  // First pass: each step stays visible at least MIN_STEP_MS, none skipped. After that, follow scroll.
  const [seen, setSeen] = useState(false);
  const shownAtRef = useRef(0);
  const [workflowAnimations, setWorkflowAnimations] = useState<unknown[]>([]);

  useEffect(() => {
    loadWorkflowAnimations().then(setWorkflowAnimations);
    if (sessionStorage.getItem(SEEN_KEY)) setSeen(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const relativeScroll = window.scrollY - sectionRef.current.offsetTop;

      if (relativeScroll < introHeight) {
        setTargetIndex(-1);
      } else if (relativeScroll < introHeight + stepHeight * (totalSteps - 1)) {
        setTargetIndex(Math.floor((relativeScroll - introHeight) / stepHeight));
      } else {
        setTargetIndex(totalSteps - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    shownAtRef.current = Date.now();
    if (stepIndex === totalSteps - 1 && !seen) {
      setSeen(true);
      sessionStorage.setItem(SEEN_KEY, '1');
    }
  }, [stepIndex, seen]);

  useEffect(() => {
    if (targetIndex === stepIndex) return;
    if (seen || targetIndex < stepIndex || stepIndex === -1) {
      setStepIndex(seen || targetIndex < stepIndex ? targetIndex : 0);
      return;
    }
    const remaining = MIN_STEP_MS - (Date.now() - shownAtRef.current);
    const timer = setTimeout(() => setStepIndex((i) => i + 1), Math.max(0, remaining));
    return () => clearTimeout(timer);
  }, [targetIndex, stepIndex, seen]);

  return (
    <div style={{ height: `${sectionHeight}px` }} ref={sectionRef}>
      <div className="sticky top-0 h-screen w-full bg-black px-2 sm:px-4 md:px-6 flex flex-col justify-center items-center">
        <h2
          className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-10 sm:mb-16 text-center text-white transition-opacity duration-700 ${
            stepIndex === -1 ? 'opacity-100' : 'opacity-50'
          }`}
        >
          Jak wygląda praca ze mną?
        </h2>

        <div className="w-full max-w-5xl relative h-[350px] sm:h-[400px] md:h-[450px]">
          {steps.map((step, i) => {
            const isActive = i === stepIndex;
            return (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-4 sm:gap-6 md:gap-2 transition-all duration-700 text-white ${
                  isActive
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : 'opacity-0 -translate-x-20 pointer-events-none'
                }`}
              >

                <div className="w-full md:w-1/2 px-2 sm:px-4 md:px-8 text-center md:text-left">
                  <div className="text-[80px] sm:text-[100px] md:text-[120px] font-black text-yellow-700 opacity-30 leading-none select-none mb-1 sm:mb-2 md:translate-y-10 md:-translate-x-5 sm:translate-y-12 sm:-translate-x-38">
                    {i + 1}
                  </div>
                  <h3 className="text-3xl font-semibold">{step.title}</h3>
                  <p className="mx-32 py-6 text-sm sm:text-md md:text-lg mt-2 sm:mt-3 md:mx-0 text-neutral-400">{step.description}</p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center md:justify-end px-2 sm:px-4 md:px-8 ">
                  <div className="bg-[#0a0a0a] rounded-lg p-2 sm:p-4 shadow-md lottie-style max-h-[180px] sm:max-h-[220px]">
                    {workflowAnimations[i] ? (
                      <Lottie
                        key={isActive ? `active-${i}` : `inactive-${i}`}
                        animationData={workflowAnimations[i]}
                        loop={true}
                        style={{ maxHeight: '180px', width: 'auto' }}
                      />
                    ) : (
                      <div className="h-[180px] w-[180px]" />
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {stepIndex === steps.length - 1 && (
          <div className="absolute bottom-10 flex justify-center w-full animate-bounce">
            <button
              onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
              className="text-white text-3xl opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Przejdź dalej"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
