import React from "react";
import { ReferenceCallData } from "../types";
import { 
  calculateDays, 
  formatRussianDate, 
  getDaysPluralWords, 
  getLaborCodeArticle, 
  getLeaveTypeClause 
} from "../utils/textUtils";

interface DocumentPreviewProps {
  data: ReferenceCallData;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  const daysNum = calculateDays(data.startDate, data.endDate);
  const daysFormatted = getDaysPluralWords(daysNum);
  const startDateFormatted = formatRussianDate(data.startDate);
  const endDateFormatted = formatRussianDate(data.endDate);
  const issueDateFormatted = formatRussianDate(data.issueDate);
  const articleStr = getLaborCodeArticle(data.educationLevel);
  const leaveClause = getLeaveTypeClause(data.leaveType);

  // Fallbacks for empty fields to prevent broken text
  const uFullTitle = data.universityFullTitle || "[Полное наименование образовательной организации]";
  const student = data.studentName || "[ФИО Студента в дательном падеже, например: Иванову Ивану Ивановичу]";
  const courseText = data.course ? `${data.course}-м` : "[Курс]-м";
  const groupText = data.groupName ? ` (группа ${data.groupName})` : "";
  const programText = data.educationProgram || "[Код и направление подготовки]";
  const employer = data.employerName || "[Наименование работодателя]";
  const titleSign = data.signatoryTitle || "[Должность]";
  const nameSign = data.signatoryName || "[ФИО]";
  const refNum = data.referenceNumber || "[Номер]";

  return (
    <div id="reference-call-print-area" className="print-container w-full">
      {/* Printable sheet element */}
      <div 
        className="print-sheet mx-auto bg-white text-black font-serif shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-200 p-8 sm:p-12 md:p-16 w-full max-w-[800px] min-h-[1100px] flex flex-col justify-between"
        style={{ fontFamily: "'Times New Roman', serif" }}
      >
        {/* Document Body */}
        <div>
          {/* Header reference standard metadata */}
          <div className="text-right text-[10px] leading-tight text-slate-500 italic mb-6">
            Приложение № 1<br />
            к приказу Министерства образования и науки<br />
            Российской Федерации<br />
            от 18 декабря 2013 г. № 1368
          </div>

          {/* Letterhead Top block */}
          <div className="border-b border-slate-300 pb-4 mb-6">
            <div className="text-xs font-bold leading-tight mb-2 tracking-wide uppercase">
              {uFullTitle}
            </div>
            <div className="text-[11px] leading-relaxed text-slate-705">
              <p className="font-semibold text-slate-900">Исх. № {refNum}</p>
              <p>от {issueDateFormatted ? issueDateFormatted : "[Дата выдачи]"}</p>
              <div className="mt-2 text-[10px] italic leading-normal border-t border-slate-100 pt-1">
                {data.accreditationInfo || "[Сведения об аккредитации]"}
              </div>
            </div>
          </div>

          {/* Title of Document */}
          <div className="text-center my-6 md:my-8">
            <h1 className="text-xl font-bold tracking-widest leading-none mb-1">
              СПРАВКА-ВЫЗОВ
            </h1>
            <p className="text-sm font-bold tracking-tight">
              серия ________ № {refNum}
            </p>
          </div>

          {/* Document Content text */}
          <div className="text-sm md:text-base leading-loose text-justify space-y-4 indent-8">
            <p>
              Выдана{" "}
              <span className="font-bold border-b border-slate-300 px-1 text-slate-905">
                {student}
              </span>
              в том, что он (она) успешно обучается на{" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {courseText}
              </span>{" "}
              курсе по{" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {data.studyForm} форме
              </span>{" "}
              обучения{groupText} в{" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {data.universityName || uFullTitle}
              </span>{" "}
              по образовательной программе уровня{" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {data.educationLevel}
              </span>
              , направление подготовки (специальность){" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {programText}
              </span>
              .
            </p>
            
            <p>
              На основании{" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {articleStr}
              </span>{" "}
              Трудового кодекса Российской Федерации предоставляется
              дополнительный отпуск с сохранением среднего заработка (учебный
              отпуск) для{" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {leaveClause}
              </span>{" "}
              продолжительностью{" "}
              <span className="font-bold border-b border-slate-300 px-1">
                {daysFormatted}
              </span>{" "}
              с{" "}
              <span className="font-bold border-b border-slate-300 px-1 text-teal-900">
                {startDateFormatted ? startDateFormatted : "[начальная дата]"}
              </span>{" "}
              по{" "}
              <span className="font-bold border-b border-slate-300 px-1 text-teal-900">
                {endDateFormatted ? endDateFormatted : "[конечная дата]"}
              </span>
              .
            </p>
          </div>

          {/* Primary Signatory Section */}
          <div className="mt-12 grid grid-cols-12 gap-2 relative">
            <div className="col-span-5 text-sm font-semibold text-slate-800">
              {titleSign}
            </div>
            
            <div className="col-span-3 border-b border-slate-400 relative h-8 flex items-end justify-center">
              {/* Optional Facsimile Signature */}
              {data.hasSignature && (
                <div className="absolute -bottom-1 left-4 print-sig pointer-events-none select-none z-10 transition-transform duration-300 hover:scale-110">
                  <svg width="120" height="42" viewBox="0 0 120 42">
                    <path 
                      d="M12,28 Q22,4 32,28 T50,15 T74,18 T90,26" 
                      fill="none" 
                      stroke="#1e3a8a" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M24,14 L42,32" 
                      fill="none" 
                      stroke="#1e3a8a" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M72,12 L85,34" 
                      fill="none" 
                      stroke="#1e3a8a" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M15,22 C35,38 75,32 95,20 C105,12 88,32 78,35" 
                      fill="none" 
                      stroke="#2563eb" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </div>
              )}
              <span className="text-xs text-slate-400 italic font-sans">(подпись)</span>
            </div>
            
            <div className="col-span-4 pl-4 text-sm font-bold text-slate-900 flex items-end">
              {nameSign}
            </div>

            {/* Optional Blue Seal (Stamp) */}
            {data.hasSeal && (
              <div className="absolute left-[30%] -top-12 print-seal pointer-events-none select-none z-10 transition-transform duration-300 hover:rotate-6">
                <svg width="110" height="110" viewBox="0 0 100 100" className="opacity-80">
                  <defs>
                    <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                    <path id="circlePathInner" d="M 50, 50 m -24, 0 a 24,24 0 1,1 48,0 a 24,24 0 1,1 -48,0" />
                  </defs>
                  
                  {/* Outer double borders */}
                  <circle cx="50" cy="50" r="43" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="1.5,1.5" />
                  <circle cx="50" cy="50" r="41" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  
                  {/* Curved educational text */}
                  <text fill="#2563eb" fontSize="4" fontWeight="bold" letterSpacing="0.2">
                    <textPath href="#circlePath">
                      МИН-ОБР-НАУКИ РФ * {data.universityName ? data.universityName.toUpperCase() : "ОБРАЗОВАТЕЛЬНАЯ ОРГАНИЗАЦИЯ"} *
                    </textPath>
                  </text>
                  
                  {/* Curved Inner category tag */}
                  <text fill="#2563eb" fontSize="4.5" fontWeight="bold">
                    <textPath href="#circlePathInner" startOffset="50%" textAnchor="middle">
                      ДЛЯ ДОКУМЕНТОВ
                    </textPath>
                  </text>
                  
                  {/* Internal seal graphics */}
                  <path d="M 50 36 L 52.5 41.5 L 58.5 41.5 L 53.5 44.5 L 55.5 50.5 L 50 47.5 L 44.5 50.5 L 46.5 44.5 L 41.5 41.5 L 47.5 41.5 Z" fill="#2563eb" />
                  
                  {/* Inner single ring */}
                  <circle cx="50" cy="50" r="28" fill="none" stroke="#2563eb" strokeWidth="0.8" />
                </svg>
              </div>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-2 font-semibold">М.П.</div>
        </div>

        {/* Detachable Confirmation Certificate (Справка-подтверждение) */}
        {data.includeConfirmation && (
          <div className="mt-8 border-t border-dashed border-slate-400 pt-6">
            <div className="text-center text-[11px] uppercase tracking-wider text-slate-400 no-print mb-4 select-none">
              ✂------------------------- Линия отреза -------------------------✂
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold tracking-widest leading-none mb-1">
                СПРАВКА-ПОДТВЕРЖДЕНИЕ
              </h2>
              <p className="text-xs text-slate-500">
                (выдается учебным заведением по окончании сессионного периода)
              </p>
            </div>

            <div className="text-sm leading-relaxed text-justify space-y-4 indent-8">
              <p>
                Выдана работодателю:{" "}
                <span className="font-bold border-b border-slate-300 px-1">
                  {employer}
                </span>
                , в том, что студент{" "}
                <span className="font-bold border-b border-slate-300 px-1">
                  {student}
                </span>{" "}
                действительно находился (находилась) в образовательной организации{" "}
                <span className="font-bold border-b border-slate-300 px-1">
                  {data.universityName || uFullTitle}
                </span>{" "}
                в период с{" "}
                <span className="font-bold border-b border-slate-300 px-1 text-teal-900">
                  {data.confirmationStartDate ? formatRussianDate(data.confirmationStartDate) : "[дата начала]"}
                </span>{" "}
                по{" "}
                <span className="font-bold border-b border-slate-300 px-1 text-teal-900">
                  {data.confirmationEndDate ? formatRussianDate(data.confirmationEndDate) : "[дата окончания]"}
                </span>{" "}
                в связи с прохождением учебного плана в полном объёме.
              </p>
            </div>

            {/* Confirmation Signatures block */}
            <div className="mt-10 grid grid-cols-12 gap-2 relative">
              <div className="col-span-5 text-sm font-semibold text-slate-800">
                {titleSign}
              </div>
              
              <div className="col-span-3 border-b border-slate-400 relative h-8 flex items-end justify-center">
                {data.hasSignature && (
                  <div className="absolute -bottom-1 left-4 print-sig pointer-events-none select-none z-10 transition-transform duration-300 hover:scale-105">
                    <svg width="120" height="42" viewBox="0 0 120 42">
                      <path 
                        d="M10,25 Q20,6 30,25 T48,12 T70,15 T85,22" 
                        fill="none" 
                        stroke="#1e3a8a" 
                        strokeWidth="1.8" 
                        strokeLinecap="round" 
                      />
                      <path 
                        d="M12,24 C32,35 68,30 92,18 C100,10 82,30 74,33" 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="1.2" 
                        strokeLinecap="round" 
                      />
                    </svg>
                  </div>
                )}
                <span className="text-xs text-slate-400 italic font-sans">(подпись)</span>
              </div>
              
              <div className="col-span-4 pl-4 text-sm font-bold text-slate-900 flex items-end">
                {nameSign}
              </div>

              {/* Confirmation Seal */}
              {data.hasSeal && (
                <div className="absolute left-[36%] -top-12 print-seal pointer-events-none select-none z-10">
                  <svg width="95" height="95" viewBox="0 0 100 100" className="opacity-75">
                    <circle cx="50" cy="50" r="41" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="1,1" />
                    <circle cx="50" cy="50" r="39" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="26" fill="none" stroke="#2563eb" strokeWidth="0.8" />
                    <path d="M 50 38 L 51.5 42 L 56 42 L 52.5 44 L 54 48 L 50 46 L 46 48 L 47.5 44 L 44 42 L 48.5 42 Z" fill="#2563eb" />
                    <text fill="#2563eb" fontSize="5.5" fontWeight="bold" textAnchor="middle">
                      <textPath href="#circlePathInner" startOffset="50%">
                        ПЕЧАТЬ
                      </textPath>
                    </text>
                  </svg>
                </div>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-2 font-semibold">М.П.</div>
          </div>
        )}
      </div>
    </div>
  );
};
