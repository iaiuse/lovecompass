import React from 'react';
import Logo from './Logo';

const LogoDemo: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">育儿锦囊 Logo 展示</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Default Logo */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">完整版 Logo</h3>
            <div className="flex justify-center mb-4">
              <Logo size={120} variant="default" />
            </div>
            <p className="text-sm text-slate-600">包含锦囊、心形、星星等元素，适合主页面使用</p>
          </div>

          {/* Simple Logo */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">简化版 Logo</h3>
            <div className="flex justify-center mb-4">
              <Logo size={120} variant="simple" />
            </div>
            <p className="text-sm text-slate-600">心形设计，适合认证页面使用</p>
          </div>

          {/* Minimal Logo */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <h3 className="text-lg font-semibold mb-4 text-slate-800">极简版 Logo</h3>
            <div className="flex justify-center mb-4">
              <Logo size={120} variant="minimal" />
            </div>
            <p className="text-sm text-slate-600">纯文字设计，适合头部导航使用</p>
          </div>
        </div>

        {/* 不同尺寸展示 */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-semibold mb-6 text-center text-slate-800">不同尺寸展示</h3>
          <div className="flex items-center justify-center space-x-8 flex-wrap">
            <div className="text-center">
              <Logo size={32} variant="minimal" />
              <p className="text-xs text-slate-600 mt-2">32px</p>
            </div>
            <div className="text-center">
              <Logo size={48} variant="minimal" />
              <p className="text-xs text-slate-600 mt-2">48px</p>
            </div>
            <div className="text-center">
              <Logo size={64} variant="minimal" />
              <p className="text-xs text-slate-600 mt-2">64px</p>
            </div>
            <div className="text-center">
              <Logo size={96} variant="minimal" />
              <p className="text-xs text-slate-600 mt-2">96px</p>
            </div>
            <div className="text-center">
              <Logo size={128} variant="minimal" />
              <p className="text-xs text-slate-600 mt-2">128px</p>
            </div>
          </div>
        </div>

        {/* 配色说明 */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">配色方案</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm font-medium text-slate-700">粉色</p>
              <p className="text-xs text-slate-500">#ec4899</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm font-medium text-slate-700">紫色</p>
              <p className="text-xs text-slate-500">#a855f7</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm font-medium text-slate-700">蓝色</p>
              <p className="text-xs text-slate-500">#3b82f6</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl mx-auto mb-2"></div>
              <p className="text-sm font-medium text-slate-700">青色</p>
              <p className="text-xs text-slate-500">#06b6d4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoDemo;
