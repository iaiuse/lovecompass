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
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-35 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-1/3 right-5 w-14 h-14 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full opacity-30 animate-bounce"></div>
      </div>

      {/* Main Wheel Container */}
      <div className="relative flex items-center justify-center w-full z-10">
        {/* Center Hub */}
        <div className="wheel-center rounded-full bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md border-2 lg:border-4 border-white/60 shadow-2xl flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 lg:p-7 z-10 relative transform hover:scale-105 transition-transform duration-300">
          {/* 中心装饰环 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-indigo-400/20 animate-spin-slow"></div>
          
          <div className="relative z-10">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 leading-tight text-center">
              ✨ 我能做什么?
            </h2>
            <p className="text-xs md:text-sm lg:text-base text-slate-600 text-center leading-relaxed font-medium hidden sm:block">
              你遇到问题了吗?<br />
              <span className="text-pink-600 font-semibold">试试以下的2-3个方法</span>
            </p>
            
            {/* 装饰性小图标 */}
            <div className="flex justify-center space-x-1 mt-2">
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
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
              className="wheel-sector absolute rounded-2xl lg:rounded-3xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-md shadow-xl border-2 border-white/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-115 hover:shadow-2xl hover:z-20 hover:-translate-y-2 group touch-manipulation transform hover:rotate-2"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: radius < 200 ? '60px' : radius < 300 ? '80px' : '100px',
                height: radius < 200 ? '60px' : radius < 300 ? '80px' : '100px',
              }}
              onClick={() => onSectorClick(method)}
            >
              {/* 装饰性背景 */}
              <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-pink-100/30 via-purple-100/30 to-indigo-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div 
                  className="rounded-xl lg:rounded-2xl mb-1 sm:mb-2 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:rotate-12"
                  style={{ 
                    backgroundColor: `${method.color}25`,
                    width: radius < 200 ? '32px' : radius < 300 ? '40px' : '48px',
                    height: radius < 200 ? '32px' : radius < 300 ? '40px' : '48px',
                  }}
                >
                  <img 
                    src={method.icon_url} 
                    alt={method.name}
                    className="rounded-lg lg:rounded-xl object-cover"
                    style={{
                      width: radius < 200 ? '20px' : radius < 300 ? '24px' : '28px',
                      height: radius < 200 ? '20px' : radius < 300 ? '24px' : '28px',
                    }}
                  />
                </div>
                <div
                  className="font-bold text-center leading-tight transition-all duration-300 px-1 group-hover:text-white"
                  style={{ 
                    color: method.color,
                    fontSize: radius < 200 ? '10px' : radius < 300 ? '12px' : '14px',
                  }}
                >
                  {method.name}
                </div>
                
                {/* 悬停时的装饰效果 */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsiveWheel;