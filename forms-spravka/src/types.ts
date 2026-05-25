export type StudyForm = "очная" | "заочная" | "очно-заочная";
export type LeaveType = "аттестация" | "диплом" | "госэкзамены";
export type EducationLevel = 
  | "Бакалавриат" 
  | "Магистратура" 
  | "Специалитет" 
  | "Аспирантура" 
  | "Среднее профессиональное";

export interface ReferenceCallData {
  studentName: string;         // e.g. "Иванову Ивану Ивановичу"
  course: string;              // e.g. "3"
  groupName: string;           // e.g. "ИУ7-61Б"
  studyForm: StudyForm;        // e.g. "заочная"
  employerName: string;        // e.g. "ООО 'Яндекс'"
  universityName: string;      // e.g. "МГТУ им. Н.Э. Баумана"
  universityFullTitle: string; // e.g. "Федеральное государственное бюджетное образовательное учреждение высшего образования 'Московский государственный технический университет имени Н.Э. Баумана (национальный исследовательский университет)'"
  accreditationInfo: string;   // e.g. "Свидетельство о государственной аккредитации № 3245 от 12.04.2020 г., выданное Рособрнадзором на срок до 12.04.2026 г."
  educationProgram: string;    // e.g. "09.03.01 Информатика и вычислительная техника"
  educationLevel: EducationLevel;
  startDate: string;           // YYYY-MM-DD
  endDate: string;             // YYYY-MM-DD
  leaveType: LeaveType;        // e.g. "аттестация"
  referenceNumber: string;     // e.g. "124-У/26"
  issueDate: string;           // YYYY-MM-DD
  signatoryTitle: string;      // e.g. "Декан факультета"
  signatoryName: string;       // e.g. "Черников С. А."
  includeConfirmation: boolean;// Whether to show/generate the detachable confirmation letter
  hasSeal: boolean;            // Show visual official seal
  hasSignature: boolean;       // Show visual signature
  
  // Detachable confirmation part
  confirmationStartDate: string;
  confirmationEndDate: string;
}

export interface SavedReference {
  id: string;
  createdAt: string;
  data: ReferenceCallData;
}
