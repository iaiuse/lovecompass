import React, { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Method, Case, CaseData } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';

interface CaseFormProps {
  method: Method;
  case?: Case;
  onSave: (caseData: Omit<Case, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const CaseForm: React.FC<CaseFormProps> = ({ method, case: existingCase, onSave, onCancel, isSaving = false }) => {
  const [formData, setFormData] = useState({
    name: existingCase?.name || '',
    summary: existingCase?.summary || '',
    card_data: {
      theme: existingCase?.card_data.theme || [method.color, method.color],
      icon_url: existingCase?.card_data.icon_url || method.icon_url,
      front_title: existingCase?.card_data.front_title || '',
      see_why: existingCase?.card_data.see_why || '',
      solution_list: existingCase?.card_data.solution_list || '',
      the_change: existingCase?.card_data.the_change || '',
      wisdom_quote: existingCase?.card_data.wisdom_quote || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      method_id: method.id,
      name: formData.name,
      summary: formData.summary,
      card_data: formData.card_data
    });
  };

  const updateCardData = (field: keyof CaseData, value: any) => {
    setFormData(prev => ({
      ...prev,
      card_data: {
        ...prev.card_data,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src={method.icon_url} 
              alt={method.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {existingCase ? '编辑案例' : '新增案例'}
              </h2>
              <p className="text-gray-600">{method.name}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">基本信息</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：石头、悠悠"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  故事摘要 *
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="简要描述这个案例的情况和结果"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  卡片标题 *
                </label>
                <input
                  type="text"
                  value={formData.card_data.front_title}
                  onChange={(e) => updateCardData('front_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="卡片正面显示的标题"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图标链接
                </label>
                <input
                  type="url"
                  value={formData.card_data.icon_url}
                  onChange={(e) => updateCardData('icon_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* 卡片内容 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">卡片内容</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  看见"为什么" *
                </label>
                <textarea
                  value={formData.card_data.see_why}
                  onChange={(e) => updateCardData('see_why', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  placeholder="解释问题的根本原因，可以使用HTML标签"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解决方案 *
                </label>
                <textarea
                  value={formData.card_data.solution_list}
                  onChange={(e) => updateCardData('solution_list', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="具体的解决步骤，可以使用HTML标签如<ul><li>等"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  神奇变化 *
                </label>
                <textarea
                  value={formData.card_data.the_change}
                  onChange={(e) => updateCardData('the_change', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  placeholder="描述实施后的积极变化"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  智慧金句 *
                </label>
                <input
                  type="text"
                  value={formData.card_data.wisdom_quote}
                  onChange={(e) => updateCardData('wisdom_quote', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="一句有启发性的话"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 sm:px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
              disabled={isSaving}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 text-sm sm:text-base"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  <span className="ml-2">保存中...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;