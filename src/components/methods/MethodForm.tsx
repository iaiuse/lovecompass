import React, { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';

interface MethodFormData {
  name: string;
  color: string;
  icon_url: string;
}

interface MethodFormProps {
  method?: {
    id: string;
    name: string;
    color: string;
    icon_url: string;
  };
  onSave: (methodData: MethodFormData) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const MethodForm: React.FC<MethodFormProps> = ({
  method,
  onSave,
  onCancel,
  isSaving
}) => {
  const [formData, setFormData] = useState<MethodFormData>({
    name: method?.name || '',
    color: method?.color || '#3B82F6',
    icon_url: method?.icon_url || ''
  });

  const [errors, setErrors] = useState<Partial<MethodFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<MethodFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '方法名称不能为空';
    }

    if (!formData.color) {
      newErrors.color = '请选择颜色';
    }

    if (!formData.icon_url.trim()) {
      newErrors.icon_url = '图标链接不能为空';
    } else {
      // 简单的URL验证
      try {
        new URL(formData.icon_url);
      } catch {
        newErrors.icon_url = '请输入有效的图标链接';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSave(formData);
  };

  const handleInputChange = (field: keyof MethodFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4',
    '#EC4899', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#A855F7'
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 w-[95vw] sm:w-[90vw] md:w-[85vw] max-w-2xl shadow-2xl border border-white/20 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {method ? '编辑方法' : '添加新方法'}
        </h2>
        <button
          onClick={onCancel}
          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 方法名称 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            方法名称 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="请输入方法名称"
            disabled={isSaving}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* 颜色选择 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            选择颜色 *
          </label>
          <div className="grid grid-cols-6 gap-3 mb-3">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange('color', color)}
                className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${
                  formData.color === color
                    ? 'border-slate-400 scale-110'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                disabled={isSaving}
              />
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
              disabled={isSaving}
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#3B82F6"
              disabled={isSaving}
            />
          </div>
          {errors.color && (
            <p className="text-red-500 text-sm mt-1">{errors.color}</p>
          )}
        </div>

        {/* 图标链接 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            图标链接 *
          </label>
          <input
            type="url"
            value={formData.icon_url}
            onChange={(e) => handleInputChange('icon_url', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.icon_url 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="https://example.com/icon.png"
            disabled={isSaving}
          />
          {errors.icon_url && (
            <p className="text-red-500 text-sm mt-1">{errors.icon_url}</p>
          )}
          {formData.icon_url && (
            <div className="mt-3 flex items-center space-x-3">
              <span className="text-sm text-slate-600">预览:</span>
              <img
                src={formData.icon_url}
                alt="图标预览"
                className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* 按钮 */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
            disabled={isSaving}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{method ? '更新方法' : '创建方法'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MethodForm;
