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

export const PRESETS: Record<string, ReferenceCallData> = {
  hiik: {
    studentName: "Харченко Олегу Игоревичу",
    course: "3",
    groupName: "ИСТ-31",
    studyForm: "заочная",
    employerName: "Филиал ФГУП 'РТРС' - Хабаровский КРТПЦ",
    universityName: "ХИИК СибГУТИ",
    universityFullTitle: "Хабаровский институт инфокоммуникаций (филиал) федерального государственного бюджетного образовательного учреждения высшего образования «Сибирский государственный университет телекоммуникаций и информатики»",
    accreditationInfo: "Свидетельство о государственной аккредитации № 3159 от 10 июня 2019 г., выданное Рособрнадзором бессрочно.",
    educationProgram: "11.03.02 Инфокоммуникационные технологии и системы связи",
    educationLevel: "Бакалавриат",
    startDate: "2026-06-05",
    endDate: "2026-06-29",
    leaveType: "аттестация",
    referenceNumber: "ХИИК-085/26",
    issueDate: "2026-05-21",
    signatoryTitle: "Директор ХИИК (филиал)'СибГУТИ'",
    signatoryName: "Данилов Р.М.",
    includeConfirmation: true,
    hasSeal: true,
    hasSignature: true,
    confirmationStartDate: "2026-06-05",
    confirmationEndDate: "2026-06-29"
  },
  custom: {
    studentName: "[ФИО Студента в дательном падеже]",
    course: "1",
    groupName: "",
    studyForm: "заочная",
    employerName: "[Организация работодателя]",
    universityName: "[Университет]",
    universityFullTitle: "Федеральное государственное бюджетное образовательное учреждение высшего образования '[Полное Название Университета]'",
    accreditationInfo: "Свидетельство о государственной аккредитации № [Номер] от [Дата], выданное Рособрнадзором.",
    educationProgram: "[Код и Название Специальности]",
    educationLevel: "Бакалавриат",
    startDate: "2026-06-01",
    endDate: "2026-06-20",
    leaveType: "аттестация",
    referenceNumber: "[Номер]",
    issueDate: "2026-05-21",
    signatoryTitle: "[Должность подписанта]",
    signatoryName: "[ФИО Подписанта]",
    includeConfirmation: true,
    hasSeal: true,
    hasSignature: true,
    confirmationStartDate: "2026-06-01",
    confirmationEndDate: "2026-06-20"
  }
};
