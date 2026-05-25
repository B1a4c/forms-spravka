import React from "react";
import { FileText, Trash2, Calendar, Award, RotateCcw } from "lucide-react";
import { SavedReference } from "../types";
import { formatRussianDate } from "../utils/textUtils";

interface HistoryListProps {
  items: SavedReference[];
  onLoad: (item: SavedReference) => void;
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, onLoad, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h4 className="text-xs font-semibold text-slate-500 font-sans">
          История документов пуста
        </h4>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Заполните справку и нажмите «Сохранить черновик»
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
      {items.map((item) => {
        const studName = item.data.studentName || "Безымянный студент";
        const uni = item.data.universityName || "Университет не указан";
        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleString("ru-RU", { 
          day: "numeric", 
          month: "short", 
          hour: "2-digit", 
          minute: "2-digit" 
        }) : "";

        return (
          <div 
            key={item.id}
            className="group flex items-center justify-between gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-xs transition-all duration-200"
          >
            <button
              onClick={() => onLoad(item)}
              className="flex-1 text-left cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {studName}
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100/50 px-1.5 py-0.5 rounded-md font-medium">
                  {item.data.course} курс
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5 font-sans">
                {uni} • {item.data.employerName || "организация не указана"}
              </div>
              <div className="text-[9px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <Calendar className="w-3 h-3 text-slate-300" />
                <span>Создана {dateStr}</span>
              </div>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
              title="Удалить черновик"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
