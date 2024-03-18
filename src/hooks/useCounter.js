import { useState } from 'react';

export const useCounter = () => {
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    setCount((prev) => prev + 1);
  };
  const handleSubstract = () => {
    setCount((prev) => Math.max(0, prev - 1));
  };
  const handleReset = () => {
    setCount(0);
  };

  return { count, handleAdd, handleReset, handleSubstract };
};
