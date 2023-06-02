import React from 'react';

export const useWindowResize = () => {
  const [size, setSize] = React.useState<number>(0);

  React.useEffect(() => {
    setSize(window.innerWidth);
    window.addEventListener('resize', () => {
      setSize(window.innerWidth);
    });
  }, []);

  return { size };
};
