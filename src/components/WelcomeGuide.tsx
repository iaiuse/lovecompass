import React from 'react';
import Logo from './Logo';

interface WelcomeGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-400 backdrop-blur-sm">
      <div className="relative transform transition-transform duration-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full border-none text-2xl text-gray-600 cursor-pointer transition-all duration-200 z-50 flex items-center justify-center hover:rotate-90"
        >
          ×
        </button>
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-white/20 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 translate-y-16 -translate-x-16"></div>
          
          <div className="relative z-10 text-center">
            <div className="mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
              <Logo size={80} variant="default" />
            </div>
            
            <h2 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              🎉 欢迎来到爱的转盘！
            </h2>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              我已经为您准备了 <span className="font-bold text-purple-600">8个基础育儿方法</span> 和 <span className="font-bold text-blue-600">5个示例案例</span>，让您立即开始探索！
            </p>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-8 border border-pink-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">✨ 接下来您可以：</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">点击方法</h4>
                    <p className="text-sm text-slate-600">探索不同的育儿方法</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">📝</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">添加案例</h4>
                    <p className="text-sm text-slate-600">记录您的育儿经验</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">⚙️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">管理方法</h4>
                    <p className="text-sm text-slate-600">自定义您的育儿工具</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">💡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">学习成长</h4>
                    <p className="text-sm text-slate-600">从案例中获取智慧</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25"
            >
              <div className="flex items-center justify-center space-x-3">
                <span>开始探索</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
