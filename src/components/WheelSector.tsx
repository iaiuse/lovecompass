import React from 'react';
import { Method } from '../lib/supabase';

interface WheelSectorProps {
  method: Method;
  index: number;
  totalMethods: number;
  onSectorClick: (method: Method) => void;
}

const WheelSector: React.FC<WheelSectorProps> = ({ 
  method, 
  index, 
  totalMethods, 
  onSectorClick 
}) => {
  const angleStep = 360 / totalMethods;
  const angle = angleStep * index - 90;
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian);
  const y = Math.sin(radian);

  return (
    <div
      className="wheel-sector absolute rounded-xl lg:rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-white/50 lg:border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:z-20 hover:-translate-y-1 group touch-manipulation"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x * 90}px), calc(-50% + ${y * 90}px))`,
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
};

export default WheelSector;