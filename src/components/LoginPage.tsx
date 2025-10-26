import React from 'react';
import { LogIn } from 'lucide-react';
import Logo from './Logo';
import AuthModal from './AuthModal';

interface LoginPageProps {
  showAuthModal: boolean;
  onShowAuthModal: () => void;
  onCloseAuthModal: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ showAuthModal, onShowAuthModal, onCloseAuthModal }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-60 animate-bounce"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 主标题区域 */}
          <div className="mb-8">
            <div className="mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
              <Logo size={96} variant="default" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              爱的转盘
            </h1>
            <p className="text-xl text-slate-600 font-medium mb-2">深度探索轮盘 V3.2</p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* 产品特色介绍 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">✨ 让育儿变得更有智慧</h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">精准方法</h3>
                  <p className="text-sm text-slate-600">科学有效的育儿方法，针对不同情况提供专业指导</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">智慧案例</h3>
                  <p className="text-sm text-slate-600">真实案例分享，让您从他人经验中学习成长</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🌟</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">个性化</h3>
                  <p className="text-sm text-slate-600">根据您的需求定制专属的育儿方案和案例</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">持续成长</h3>
                  <p className="text-sm text-slate-600">陪伴您和孩子的每一步成长，记录美好时光</p>
                </div>
              </div>
            </div>
          </div>

          {/* 登录按钮 */}
          <div className="space-y-4">
            <button
              onClick={onShowAuthModal}
              className="group relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25"
            >
              <div className="flex items-center justify-center space-x-3">
                <LogIn className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>开始爱的转盘之旅</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            
            <p className="text-sm text-slate-500">
              💝 免费使用 · 安全可靠 · 随时开始
            </p>
          </div>
        </div>
      </div>
      
      <AuthModal
        isVisible={showAuthModal}
        onClose={onCloseAuthModal}
      />
    </div>
  );
};

export default LoginPage;
