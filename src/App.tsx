import React, { useEffect, useState } from 'react';
import { getMethods, getCasesByMethodId, createCase, updateCase, deleteCase, createMethod, Method, Case, CaseData } from './lib/api';
import { createDefaultMethods, createDefaultCases } from './lib/defaultData';
import { Plus, CreditCard as Edit, Trash2, LogIn, LogOut, User, Settings } from 'lucide-react';
import ResponsiveWheel from './components/ResponsiveWheel';
import MobileGrid from './components/MobileGrid';
import CaseForm from './components/CaseForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LoadingSpinner from './components/LoadingSpinner';
import AuthModal from './components/AuthModal';
import MethodManager from './components/MethodManager';
import Logo from './components/Logo';
import { useScreenSize } from './hooks/useScreenSize';
import { useAuth } from './contexts/AuthContext';

const Modal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ isVisible, onClose, children, className = '' }) => {
  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-all duration-400 backdrop-blur-sm ${className}`}
      onClick={onClose}
    >
      <div 
        className="relative transform transition-transform duration-400"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full border-none text-2xl text-gray-600 cursor-pointer transition-all duration-200 z-50 flex items-center justify-center hover:rotate-90"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const FlippableCard: React.FC<{
  cardData: CaseData;
  isFlipped: boolean;
  onFlip: () => void;
}> = ({ cardData, isFlipped, onFlip }) => {
  return (
    <div className="w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] aspect-[2/3] perspective-1200 mx-auto">
      <div 
        className={`w-full h-full relative transform-style-preserve-3d transition-transform duration-800 cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={onFlip}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Front Face */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 bg-white"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAMqADAAQAAAABAAAAMgAAAADprG40AAAEIElEQVRoBe2Zz0tbaRjH+z/gRV8o1gZBeiiChhTxFlGEoF5FKyG+iJ56ajf27s6dO3fu3H297t7du/NfQBD01qN4aDQo/AmCgIpVKAoKAnpQ60PnNfM+2Iu5t9sMceDx4eB93od53ud5HvA0z/M9E4j/iQi9c0dJjpzS4j/i5TjP8z3LD2Y9Skl6eGg0l8dTeL91u1tX7u7u8vT01JGREe/7vnNzc+P6+rr3el24urpqfHx8w+PHz3dGR0e/IuKHjY2Nk+fP/+v58+cviGLW3d09OTs765IkYf1+Pz09Pf3/w+fXkZ+fPzY9PS3QW1tbIzs7O/1+f6Orqyvz8/O6urr661fC2/dPjIyMiILo6Oioi4sL6Pf73/g/k+Tq6opEUSIiIjI1NSXkIyMjPj4+PjQ09NdbqOjo6Jg8f/58dXV10Gq1hMPhkCQJY/x+vz9/fHy8vLy0tDSLxSJUVVUpFosJBAKUy+UkEgkKhaLQbrf1db8T+Xz+5uZmPRwO0ev1hMNhhEIhhEIhpqamkEqlhEIh5ubmqlarRUVFRVRVVaFWqwn5/PnzW1tb0el0RkdHR0dHn5ubw+PHz49GRkaU3W5/++Xn54dDocDpdMLj8cjPzw+Hw0G73W5tbQ25XK5araqrq1u3bq1s2bKltLS0trb26dOn0mq1WCwW9Xo9zWaTMAwDAEqlEjAbrVYLj8dDqVRyOp0Eg0FDQ0Oam5sDAAQCAd3d3TQbDg4OHjhwwJgxYyZPnvx48OBBvV5PpVIZN27c4MGDB14r5/P5qKgoaDQa5ubmRkdHh4eH+fl8Prdu3crS0hIAYPny5UuWLKFQKJKTk5mamqqrq0tLS8tx48bRH4lEIi8vDwAwevToyZMnjx8/np2dnZmZmampqXl5eQEBAbS1tQEASqUSExODl5cXtVoNABg7dqzVq1fr6Ojg9/vZ7fYXX3xx584dnU4HAOD48ePnz58/fvz48OHDh2vXrrW0tNTZ2UkYhkAggEKhQKlUEgqFBEGAzWYjCAIAgHA4bGlpiePjYwzDwOVyURRFEARB0HUdgUCAUqmE4ziGYeByucjlcgRBwGazAQDEYhEAwOl0wmKxKJfLRVEUhmGaptF1u0+xWKyBgQEAwLlz57y8PBKJBADg1KlTZs6cqbW1FQBQUVEhEAigu7ubz+cDAMRiMYqiCAaDAoEAwzAURWEYhmEYhmEwGAQA0Ov1oiiKYRgEg0G5XI5lWYZhkMvlFotFhmEQCAQ0NDTIZrNVq1ZBawzDwGazAQBER0eHRkdHyOVyBEFAoVAIBAIURQEAgUAAAEqlkmhvb27ubl4ul5OSkqKhoaGpqUmxWEQoFFIsFhGLxTRN43meb/z7gX2L/x+M9S+8L/yLMAxT8zkYAAAAAElFTkTSuQmCC)'
          }}
        >
          <img 
            src={cardData.icon_url} 
            alt="Card icon"
            className="w-20 h-20 rounded-full object-cover"
          />
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mt-5 leading-tight text-gray-800">
            {cardData.front_title}
          </h2>
        </div>

        {/* Back Face */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg p-6 text-white flex flex-col rotate-y-180"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundImage: `linear-gradient(160deg, ${cardData.theme[0]} 0%, ${cardData.theme[1]} 100%)`
          }}
        >
          {/* Background Watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 w-4/5 h-4/5 opacity-10 pointer-events-none">
            <img 
              src={cardData.icon_url} 
              alt="Background"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <div className="flex-grow overflow-y-auto pr-4 -mr-4 relative z-10 card-content">
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 pb-1 border-b border-white border-opacity-30 mt-0">
              看见"为什么"
            </h4>
            <div 
              className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-4 break-words"
              dangerouslySetInnerHTML={{ __html: cardData.see_why }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
            
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 pb-1 border-b border-white border-opacity-30">
              解决方案
            </h4>
            <div 
              className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-4 break-words"
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {cardData.solution_list && (
                <div 
                  dangerouslySetInnerHTML={{ __html: cardData.solution_list }}
                  className="text-xs sm:text-sm md:text-base lg:text-lg"
                />
              )}
            </div>
            
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-2 pb-1 border-b border-white border-opacity-30">
              神奇变化 ✨
            </h4>
            <div 
              className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed mb-3 break-words"
              dangerouslySetInnerHTML={{ __html: cardData.the_change }}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            />
          </div>
          
          <div className="text-center italic pt-3 mt-2 border-t border-white border-opacity-20 flex-shrink-0 relative z-10">
            <p className={`text-xs sm:text-sm md:text-base lg:text-lg m-0 before:content-['"'] after:content-['"'] before:text-xl after:text-xl before:text-yellow-300 after:text-yellow-300 leading-tight`}>
              {cardData.wisdom_quote.replace(/"/g, '')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [methods, setMethods] = useState<Method[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCase, setDeletingCase] = useState<Case | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMethodManager, setShowMethodManager] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const { isMobile } = useScreenSize();
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      loadMethods();
    } else {
      setMethods([]);
      setCases([]);
      setSelectedMethod(null);
      setSelectedCase(null);
      setLoading(false);
    }
  }, [user]);

  const loadMethods = async () => {
    if (!user) return;
    
    setLoading(true);
    const methodsData = await getMethods();
    
    // 如果是新用户（没有方法），创建默认方法
    if (methodsData.length === 0) {
      const createdMethods = await createDefaultMethods(createMethod);
      // 创建默认案例
      if (createdMethods.length > 0) {
        await createDefaultCases(createdMethods, createCase);
      }
      // 重新获取方法
      const updatedMethods = await getMethods();
      setMethods(updatedMethods);
      // 显示欢迎引导
      setShowWelcomeGuide(true);
    } else {
      setMethods(methodsData);
    }
    
    setLoading(false);
  };


  const handleSignOut = async () => {
    await signOut();
  };

  const handleMethodsChange = (updatedMethods: Method[]) => {
    setMethods(updatedMethods);
  };

  const handleSectorClick = async (method: Method) => {
    setSelectedMethod(method);
    setSelectedCase(null);
    setIsCardFlipped(false);
    
    const casesData = await getCasesByMethodId(method.id);
    setCases(casesData);
  };

  const handleCaseClick = (caseData: CaseData) => {
    setSelectedCase(caseData);
    setIsCardFlipped(false);
  };

  const handleAddCase = () => {
    setEditingCase(null);
    setShowCaseForm(true);
  };

  const handleEditCase = (caseItem: Case, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCase(caseItem);
    setShowCaseForm(true);
  };

  const handleDeleteCase = async (caseItem: Case, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete button clicked for case:', caseItem.name);
    setDeletingCase(caseItem);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletingCase || !selectedMethod) return;
    
    setIsDeleting(true);
    const success = await deleteCase(deletingCase.id);
    
    if (success) {
      const updatedCases = await getCasesByMethodId(selectedMethod.id);
      setCases(updatedCases);
      setShowDeleteModal(false);
      setDeletingCase(null);
    }
    setIsDeleting(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingCase(null);
  };

  const handleSaveCase = async (caseData: Omit<Case, 'id' | 'created_at'>) => {
    setIsSaving(true);
    
    let success = false;
    if (editingCase) {
      const updatedCase = await updateCase(editingCase.id, caseData);
      success = !!updatedCase;
    } else {
      const newCase = await createCase(caseData);
      success = !!newCase;
    }
    
    if (success && selectedMethod) {
      const updatedCases = await getCasesByMethodId(selectedMethod.id);
      setCases(updatedCases);
      setShowCaseForm(false);
      setEditingCase(null);
    }
    setIsSaving(false);
  };

  const closeModals = () => {
    setSelectedMethod(null);
    setSelectedCase(null);
    setIsCardFlipped(false);
    setShowCaseForm(false);
    setEditingCase(null);
    setShowDeleteModal(false);
    setDeletingCase(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <div className="text-xl text-slate-600 mt-4 font-medium">加载中...</div>
        </div>
      </div>
    );
  }

  // 如果用户未登录，显示登录界面
  if (!user) {
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
                育儿锦囊
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
                onClick={() => setShowAuthModal(true)}
                className="group relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25"
              >
                <div className="flex items-center justify-center space-x-3">
                  <LogIn className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span>开始育儿智慧之旅</span>
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
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 text-slate-800 overflow-hidden relative">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-32 h-32 bg-gradient-to-br from-blue-200/25 to-cyan-200/25 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-gradient-to-br from-green-200/25 to-emerald-200/25 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-8 w-16 h-16 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full animate-pulse"></div>
          <div className="absolute top-1/4 right-8 w-12 h-12 bg-gradient-to-br from-cyan-200/25 to-blue-200/25 rounded-full animate-bounce"></div>
        </div>
        {/* 只在PC端显示Header */}
        {!isMobile && (
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
                      育儿锦囊
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">深度探索轮盘 V3.2</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowMethodManager(true)}
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
                      onClick={handleSignOut}
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
        )}

        {/* 根据屏幕尺寸显示不同的布局 */}
        {isMobile ? (
          <MobileGrid methods={methods} onMethodClick={handleSectorClick} />
        ) : (
          <ResponsiveWheel methods={methods} onSectorClick={handleSectorClick} />
        )}
      </div>

      {/* Level 1 Modal: Case Selector */}
      <Modal
        isVisible={!!selectedMethod && !selectedCase}
        onClose={closeModals}
      >
        <div 
          className="bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-3xl shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto"
        >
          {selectedMethod && (
            <>
              <div className="flex items-center border-b border-slate-200/50 pb-4 lg:pb-6 mb-4 lg:mb-6">
                <div 
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mr-3 lg:mr-5 flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ backgroundColor: `${selectedMethod.color}20` }}
                >
                  <img 
                  src={selectedMethod.icon_url} 
                  alt={selectedMethod.name}
                    className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl object-cover"
                  />
                </div>
                <div>
                  <h2
                    className="text-xl lg:text-3xl font-black m-0 mb-1"
                  style={{ color: selectedMethod.color }}
                  >
                  {selectedMethod.name}
                  </h2>
                  <p className="text-slate-500 text-xs lg:text-sm font-medium">探索相关案例</p>
                </div>
              </div>
              
              <div className="grid gap-3 lg:gap-4">
                {/* 添加新案例按钮 */}
                <div
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center group touch-manipulation"
                  onClick={handleAddCase}
                >
                  <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mr-2 lg:mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-sm lg:text-base text-blue-700 font-semibold">添加新案例</span>
                </div>
                
                {cases.length > 0 ? (
                  cases.map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="bg-white/60 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/50 hover:bg-white/80 relative group touch-manipulation"
                      onClick={() => handleCaseClick(caseItem.card_data)}
                    >
                      {/* 操作按钮 */}
                      <div className="absolute top-3 right-3 lg:top-4 lg:right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0 flex space-x-1 lg:space-x-2">
                        <button
                          onClick={(e) => handleEditCase(caseItem, e)}
                          className="w-7 h-7 lg:w-9 lg:h-9 bg-blue-100/80 hover:bg-blue-200 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 backdrop-blur-sm touch-manipulation"
                          title="编辑案例"
                        >
                          <Edit className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCase(caseItem, e)}
                          className="w-7 h-7 lg:w-9 lg:h-9 bg-red-100/80 hover:bg-red-200 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 relative z-20 backdrop-blur-sm touch-manipulation"
                          title="删除案例"
                        >
                          <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                        </button>
                      </div>
                      
                      <h3 className="text-lg lg:text-xl font-bold mb-2 lg:mb-3 text-slate-800 pr-16 lg:pr-20">
                        {caseItem.name}的故事:
                      </h3>
                      <p className="m-0 leading-relaxed text-sm lg:text-base text-slate-600 font-medium">
                        {caseItem.summary}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 lg:py-8">
                    <p className="text-sm lg:text-base text-slate-500 font-medium">
                    这是一个很好的方法！我们一起在生活中寻找可以用上它的机会吧！
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Level 2 Modal: Flippable Card */}
      <Modal
        isVisible={!!selectedCase}
        onClose={closeModals}
        className="bg-black/40"
      >
        <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl px-4">
          {selectedCase && (
            <FlippableCard
              cardData={selectedCase}
              isFlipped={isCardFlipped}
              onFlip={() => setIsCardFlipped(!isCardFlipped)}
            />
          )}
        </div>
      </Modal>

      {/* 案例表单 */}
      {showCaseForm && selectedMethod && (
        <CaseForm
          method={selectedMethod}
          case={editingCase || undefined}
          onSave={handleSaveCase}
          onCancel={() => {
            setShowCaseForm(false);
            setEditingCase(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* 删除确认模态框 */}
      <DeleteConfirmModal
        isVisible={showDeleteModal}
        caseName={deletingCase?.name || ''}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />

      {/* 认证模态框 */}
      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* 方法管理模态框 */}
      <Modal
        isVisible={showMethodManager}
        onClose={() => setShowMethodManager(false)}
      >
        <MethodManager
          methods={methods}
          onMethodsChange={handleMethodsChange}
          onClose={() => setShowMethodManager(false)}
        />
      </Modal>

      {/* 欢迎引导模态框 */}
      <Modal
        isVisible={showWelcomeGuide}
        onClose={() => setShowWelcomeGuide(false)}
        className="bg-black/50"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-white/20 relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 translate-y-16 -translate-x-16"></div>
          
          <div className="relative z-10 text-center">
            <div className="mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
              <Logo size={80} variant="default" />
            </div>
            
            <h2 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              🎉 欢迎来到育儿锦囊！
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
              onClick={() => setShowWelcomeGuide(false)}
              className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25"
            >
              <div className="flex items-center justify-center space-x-3">
                <span>开始探索</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default App;