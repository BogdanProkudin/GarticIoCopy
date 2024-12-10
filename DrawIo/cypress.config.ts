import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Здесь можно настроить Node события, если необходимо
    },
    video: true, // Включает запись видео
    videoCompression: 32, // Сжимает видео (от 0 до 100, 32 - по умолчанию)
    viewportWidth: 1280, // Ширина экрана для тестов
    viewportHeight: 720, // Высота экрана для тестов
  },
});
