# Supabase 配置指南

## 必需的配置参数

你需要提供以下2个配置参数来连接Supabase：

### 1. VITE_SUPABASE_URL
- **获取位置**: Supabase Dashboard → Settings → API → Project URL
- **格式**: `https://your-project-id.supabase.co`
- **示例**: `https://abcdefghijklmnop.supabase.co`

### 2. VITE_SUPABASE_ANON_KEY
- **获取位置**: Supabase Dashboard → Settings → API → Project API keys → anon public
- **格式**: 长字符串，以 `eyJ` 开头
- **示例**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 配置步骤

### 1. 创建环境变量文件
在项目根目录创建 `.env.local` 文件：

```bash
# Supabase Configuration
VITE_SUPABASE_URL=你的_supabase_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key
```

### 2. 获取配置参数

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** → 用作 `VITE_SUPABASE_URL`
   - **anon public** key → 用作 `VITE_SUPABASE_ANON_KEY`

### 3. 安全注意事项

⚠️ **重要安全提醒**：
- `VITE_SUPABASE_ANON_KEY` 是公开的，可以安全地在前端使用
- 不要将 `service_role` key 放在前端代码中
- 生产环境建议启用用户认证来限制数据访问

### 4. 数据库安全策略

当前配置允许公开访问所有数据（适合演示）。生产环境建议：

1. 启用用户认证
2. 修改数据库策略，限制只有认证用户才能访问
3. 使用 Supabase Auth 进行用户管理

## 故障排除

如果遇到连接问题：

1. 检查环境变量是否正确设置
2. 确认 Supabase 项目是否正常运行
3. 检查网络连接
4. 查看浏览器控制台错误信息

## 生产环境安全建议

1. **启用 Row Level Security (RLS)**
2. **实施用户认证**
3. **限制公开访问权限**
4. **定期审查数据库策略**
5. **监控 API 使用情况**
