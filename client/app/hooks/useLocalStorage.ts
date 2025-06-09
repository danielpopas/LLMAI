// client/app/hooks/useLocalStorage.ts
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Состояние для хранения значения
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Эффект для гидратации
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Эффект для загрузки значения из localStorage после гидратации
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Ошибка загрузки из localStorage для ключа "${key}":`, error);
    }
  }, [key, isHydrated]);

  // Функция для установки значения
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Позволяет передавать функцию как в useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Сохраняем в состоянии
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage только после гидратации
      if (isHydrated) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Ошибка сохранения в localStorage для ключа "${key}":`, error);
    }
  };

  // Функция для удаления значения
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (isHydrated) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Ошибка удаления из localStorage для ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue, isHydrated] as const;
}
