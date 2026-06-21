import { useEffect, useState } from "react";

const useAnimacionEntrada = () => {
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimar(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return animar;
};

export default useAnimacionEntrada;
