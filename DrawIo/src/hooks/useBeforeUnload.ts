import { useEffect, useCallback, useRef } from 'react';
import { MESSAGES } from '../constants/messages';

/**
 * Хук для обработки события beforeunload (перезагрузка/закрытие страницы)
 * @param onBeforeUnload - callback, который будет вызван при подтверждении выхода
 * @returns void
 */
export const useBeforeUnload = (onBeforeUnload: () => Promise<void>) => {
  const shouldLeave = useRef(false);

  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (!shouldLeave.current) {
      // Показываем стандартное сообщение подтверждения
      event.preventDefault();
      event.returnValue = MESSAGES.LEAVE_PAGE_CONFIRMATION;
      return MESSAGES.LEAVE_PAGE_CONFIRMATION;
    }
  }, []);

  const handleVisibilityChange = useCallback(async () => {
    // Проверяем, действительно ли страница выгружается
    if (document.visibilityState === 'hidden' && shouldLeave.current) {
      try {
        await onBeforeUnload();
      } catch (error) {
        console.error('Error during page unload:', error);
      }
    }
  }, [onBeforeUnload]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleBeforeUnload, handleVisibilityChange]);

  // Функция для установки флага выхода
  const confirmLeave = () => {
    shouldLeave.current = true;
  };

  return { confirmLeave };
};
