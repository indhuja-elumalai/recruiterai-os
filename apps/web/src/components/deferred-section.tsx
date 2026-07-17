import { type ReactNode, useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  id?: string;
  minHeight?: string;
}

export function DeferredSection({ children, id, minHeight = "720px" }: DeferredSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div id={id} ref={containerRef} style={shouldRender ? undefined : { minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
}
