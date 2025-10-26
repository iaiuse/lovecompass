import React from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Method, Case, CaseData } from '../lib/supabase';

interface CaseSelectorProps {
  selectedMethod: Method | null;
  cases: Case[];
  onCaseClick: (caseData: CaseData) => void;
  onAddCase: () => void;
  onEditCase: (caseItem: Case, e: React.MouseEvent) => void;
  onDeleteCase: (caseItem: Case, e: React.MouseEvent) => void;
  onClose: () => void;
}

const CaseSelector: React.FC<CaseSelectorProps> = ({
  selectedMethod,
  cases,
  onCaseClick,
  onAddCase,
  onEditCase,
  onDeleteCase,
  onClose
}) => {
  if (!selectedMethod) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all duration-400 backdrop-blur-sm">
      <div className="relative transform transition-transform duration-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full border-none text-2xl text-gray-600 cursor-pointer transition-all duration-200 z-50 flex items-center justify-center hover:rotate-90"
        >
          ×
        </button>
        <div 
          className="bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-3xl shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center border-b border-slate-200/50 pb-4 lg:pb-6 mb-4 lg:mb-6">
            <div 
              className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mr-3 lg:mr-5 flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ backgroundColor: `${selectedMethod.color}20` }}
            >
              <img 
                src={selectedMethod.icon_url} 
                alt={selectedMethod.name}
                className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl object-cover"
              />
            </div>
            <div>
              <h2
                className="text-xl lg:text-3xl font-black m-0 mb-1"
                style={{ color: selectedMethod.color }}
              >
                {selectedMethod.name}
              </h2>
              <p className="text-slate-500 text-xs lg:text-sm font-medium">探索相关案例</p>
            </div>
          </div>
          
          <div className="grid gap-3 lg:gap-4">
            {/* 添加新案例按钮 */}
            <div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center group touch-manipulation"
              onClick={onAddCase}
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mr-2 lg:mr-3 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm lg:text-base text-blue-700 font-semibold">添加新案例</span>
            </div>
            
            {cases.length > 0 ? (
              cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="bg-white/60 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/50 hover:bg-white/80 relative group touch-manipulation"
                  onClick={() => onCaseClick(caseItem.card_data)}
                >
                  {/* 操作按钮 */}
                  <div className="absolute top-3 right-3 lg:top-4 lg:right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0 flex space-x-1 lg:space-x-2">
                    <button
                      onClick={(e) => onEditCase(caseItem, e)}
                      className="w-7 h-7 lg:w-9 lg:h-9 bg-blue-100/80 hover:bg-blue-200 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm touch-manipulation"
                      title="编辑案例"
                    >
                      <Edit className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={(e) => onDeleteCase(caseItem, e)}
                      className="w-7 h-7 lg:w-9 lg:h-9 bg-red-100/80 hover:bg-red-200 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 relative z-20 backdrop-blur-sm touch-manipulation"
                      title="删除案例"
                    >
                      <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3 text-slate-800 pr-16 lg:pr-20">
                    {caseItem.name}的故事:
                  </h3>
                  <p className="m-0 leading-relaxed text-sm lg:text-base text-slate-600 font-medium">
                    {caseItem.summary}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 lg:py-8">
                <p className="text-sm lg:text-base text-slate-500 font-medium">
                  这是一个很好的方法！我们一起在生活中寻找可以用上它的机会吧！
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseSelector;
