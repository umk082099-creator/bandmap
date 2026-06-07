# BandMap - 乐队地图 🎸

找到你的音乐伙伴，组建属于你的乐队。

## 功能

- **招募板**：乐队招人 / 乐手求职，按城市、乐器、风格筛选
- **讨论板**：音乐交流讨论
- **城市选择器**：东莞、北京、上海、广州、深圳等全国主要城市
- **深色模式 UI**：紫罗兰强调色，移动端优先的响应式布局
- **Supabase 认证**：邮箱 + 密码注册登录
- **管理后台** `/admin`：管理招募和讨论帖
- **PWA**：支持添加到手机主屏幕

## 技术栈

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Supabase (Auth + Database)
- PWA (manifest.json + Service Worker)

## 部署步骤

### 1. Supabase 设置

1. 在 [supabase.com](https://supabase.com) 创建新项目
2. 进入 SQL Editor，复制 `schema.sql` 的全部内容并执行
3. 进入 Project Settings > API，复制：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Vercel 部署

1. 将项目推送到 GitHub：

```bash
git init
git add .
git commit -m "Initial commit: BandMap"
gh repo create bandmap --public --push
```

2. 在 [vercel.com](https://vercel.com) 导入 GitHub 仓库
3. 在 Vercel 项目设置中添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`：你的 Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`：你的 Supabase anon key
4. 部署！

### 3. 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量（复制 .env.local 并填入真实值）
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# 启动开发服务器
npm run dev
```

### 4. PWA 图标

项目使用了占位图标。请替换 `public/icons/` 下的：
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

可以使用 [realfavicongenerator.net](https://realfavicongenerator.net/) 生成。

## 项目结构

```
src/
├── app/
│   ├── page.tsx                # 首页（招募板 + 讨论板）
│   ├── layout.tsx              # 根布局（深色主题 + PWA）
│   ├── globals.css             # 全局样式
│   ├── auth/
│   │   ├── login/page.tsx      # 登录
│   │   ├── register/page.tsx   # 注册
│   │   └── callback/route.ts   # Auth 回调
│   ├── recruitment/
│   │   ├── [id]/page.tsx       # 招募详情
│   │   └── new/page.tsx        # 发布招募
│   ├── discussion/
│   │   ├── [id]/page.tsx       # 讨论详情
│   │   └── new/page.tsx        # 发布讨论
│   └── admin/page.tsx          # 管理后台
├── components/
│   ├── AuthProvider.tsx        # 认证上下文
│   ├── Header.tsx              # 顶部导航
│   ├── Filters.tsx             # 筛选器组件
│   ├── RecruitmentCard.tsx     # 招募卡片
│   └── DiscussionCard.tsx      # 讨论卡片
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # 浏览器客户端
│   │   └── server.ts           # 服务端客户端
│   ├── types.ts                # TypeScript 类型
│   └── constants.ts            # 常量（城市/乐器/风格）
└── middleware.ts               # Auth 中间件
```
