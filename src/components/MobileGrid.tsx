import React from 'react';
import { Method } from '../lib/supabase';
import Logo from './Logo';

interface MobileGridProps {
  methods: Method[];
  onMethodClick: (method: Method) => void;
}

const MobileGrid: React.FC<MobileGridProps> = ({ methods, onMethodClick }) => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      {/* 移动端标题 - 使用统一的SVG */}
      <div className="text-center mb-6">
        <Logo size={96} variant="unified" />
      </div>

      {/* 方法网格 - 增大卡片并优化布局 */}
      <div className="grid grid-cols-2 gap-5 max-w-md mx-auto">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 touch-manipulation"
            onClick={() => onMethodClick(method)}
          >
            <div 
              className="w-14 h-14 rounded-xl mb-4 mx-auto flex items-center justify-center shadow-md"
              style={{ backgroundColor: `${method.color}20` }}
            >
              <img 
                src={method.icon_url} 
                alt={method.name}
                className="w-9 h-9 rounded-lg object-cover"
              />
            </div>
            <div
              className="text-center font-bold text-base leading-tight"
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