# 育儿锦囊 V3.2 - 深度探索轮盘

一个现代化的育儿方法展示应用，采用响应式设计，为不同设备提供最佳的交互体验。

源自胡凯翔的亲子教育心得，点击查看 https://qwb3c4hd94t.feishu.cn/docx/N5DCduczzo54q4xMjHDcxKvPnKf

## ✨ 特性

- 🎯 **响应式轮盘设计** - PC端采用圆形轮盘布局，直观展示育儿方法
- 📱 **移动端优化** - 手机端使用网格布局，触摸体验更佳
- 🃏 **3D翻转卡片** - 精美的卡片翻转动画，展示详细内容
- 🎨 **现代化UI** - 采用Tailwind CSS，玻璃拟态设计风格
- 📊 **数据管理** - 完整的CRUD功能，支持案例的增删改查
- 🔄 **实时响应** - 窗口大小改变时自动切换布局

## 🖥️ PC端展示

PC端采用圆形轮盘设计，所有育儿方法围绕中心圆形分布，点击任意方法卡片即可查看相关案例。

<img width="1376" height="1069" alt="image" src="https://github.com/user-attachments/assets/dbe839b7-99e1-4dc0-9dd1-b8315137bd49" />


## 📱 移动端展示

移动端采用2x4网格布局，针对触摸操作优化，提供更好的手机使用体验。

<img width="426" height="889" alt="image" src="https://github.com/user-attachments/assets/d22630c1-d62c-444d-9488-9764898cf161" />


## 🃏 卡片交互

点击案例后会显示精美的3D翻转卡片，正面显示标题，背面展示详细的解决方案。

<img width="424" height="881" alt="image" src="https://github.com/user-attachments/assets/0cda9999-45a0-4f2c-b2db-45ff97e62c29" />
<img width="427" height="887" alt="image" src="https://github.com/user-attachments/assets/c2717ee6-9cbc-427a-b676-5fef75c8eaa4" />


## 📝 案例管理

支持完整的案例管理功能，包括添加新案例、编辑现有案例和删除不需要的案例。

<img width="419" height="877" alt="image" src="https://github.com/user-attachments/assets/9e9667bb-eee3-4593-8cdb-760b2ed1d557" />
<img width="408" height="821" alt="image" src="https://github.com/user-attachments/assets/610430bc-fd28-49b3-b877-481519c6c18f" />
<img width="947" height="835" alt="image" src="https://github.com/user-attachments/assets/e10eab97-1f14-4b41-8866-c2057310f3ce" />
<img width="830" height="580" alt="image" src="https://github.com/user-attachments/assets/2e3c9fab-5ea4-41ae-8734-30cc486b4ab9" />


## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **样式框架**: Tailwind CSS
- **构建工具**: Vite
- **数据库**: Supabase (PostgreSQL)
- **图标库**: Lucide React
- **部署平台**: Bolt Hosting

## 🏗️ 项目结构

```
src/
├── components/           # 组件目录
│   ├── ResponsiveWheel.tsx    # PC端轮盘组件
│   ├── MobileGrid.tsx         # 移动端网格组件
│   ├── CaseForm.tsx           # 案例表单组件
│   ├── DeleteConfirmModal.tsx # 删除确认弹窗
│   └── LoadingSpinner.tsx     # 加载动画组件
├── hooks/               # 自定义Hook
│   └── useScreenSize.ts       # 屏幕尺寸检测Hook
├── lib/                 # 工具库
│   └── supabase.ts           # Supabase客户端配置
├── App.tsx              # 主应用组件
└── index.css            # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

创建 `.env` 文件并配置Supabase连接：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📊 数据库结构

### Methods 表
- `id` - UUID主键
- `name` - 方法名称
- `color` - 主题颜色
- `icon_url` - 图标链接
- `created_at` - 创建时间

### Cases 表
- `id` - UUID主键
- `method_id` - 关联方法ID
- `name` - 案例名称
- `summary` - 案例摘要
- `card_data` - 卡片详细数据(JSON)
- `created_at` - 创建时间

## 🎨 设计特色

### 响应式设计
- **768px以下**: 自动切换到移动端网格布局
- **768px以上**: 使用PC端轮盘布局
- **实时切换**: 窗口大小改变时无缝切换

### 交互动画
- **悬停效果**: 卡片悬停时的缩放和阴影效果
- **3D翻转**: 点击卡片时的立体翻转动画
- **加载动画**: 数据加载时的旋转动画

### 视觉效果
- **玻璃拟态**: 半透明背景和模糊效果
- **渐变背景**: 多层次的渐变色彩
- **阴影层次**: 多级阴影营造立体感

## 🔧 自定义配置

### 修改轮盘半径
在 `src/index.css` 中调整不同屏幕尺寸的轮盘半径：

```css
@media (min-width: 768px) {
  .wheel-container {
    --radius: 220px; /* 调整此值改变轮盘大小 */
  }
}
```

### 修改主题色彩
在 `tailwind.config.js` 中扩展颜色配置：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // 添加自定义颜色
      }
    }
  }
}
```

## 📈 性能优化

- **代码分割**: 使用React.lazy进行组件懒加载
- **图片优化**: 使用WebP格式和适当的尺寸
- **缓存策略**: 合理的HTTP缓存配置
- **打包优化**: Vite的现代化打包策略

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Supabase](https://supabase.com/) - 后端即服务
- [Lucide](https://lucide.dev/) - 图标库
- [Vite](https://vitejs.dev/) - 构建工具

---

**在线体验**: [https://modern-interactive-d-ql0x.bolt.host](https://modern-interactive-d-ql0x.bolt.host)

*如有问题或建议，欢迎提交Issue或Pull Request！*
