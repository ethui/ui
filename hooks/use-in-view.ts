// Initial draft from v0:
// https://v0.dev/chat/load-more-on-scroll-K3f4RYuezLB

import { useState, useEffect } from "react";

interface UseInViewProps {
  ref: React.RefObject<Element | null>;
  parent: React.RefObject<Element | null>;
}

export function useInView({ ref, parent }: UseInViewProps) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        root: parent.current,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, parent.current]);

  return inView;
}
