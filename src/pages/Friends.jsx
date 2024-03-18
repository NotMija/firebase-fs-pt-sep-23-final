import { Outlet } from "react-router-dom";
import { useCounter } from "../hooks/useCounter";

export const Friends = () => {
  const { count, handleAdd, handleSubstract, handleReset } = useCounter();

  return (
    <div>
      <h1>LISTA DE AMIGOS</h1>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleSubstract}>Substract</button>
      <button onClick={handleReset}>Reset</button>
      <Outlet />
    </div>
  );
};