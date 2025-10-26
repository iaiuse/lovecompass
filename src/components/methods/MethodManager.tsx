import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, X } from 'lucide-react';
import { Method, createMethod, updateMethod, deleteMethod } from '../../lib/api';
import MethodForm from './MethodForm';

interface MethodManagerProps {
  methods: Method[];
  onMethodsChange: (methods: Method[]) => void;
  onClose: () => void;
}

const MethodManager: React.FC<MethodManagerProps> = ({
  methods,
  onMethodsChange,
  onClose
}) => {
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMethod, setDeletingMethod] = useState<Method | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddMethod = () => {
    setEditingMethod(null);
    setShowMethodForm(true);
  };

  const handleEditMethod = (method: Method) => {
    setEditingMethod(method);
    setShowMethodForm(true);
  };

  const handleDeleteMethod = (method: Method) => {
    setDeletingMethod(method);
    setShowDeleteModal(true);
  };

  const handleSaveMethod = async (methodData: Omit<Method, 'id' | 'created_at'>) => {
    setIsSaving(true);
    
    try {
      if (editingMethod) {
        // 更新现有方法
        const updatedMethod = await updateMethod(editingMethod.id, methodData);
        if (updatedMethod) {
          const updatedMethods = methods.map(m => 
            m.id === editingMethod.id ? updatedMethod : m
          );
          onMethodsChange(updatedMethods);
        }
      } else {
        // 创建新方法
        const newMethod = await createMethod(methodData);
        if (newMethod) {
          onMethodsChange([...methods, newMethod]);
        }
      }

      setShowMethodForm(false);
      setEditingMethod(null);
    } catch (error) {
      console.error('Error saving method:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingMethod) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteMethod(deletingMethod.id);
      if (success) {
        const updatedMethods = methods.filter(m => m.id !== deletingMethod.id);
        onMethodsChange(updatedMethods);
      }
      
      setShowDeleteModal(false);
      setDeletingMethod(null);
    } catch (error) {
      console.error('Error deleting method:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingMethod(null);
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-4xl shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">方法管理</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 添加新方法按钮 */}
        <div className="mb-6">
          <button
            onClick={handleAddMethod}
            className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl lg:rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center group"
          >
            <Plus className="w-5 h-5 text-blue-600 mr-3 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-base text-blue-700 font-semibold">添加新方法</span>
          </button>
        </div>

        {/* 方法列表 */}
        <div className="space-y-4">
          {methods.length > 0 ? (
            methods.map((method) => (
              <div
                key={method.id}
                className="bg-white/60 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                      style={{ backgroundColor: `${method.color}20` }}
                    >
                      <img 
                        src={method.icon_url} 
                        alt={method.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">
                        {method.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        创建于 {new Date(method.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEditMethod(method)}
                      className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                      title="编辑方法"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteMethod(method)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors"
                      title="删除方法"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-slate-500 font-medium">还没有任何方法</p>
              <p className="text-sm text-slate-400 mt-1">点击上方按钮添加您的第一个方法</p>
            </div>
          )}
        </div>
      </div>

      {/* 方法表单 */}
      {showMethodForm && (
        <MethodForm
          method={editingMethod || undefined}
          onSave={handleSaveMethod}
          onCancel={() => {
            setShowMethodForm(false);
            setEditingMethod(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">确认删除</h3>
            <p className="text-slate-600 mb-6">
              确定要删除方法 "{deletingMethod?.name}" 吗？删除后所有相关的案例也会被删除，此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                disabled={isDeleting}
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isDeleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MethodManager;
