# Cloudflare Pages 部署指南

## API 架构

本项目使用 Cloudflare Pages Functions 和 Edge Runtime 来处理 API 请求。

### API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/methods` | GET | 获取所有方法 |
| `/api/methods/[methodId]/cases` | GET | 根据方法ID获取案例 |
| `/api/cases` | POST | 创建新案例 |
| `/api/cases/[id]` | PUT | 更新案例 |
| `/api/cases/[id]` | DELETE | 删除案例 |

## 部署步骤

### 1. 环境变量配置

在 Cloudflare Pages 控制台中设置以下环境变量：

```
SUPABASE_URL=你的_supabase_url
SUPABASE_ANON_KEY=你的_anon_key
```

**重要说明**：
- 前端不再直接连接 Supabase，所有数据操作通过 API 进行
- 后端使用 `SUPABASE_ANON_KEY`（anon key，用于用户认证）
- 只需要在 Cloudflare Pages 控制台中配置后端环境变量

### 2. 获取 Supabase 配置

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** → 用作 `SUPABASE_URL`
   - **anon public** key → 用作 `SUPABASE_ANON_KEY`

### 3. 部署到 Cloudflare Pages

#### 方法一：通过 Git 连接
1. 将代码推送到 GitHub/GitLab
2. 在 Cloudflare Pages 中连接仓库
3. 设置构建命令：`npm run build`
4. 设置输出目录：`dist`
5. 配置环境变量

#### 方法二：通过 Wrangler CLI
```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler pages deploy dist --project-name=lovecompass
```

### 4. 环境变量设置

在 Cloudflare Pages 控制台中：
1. 进入 **Settings** → **Environment variables**
2. 添加以下变量：
   - `SUPABASE_URL`（后端用）
   - `SUPABASE_ANON_KEY`（后端用）

## 安全配置

### 数据库安全策略

当前API使用 `service_role` key，具有完整数据库访问权限。生产环境建议：

1. **启用 Row Level Security (RLS)**
2. **实施用户认证**
3. **限制公开访问权限**
4. **定期审查数据库策略**

### CORS 配置

API 已配置 CORS 支持，允许跨域请求。生产环境可根据需要限制来源域名。

## 测试 API

部署后，你可以测试以下端点：

```bash
# 健康检查
curl https://your-domain.pages.dev/api/health

# 获取方法
curl https://your-domain.pages.dev/api/methods

# 获取特定方法的案例
curl https://your-domain.pages.dev/api/methods/{methodId}/cases
```

## 故障排除

### 常见问题

1. **环境变量未设置**
   - 检查 Cloudflare Pages 控制台中的环境变量
   - 确保变量名称正确

2. **Supabase 连接失败**
   - 验证 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`
   - 检查 Supabase 项目是否正常运行

3. **CORS 错误**
   - API 已配置 CORS，检查请求头设置

4. **构建失败**
   - 检查 `package.json` 中的构建脚本
   - 确保所有依赖已安装

### 调试

在 Cloudflare Pages 控制台中查看：
- **Functions** 标签页查看 API 日志
- **Analytics** 查看请求统计
- **Settings** → **Environment variables** 检查配置
