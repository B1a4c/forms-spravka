import React, { useState, useEffect } from "react";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { 
  FileText, 
  Download, 
  Printer, 
  Save, 
  RotateCcw, 
  FileCheck, 
  Calendar, 
  GraduationCap, 
  Building, 
  User, 
  Signature, 
  CheckCircle,
  HelpCircle,
  Clock,
  Info
} from "lucide-react";
import { ReferenceCallData, SavedReference, StudyForm, LeaveType, EducationLevel } from "./types";
import { STUDY_FORMS, LEAVE_TYPES, EDUCATION_LEVELS } from "./constants";
import { calculateDays, formatRussianDate } from "./utils/textUtils";
import { DocumentPreview } from "./components/DocumentPreview";
import { HistoryList } from "./components/HistoryList";
import { generateDocx } from "./utils/docxGenerator";

export default function App() {
  // Start with empty form (no initial prefill)
  const emptyForm: ReferenceCallData = {
    studentName: "",
    course: "",
    groupName: "",
    studyForm: "заочная",
    employerName: "",
    universityName: "",
    universityFullTitle: "",
    accreditationInfo: "",
    educationProgram: "",
    educationLevel: "Бакалавриат",
    startDate: "",
    endDate: "",
    leaveType: "аттестация",
    referenceNumber: "",
    issueDate: "",
    signatoryTitle: "",
    signatoryName: "",
    includeConfirmation: false,
    hasSeal: false,
    hasSignature: false,
    confirmationStartDate: "",
    confirmationEndDate: ""
  };

  const [formData, setFormData] = useState<ReferenceCallData>(emptyForm);
  
  // History states
  const [savedReferences, setSavedReferences] = useState<SavedReference[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [collapsedSections, setCollapsedSections] = useState({
    uni: false,
    student: false,
    leave: false,
    signature: false,
  });

  // Authentication state (simple frontend-based)
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("spravka_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load auth user:", e);
    }
  }, []);

  const handleLogin = (username: string) => {
    const u = { username };
    setUser(u);
    try {
      localStorage.setItem("spravka_user", JSON.stringify(u));
    } catch (e) {
      console.error("Failed to store auth user:", e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("spravka_user");
    } catch (e) {
      console.error("Failed to remove auth user:", e);
    }
  };

  const handleShowRegister = () => setShowRegister(true);

  const handleRegister = (username: string) => {
    // После успешной регистрации автоматически логиним
    handleLogin(username);
    setShowRegister(false);
  };

  // Calculate day difference dynamically
  const computedDays = calculateDays(formData.startDate, formData.endDate);

  // Which sections to include in the generated справка
  const [includedSections, setIncludedSections] = useState({
    uni: true,
    student: true,
    leave: true,
    signature: true,
    confirmation: false
  });

  // Load drafts from localStorage on start
  useEffect(() => {
    try {
      const stored = localStorage.getItem("spravka_vyzov_drafts");
      if (stored) {
        setSavedReferences(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local drafts:", e);
    }
  }, []);

  // Update localStorage when drafts modify
  const syncDrafts = (newDrafts: SavedReference[]) => {
    setSavedReferences(newDrafts);
    try {
      localStorage.setItem("spravka_vyzov_drafts", JSON.stringify(newDrafts));
    } catch (e) {
      console.error("Failed to store local drafts:", e);
    }
  };

  // Handle manual field updates
  const updateField = (field: keyof ReferenceCallData, value: any) => {
    const updated = { ...formData, [field]: value };
    
    // Automatically match confirmation dates to leave dates for convenience
    if (field === "startDate") {
      updated.confirmationStartDate = value;
    }
    if (field === "endDate") {
      updated.confirmationEndDate = value;
    }

    setFormData(updated);
  };

  // No presets available — user composes form manually

  // Save current reference to local drafts
  const handleSaveDraft = () => {
    const newDraft: SavedReference = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      data: { ...formData }
    };
    const updated = [newDraft, ...savedReferences];
    syncDrafts(updated);

    // Flash success notification
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Load a draft from history
  const handleLoadDraft = (draft: SavedReference) => {
    setFormData(draft.data);
  };

  // Delete draft from history
  const handleDeleteDraft = (id: string) => {
    const filtered = savedReferences.filter(item => item.id !== id);
    syncDrafts(filtered);
  };

  // Clear or reset form completely
  const handleResetForm = () => {
    setFormData(emptyForm);
  };

  // Export to direct DOCX file stream
  const handleExportDocx = async () => {
    try {
      const blob = await generateDocx(formData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const clientName = formData.studentName 
        ? formData.studentName.replace(/\s+/g, "_").substring(0, 20) 
        : "student";
      
      link.href = url;
      link.download = `Spravka_Vyzov_${clientName}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Docx creation failure:", e);
      alert("Не удалось сгенерировать DOCX. Пожалуйста, проверьте правильность введенных дат.");
    }
  };

  // Export/Print via standard browser print controller
  const handlePrint = () => {
    window.print();
  };

  const toggleSection = (section: "uni" | "student" | "leave" | "signature") => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      <LoginModal open={!user} onLogin={handleLogin} onShowRegister={handleShowRegister} />
      <RegisterModal open={showRegister} onRegister={handleRegister} onClose={() => setShowRegister(false)} />
      
      {/* Visual Header */}
      <header className="no-print bg-white border-b border-slate-200/80 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg select-none shadow-sm">
              C
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-none">
                Справка-Вызов <span className="text-slate-400 font-normal">Automate</span>
              </h1>
              <p className="text-[10px] text-slate-450 mt-1 uppercase tracking-wider font-bold">
                автоматизация реквизитов Минобрнауки РФ (Приказ № 1368)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                    Профиль: {user.username}
                  </span>
                  <button onClick={handleLogout} className="text-xs text-red-500 font-bold hover:text-red-650 active:scale-95 transition-all">Выход</button>
                </>
              ) : (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">Гость</span>
              )}
            </div>
            
            {/* Constructor toggles */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">Конструктор бланка</div>
              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1"><input type="checkbox" checked={includedSections.uni} onChange={(e)=>setIncludedSections(prev=>({...prev, uni: e.target.checked}))}/>Организация</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={includedSections.student} onChange={(e)=>setIncludedSections(prev=>({...prev, student: e.target.checked}))}/>Студент</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={includedSections.leave} onChange={(e)=>setIncludedSections(prev=>({...prev, leave: e.target.checked}))}/>Период</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={includedSections.signature} onChange={(e)=>setIncludedSections(prev=>({...prev, signature: e.target.checked}))}/>Реквизиты</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={includedSections.confirmation} onChange={(e)=>{setIncludedSections(prev=>({...prev, confirmation: e.target.checked})); updateField('includeConfirmation', e.target.checked);}}/>Подтверждение</label>
              </div>
            </div>
            
            
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        
        {/* Sidebar Navigation - Clean Minimalism Style */}
        <aside className="no-print hidden xl:flex xl:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 flex-col justify-between self-start space-y-6 shadow-xs">
          <nav className="space-y-1.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4 px-2">Разделы бланка</div>
            
            <button 
              type="button"
              onClick={() => {
                setCollapsedSections({ uni: false, student: true, leave: true, signature: true });
              }}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all text-left ${!collapsedSections.uni ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 text-[10px] font-bold ${!collapsedSections.uni ? "border-blue-700 bg-blue-100" : "border-slate-350"}`}>1</div>
              <span className="text-xs">Организация</span>
            </button>
            
            <button 
              type="button"
              onClick={() => {
                setCollapsedSections({ uni: true, student: false, leave: true, signature: true });
              }}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all text-left ${!collapsedSections.student ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 text-[10px] font-bold ${!collapsedSections.student ? "border-blue-700 bg-blue-100" : "border-slate-350"}`}>2</div>
              <span className="text-xs">Студент</span>
            </button>
            
            <button 
              type="button"
              onClick={() => {
                setCollapsedSections({ uni: true, student: true, leave: false, signature: true });
              }}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all text-left ${!collapsedSections.leave ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 text-[10px] font-bold ${!collapsedSections.leave ? "border-blue-700 bg-blue-100" : "border-slate-350"}`}>3</div>
              <span className="text-xs">Сессия</span>
            </button>
            
            <button 
              type="button"
              onClick={() => {
                setCollapsedSections({ uni: true, student: true, leave: true, signature: false });
              }}
              className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all text-left ${!collapsedSections.signature ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 text-[10px] font-bold ${!collapsedSections.signature ? "border-blue-700 bg-blue-100" : "border-slate-350"}`}>4</div>
              <span className="text-xs">Реквизиты</span>
            </button>
          </nav>
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5">Проверка</p>
            <div className="flex items-center space-x-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-semibold">Данные валидны</span>
            </div>
          </div>
        </aside>

        {/* Left Hand: Controls & Input form */}
        <section className="no-print col-span-12 lg:col-span-5 xl:col-span-4 space-y-6">

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Редактировать данные
              </span>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-red-500 font-bold hover:text-red-650 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                title="Очистить все поля формы"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Сбросить
              </button>
            </div>

            {/* Form Controls - Accordion suite */}
            <form className="p-5 space-y-4 max-h-[640px] overflow-y-auto custom-scrollbar">
                
                {/* Section 1: University block */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/20">
                  <button
                    type="button"
                    onClick={() => toggleSection("uni")}
                    className="w-full text-left p-3.5 bg-slate-50 border-b border-slate-150 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-650" />
                      1. Образовательная организация
                    </span>
                    <span className="text-slate-405">{collapsedSections.uni ? "+" : "−"}</span>
                  </button>
                  
                  {!collapsedSections.uni && (
                    <div className="p-4 space-y-3.5 bg-white">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Краткое наименование
                        </label>
                        <input
                          type="text"
                          value={formData.universityName}
                          onChange={(e) => updateField("universityName", e.target.value)}
                          placeholder="Пример: МГТУ им. Н.Э. Баумана"
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Полное официальное наименование
                        </label>
                        <textarea
                          value={formData.universityFullTitle}
                          onChange={(e) => updateField("universityFullTitle", e.target.value)}
                          placeholder="Полное наименование по лицензии..."
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[60px] font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Уровень образования
                        </label>
                        <select
                          value={formData.educationLevel}
                          onChange={(e) => updateField("educationLevel", e.target.value as EducationLevel)}
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                        >
                          {EDUCATION_LEVELS.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Код и специальность / Направление подготовки
                        </label>
                        <input
                          type="text"
                          value={formData.educationProgram}
                          onChange={(e) => updateField("educationProgram", e.target.value)}
                          placeholder="Например: 09.03.01 Информатика и ВТ"
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Государственная аккредитация
                        </label>
                        <textarea
                          value={formData.accreditationInfo}
                          onChange={(e) => updateField("accreditationInfo", e.target.value)}
                          placeholder="Сведения о свидетельстве о государственной аккредитации..."
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[50px] font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Student & Employer info */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/20">
                  <button
                    type="button"
                    onClick={() => toggleSection("student")}
                    className="w-full text-left p-3.5 bg-slate-50 border-b border-slate-150 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-650" />
                      2. Студент и Работодатель
                    </span>
                    <span className="text-slate-405">{collapsedSections.student ? "+" : "−"}</span>
                  </button>

                  {!collapsedSections.student && (
                    <div className="p-4 space-y-3.5 bg-white">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            ФИО Студента (в дательном падеже)
                          </label>
                          <span className="text-[9px] text-blue-600 italic font-sans font-semibold">Кому? Дательный падеж</span>
                        </div>
                        <input
                          type="text"
                          value={formData.studentName}
                          onChange={(e) => updateField("studentName", e.target.value)}
                          placeholder="Пример: Иванову Ивану Ивановичу"
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block font-sans">
                          Для бланка нужно указывать адресата, например "Петрову Илье Васильевичу".
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Курс
                          </label>
                          <input
                            type="text"
                            value={formData.course}
                            onChange={(e) => updateField("course", e.target.value)}
                            placeholder="Пример: 3"
                            className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Академ. группа
                          </label>
                          <input
                            type="text"
                            value={formData.groupName}
                            onChange={(e) => updateField("groupName", e.target.value)}
                            placeholder="Пример: ИУ7-61Б"
                            className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Форма обучения
                        </label>
                        <select
                          value={formData.studyForm}
                          onChange={(e) => updateField("studyForm", e.target.value as StudyForm)}
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                        >
                          {STUDY_FORMS.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Наименование работодателя (ООО/АО/ИП)
                        </label>
                        <input
                          type="text"
                          value={formData.employerName}
                          onChange={(e) => updateField("employerName", e.target.value)}
                          placeholder="Пример: ООО 'Яндекс Технологии'"
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Period and type of leave */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/20">
                  <button
                    type="button"
                    onClick={() => toggleSection("leave")}
                    className="w-full text-left p-3.5 bg-slate-50 border-b border-slate-150 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-650" />
                      3. Период отпуска и вид сессии
                    </span>
                    <span className="text-slate-405">{collapsedSections.leave ? "+" : "−"}</span>
                  </button>

                  {!collapsedSections.leave && (
                    <div className="p-4 space-y-3.5 bg-white">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Целевое назначение отпуска
                        </label>
                        <select
                          value={formData.leaveType}
                          onChange={(e) => updateField("leaveType", e.target.value as LeaveType)}
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-sans"
                        >
                          {LEAVE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Дата начала
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => updateField("startDate", e.target.value)}
                            className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Дата окончания
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => updateField("endDate", e.target.value)}
                            className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Day Counter Metrics Row */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-semibold font-sans">Прололжительность:</span>
                        <span className={`font-bold font-mono py-1 px-3 rounded-md text-xs ${computedDays > 0 ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-red-50 text-red-600"}`}>
                          {computedDays > 0 ? `${computedDays} кал. дней` : "Даты не установлены"}
                        </span>
                      </div>

                      {/* Detachable document toggle */}
                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                          <input
                            type="checkbox"
                            checked={formData.includeConfirmation}
                            onChange={(e) => updateField("includeConfirmation", e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-550 w-4 h-4 cursor-pointer"
                          />
                          <span>Включать Справку-подтверждение</span>
                        </label>
                        <p className="text-[10px] text-slate-405 mt-1 pl-6">
                          Нижняя часть бланка (после линии отреза) для подтверждения явки по итогам сессии.
                        </p>
                      </div>

                      {formData.includeConfirmation && (
                        <div className="bg-slate-50/60 p-3 rounded-lg border border-dashed border-slate-250 space-y-2 mt-2">
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Даты подтверждения явки:</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Начало</label>
                              <input
                                type="date"
                                value={formData.confirmationStartDate}
                                onChange={(e) => updateField("confirmationStartDate", e.target.value)}
                                className="w-full text-[10px] p-2 rounded border border-slate-200 bg-white font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Конец</label>
                              <input
                                type="date"
                                value={formData.confirmationEndDate}
                                onChange={(e) => updateField("confirmationEndDate", e.target.value)}
                                className="w-full text-[10px] p-2 rounded border border-slate-200 bg-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Section 4: Signature / Signatory block */}
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/20">
                  <button
                    type="button"
                    onClick={() => toggleSection("signature")}
                    className="w-full text-left p-3.5 bg-slate-50 border-b border-slate-150 flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Signature className="w-4 h-4 text-blue-650" />
                      4. Исходящие реквизиты и Подпись
                    </span>
                    <span className="text-slate-405">{collapsedSections.signature ? "+" : "−"}</span>
                  </button>

                  {!collapsedSections.signature && (
                    <div className="p-4 space-y-3.5 bg-white">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Номер справки
                          </label>
                          <input
                            type="text"
                            value={formData.referenceNumber}
                            onChange={(e) => updateField("referenceNumber", e.target.value)}
                            placeholder="Пример: 154-С/26"
                            className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Дата выдачи
                          </label>
                          <input
                            type="date"
                            value={formData.issueDate}
                            onChange={(e) => updateField("issueDate", e.target.value)}
                            className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Должность подписанта
                        </label>
                        <input
                          type="text"
                          value={formData.signatoryTitle}
                          onChange={(e) => updateField("signatoryTitle", e.target.value)}
                          placeholder="Пример: Декан факультета ИУ"
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          ФИО подписанта (Инициалы, Фамилия)
                        </label>
                        <input
                          type="text"
                          value={formData.signatoryName}
                          onChange={(e) => updateField("signatoryName", e.target.value)}
                          placeholder="Пример: Черников С. А."
                          className="w-full text-xs px-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                        />
                      </div>

                      {/* Stamps and Signature visualization toggles */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                          <input
                            type="checkbox"
                            checked={formData.hasSeal}
                            onChange={(e) => updateField("hasSeal", e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>Синяя печать</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                          <input
                            type="checkbox"
                            checked={formData.hasSignature}
                            onChange={(e) => updateField("hasSignature", e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>Подпись</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

          {/* Persistent Draft History Box - Styled with Clean Minimalism */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                Черновики и Архив ({savedReferences.length})
              </h3>
            </div>
            <HistoryList 
              items={savedReferences}
              onLoad={handleLoadDraft}
              onDelete={handleDeleteDraft}
            />
          </div>

        </section>

        {/* Right Hand Side: Stick Document Preview with floating tools */}
        <section className="col-span-12 lg:col-span-12 xl:col-span-6 space-y-4 lg:sticky lg:top-[76px]">
          
          {/* Quick instructions banner */}
          <div className="no-print bg-slate-105 border border-slate-200 p-3.5 rounded-xl text-slate-705 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-normal font-sans">
              <span className="font-bold text-slate-900">Инструкция по выгрузке PDF:</span> Нажмите кнопку <strong className="text-blue-700 font-bold">«Сохранить / Печать в PDF»</strong>. В открывшемся системном окне принтера выберите <strong className="text-blue-700 font-bold">«Сохранить как PDF»</strong> (размер бумаги <strong className="text-slate-900">A4</strong>, без полей) для получения идеального электронного файла.
            </div>
          </div>

          {/* Action Export Buttons bar - Styled as clean round pills */}
          <div className="no-print bg-white p-4 border border-slate-200 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-930 border border-slate-200 py-2.5 px-4 rounded-full text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                {saveSuccess ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Черновик сохранен
                  </span>
                ) : (
                  "Сохранить черновик"
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={handleExportDocx}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 py-2.5 px-5 rounded-full text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Скачать .docx
              </button>
              
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 px-5 rounded-full text-xs font-bold cursor-pointer transition-all shadow-md hover:shadow-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                Экспорт .pdf / Печать
              </button>
            </div>
          </div>

          {/* Realistic Graphic sheet rendering in clean bright slate backdrop */}
          <div className="w-full flex justify-center p-3 sm:p-5 bg-slate-200 border border-slate-300/70 rounded-xl overflow-x-auto custom-scrollbar shadow-inner select-text">
            <DocumentPreview data={formData} includes={includedSections} />
          </div>

        </section>

      </main>

      {/* Simplified legal disclaimer and clock in page margins */}
      <footer className="no-print mt-auto py-5 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-sans">
          <p>© 2026 Справка-Вызов Автоматизация. Соответствует регламентам РФ и Приказам МинОбрнауки.</p>
          <p className="flex items-center gap-1 font-mono text-[9px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Время формирования справки: UTC {new Date().toISOString().substring(11, 16)}
          </p>
        </div>
      </footer>
    </div>
  );
}
