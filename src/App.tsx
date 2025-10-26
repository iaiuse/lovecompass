import React, { useEffect, useState } from 'react';
import { getMethods, getCasesByMethodId, createCase, updateCase, deleteCase, createMethod, Method, Case, CaseData } from './lib/api';
import { createDefaultMethods, createDefaultCases } from './lib/defaultData';
import ResponsiveWheel from './components/wheel/ResponsiveWheel';
import MobileGrid from './components/wheel/MobileGrid';
import CaseForm from './components/cases/CaseForm';
import DeleteConfirmModal from './components/cases/DeleteConfirmModal';
import LoadingSpinner from './components/ui/LoadingSpinner';
import AuthModal from './components/auth/AuthModal';
import MethodManager from './components/methods/MethodManager';
import Header from './components/layout/Header';
import LoginPage from './components/auth/LoginPage';
import WelcomeGuide from './components/layout/WelcomeGuide';
import CaseSelector from './components/cases/CaseSelector';
import FlippableCard from './components/cases/FlippableCard';
import LLMDialog from './components/llm/LLMDialog';
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
  const [showLLMDialog, setShowLLMDialog] = useState(false);
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

  const handleLLMCaseCreated = () => {
    // 当LLM创建了新案例后，重新加载方法数据
    loadMethods();
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
      <LoginPage
        showAuthModal={showAuthModal}
        onShowAuthModal={() => setShowAuthModal(true)}
        onCloseAuthModal={() => setShowAuthModal(false)}
      />
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
          <Header
            user={user}
            methods={methods}
            onSignOut={handleSignOut}
            onShowMethodManager={() => setShowMethodManager(true)}
            onShowLLMDialog={() => setShowLLMDialog(true)}
          />
        )}

        {/* 根据屏幕尺寸显示不同的布局 */}
        {isMobile ? (
          <MobileGrid methods={methods} onMethodClick={handleSectorClick} />
        ) : (
          <ResponsiveWheel methods={methods} onSectorClick={handleSectorClick} />
        )}
      </div>

      {/* Case Selector Modal */}
      <CaseSelector
        selectedMethod={selectedMethod}
        cases={cases}
        onCaseClick={handleCaseClick}
        onAddCase={handleAddCase}
        onEditCase={handleEditCase}
        onDeleteCase={handleDeleteCase}
        onClose={closeModals}
      />

      {/* Flippable Card Modal */}
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
      <WelcomeGuide
        isVisible={showWelcomeGuide}
        onClose={() => setShowWelcomeGuide(false)}
      />

      {/* LLM对话模态框 */}
      <LLMDialog
        isVisible={showLLMDialog}
        onClose={() => setShowLLMDialog(false)}
        methods={methods}
        onCaseCreated={handleLLMCaseCreated}
      />
    </>
  );
}

export default App;