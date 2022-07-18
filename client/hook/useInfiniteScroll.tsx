import { useState, useEffect } from "react";

const useInfiniteScroll = (targetEl) => {
  const [intersecting, setIntersecting] = useState(false);

  const observer = new IntersectionObserver((entries) =>
    setIntersecting(entries.some((entry) => entry.isIntersecting))
  );

  useEffect(() => {
    if (targetEl.current) observer.observe(targetEl.current);

    return () => {
      observer.disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
