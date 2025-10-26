import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'simple' | 'minimal' | 'unified';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 64, 
  className = '',
  variant = 'default'
}) => {
  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          {/* 背景圆形 */}
          <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
          
          {/* 育儿图标 - 心形 */}
          <path
            d="M50 25C50 25 35 15 25 25C25 35 35 45 50 60C65 45 75 35 75 25C65 15 50 25 50 25Z"
            fill="white"
            fillOpacity="0.9"
          />
          
          {/* 装饰小点 */}
          <circle cx="30" cy="35" r="3" fill="white" fillOpacity="0.7" />
          <circle cx="70" cy="35" r="3" fill="white" fillOpacity="0.7" />
        </svg>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          <circle cx="50" cy="50" r="40" fill="url(#minimalGradient)" />
          <text
            x="50"
            y="60"
            textAnchor="middle"
            fontSize="36"
            fontWeight="bold"
            fill="white"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            育
          </text>
        </svg>
      </div>
    );
  }

  if (variant === 'unified') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <svg
          width={size * 1.2}
          height={size * 1.5}
          viewBox="0 0 120 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="unifiedIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          {/* 图标部分 */}
          <g transform="translate(60, 40)">
            <circle cx="0" cy="0" r="30" fill="url(#unifiedIconGradient)" />
            
            {/* 锦囊主体 */}
            <g transform="translate(0, 8)">
              <ellipse cx="0" cy="8" rx="14" ry="16" fill="white" fillOpacity="0.9" />
              <path
                d="M-12, -6 Q-12, -11 0, -11 Q12, -11 12, -6 L12, -1 Q12, 1 0, 1 Q-12, 1 -12, -1 Z"
                fill="#fbbf24"
              />
              <path
                d="M-10, -11 Q-10, -18 -5, -18 Q0, -18 5, -18 Q10, -18 10, -11"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M0, 12 C0, 12 -6, 6 -6, 1 C-6, -1 -3, -1 0, 1 C3, -1 6, -1 6, 1 C6, 6 0, 12 0, 12 Z"
                fill="#ec4899"
                fillOpacity="0.8"
              />
            </g>
          </g>
          
          {/* 标题文字 */}
          <text
            x="60"
            y="100"
            fontSize="18"
            fontWeight="bold"
            fill="url(#titleGradient)"
            fontFamily="system-ui, -apple-system, sans-serif"
            textAnchor="middle"
          >
            育儿锦囊
          </text>
          
          {/* 副标题 */}
          <text
            x="60"
            y="118"
            fontSize="11"
            fill="#64748b"
            fontFamily="system-ui, -apple-system, sans-serif"
            textAnchor="middle"
          >
            我能做什么？
          </text>
          
          {/* 说明文字 */}
          <text
            x="60"
            y="135"
            fontSize="9"
            fill="#94a3b8"
            fontFamily="system-ui, -apple-system, sans-serif"
            textAnchor="middle"
          >
            试试以下的2-3个方法
          </text>
        </svg>
      </div>
    );
  }

  // Default variant - 完整的育儿锦囊logo
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xl"
      >
        <defs>
          {/* 主渐变 */}
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          
          {/* 装饰渐变 */}
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          
          {/* 阴影渐变 */}
          <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </radialGradient>
        </defs>
        
        {/* 背景圆形 */}
        <circle cx="50" cy="50" r="48" fill="url(#mainGradient)" />
        
        {/* 内圆装饰 */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
        
        {/* 主要图标 - 育儿锦囊 */}
        <g transform="translate(50, 50)">
          {/* 锦囊主体 */}
          <ellipse cx="0" cy="8" rx="18" ry="22" fill="white" fillOpacity="0.9" />
          
          {/* 锦囊顶部 */}
          <path
            d="M-15, -8 Q-15, -15 0, -15 Q15, -15 15, -8 L15, -2 Q15, 2 0, 2 Q-15, 2 -15, -2 Z"
            fill="url(#accentGradient)"
          />
          
          {/* 锦囊绳子 */}
          <path
            d="M-12, -15 Q-12, -25 -6, -25 Q0, -25 6, -25 Q12, -25 12, -15"
            fill="none"
            stroke="url(#accentGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* 心形装饰 */}
          <path
            d="M0, 15 C0, 15 -8, 8 -8, 2 C-8, -2 -4, -2 0, 2 C4, -2 8, -2 8, 2 C8, 8 0, 15 0, 15 Z"
            fill="#ec4899"
            fillOpacity="0.8"
          />
          
          {/* 星星装饰 */}
          <g transform="translate(-20, -20) scale(0.6)">
            <path
              d="M0, -8 L2, -2 L8, -2 L3, 2 L5, 8 L0, 5 L-5, 8 L-3, 2 L-8, -2 L-2, -2 Z"
              fill="white"
              fillOpacity="0.8"
            />
          </g>
          
          <g transform="translate(20, -15) scale(0.5)">
            <path
              d="M0, -8 L2, -2 L8, -2 L3, 2 L5, 8 L0, 5 L-5, 8 L-3, 2 L-8, -2 L-2, -2 Z"
              fill="white"
              fillOpacity="0.8"
            />
          </g>
        </g>
        
        {/* 底部装饰文字 */}
        <text
          x="50"
          y="85"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill="white"
          fillOpacity="0.8"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          锦囊
        </text>
      </svg>
    </div>
  );
};

export default Logo;
