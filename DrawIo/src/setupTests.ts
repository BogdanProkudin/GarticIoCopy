import "@testing-library/jest-dom/extend-expect";
import ReactModal from "react-modal";

// Инициализация ReactModal для тестов
ReactModal.setAppElement("*"); // Используйте '*' для обхода проблемы с корневым элементом в тестах
