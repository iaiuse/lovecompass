import React from 'react';
import { Method } from '../lib/supabase';
import WheelSector from './WheelSector';

interface ResponsiveWheelProps {
  methods: Method[];
  onSectorClick: (method: Method) => void;
}

const ResponsiveWheel: React.FC<ResponsiveWheelProps> = ({ methods, onSectorClick }) => {
  // 根据屏幕尺寸计算半径
  const getRadius = () => {
    if (typeof window === 'undefined') return 90;
    const width = window.innerWidth;
    if (width < 640) return 90;   // 移动端
    if (width < 768) return 200;  // 平板
    if (width < 1024) return 250; // 桌面
    if (width < 1280) return 300; // 大屏
    return 350; // 超大屏
  };

  const radius = getRadius();

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-80px)]">
      {/* Main Wheel Container */}
      <div className="relative flex items-center justify-center w-full">
        {/* Center Hub */}
        <div className="wheel-center rounded-full bg-white/90 backdrop-blur-sm border-2 lg:border-4 border-white/50 shadow-2xl flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 z-10 relative">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 leading-tight text-center">
            我能做什么?
          </h2>
          <p className="text-xs md:text-xs lg:text-sm text-slate-600 text-center leading-relaxed font-medium hidden sm:block">
            你遇到问题了吗?<br />试试以下的2-3个方法
          </p>
        </div>

        {/* Wheel Sectors */}
        {methods.map((method, index) => {
          const angleStep = 360 / methods.length;
          const angle = angleStep * index - 90; // 从顶部开始
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          return (
            <div
              key={method.id}
              className="wheel-sector absolute rounded-xl lg:rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-white/50 lg:border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:z-20 hover:-translate-y-1 group touch-manipulation"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
              onClick={() => onSectorClick(method)}
            >
              <div 
                className="rounded-lg lg:rounded-xl mb-1 sm:mb-1.5 md:mb-2 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${method.color}20` }}
              >
                <img 
                  src={method.icon_url} 
                  alt={method.name}
                  className="rounded-md lg:rounded-lg object-cover"
                />
              </div>
              <div
                className="font-bold text-center leading-tight transition-colors duration-300 px-1"
                style={{ color: method.color }}
              >
                {method.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsiveWheel;