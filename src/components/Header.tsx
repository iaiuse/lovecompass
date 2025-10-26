import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import Logo from './Logo';
import { Method } from '../lib/supabase';

interface HeaderProps {
  user: any;
  methods: Method[];
  onSignOut: () => void;
  onShowMethodManager: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, methods, onSignOut, onShowMethodManager }) => {
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-white/30 shadow-lg sticky top-0 z-40 relative">
      {/* 头部装饰渐变 */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <Logo size={64} variant="default" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                爱的转盘
              </h1>
              <p className="text-sm text-slate-500 font-medium">深度探索轮盘 V3.2</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onShowMethodManager}
              className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-full border border-pink-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              title="管理方法"
            >
              <Settings className="w-4 h-4 text-pink-600 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-semibold text-pink-700">
                {methods.length} 个方法
              </span>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/40 shadow-md hover:shadow-lg transition-all duration-300">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="用户头像" 
                    className="w-5 h-5 rounded-full object-cover ring-2 ring-pink-200"
                  />
                ) : (
                  <div className="w-5 h-5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="text-sm font-semibold text-slate-700">
                  {user.display_name || user.name || user.email}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-full border border-red-200 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                title="退出登录"
              >
                <LogOut className="w-4 h-4 text-red-600 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm font-semibold text-red-700">退出</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
