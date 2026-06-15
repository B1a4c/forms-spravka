import { ReferenceCallData } from "./types";

export const EDUCATION_LEVELS = [
  "Бакалавриат",
  "Магистратура",
  "Специалитет",
  "Аспирантура",
  "Среднее профессиональное"
];

export const STUDY_FORMS = [
  { value: "заочная", label: "Заочная" },
  { value: "очно-заочная", label: "Очно-заочная (вечерняя)" },
  { value: "очная", label: "Очная" }
];

export const LEAVE_TYPES = [
  { value: "аттестация", label: "Промежуточная аттестация (сессия)" },
  { value: "диплом", label: "Подготовка и защита ВКР (дипломной работы)" },
  { value: "госэкзамены", label: "Сдача итоговых государственных экзаменов" }
];

// Presets removed — users compose forms manually via UI
