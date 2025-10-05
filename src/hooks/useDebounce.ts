import { useEffect, useState } from 'react';

/**
 * Hook para debounce de valores
 * Útil para pesquisas em tempo real
 * 
 * @param value - Valor a ser "debounced"
 * @param delay - Delay em milissegundos (default: 250ms)
 */
export function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Criar timeout para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar timeout se o valor mudar antes do delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
