import React from 'react';
import { Method } from '../lib/supabase';

interface MobileGridProps {
  methods: Method[];
  onMethodClick: (method: Method) => void;
}

const MobileGrid: React.FC<MobileGridProps> = ({ methods, onMethodClick }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* 移动端标题 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
          <span className="text-white font-bold text-2xl">育</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          我能做什么？
        </h2>
        <p className="text-slate-600 text-sm">
          你遇到问题了吗？<br />
          试试以下的2-3个方法
        </p>
      </div>

      {/* 方法网格 */}
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 touch-manipulation"
            onClick={() => onMethodClick(method)}
          >
            <div 
              className="w-12 h-12 rounded-xl mb-3 mx-auto flex items-center justify-center shadow-md"
              style={{ backgroundColor: `${method.color}20` }}
            >
              <img 
                src={method.icon_url} 
                alt={method.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
            </div>
            <div
              className="text-center font-bold text-sm leading-tight"
              style={{ color: method.color }}
            >
              {method.name}
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="text-center mt-8 px-4">
        <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/30">
          <span className="text-xs text-slate-600 font-medium">
            点击选择适合的方法
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileGrid;