# WingMan Website

WingMan 官网，设计参照 AceCut 官网的大标题、分区卡片、FAQ 与公司页脚，采用 WingMan 原型的淡紫配色与飞翼 W Logo。英文内容与 AceCut 官网保持一致。

源文件位于 `public/`。Logo 提取自 WingMan `docs/reference.html` 的 `WING_MARK`；功能与隐私内容依据 WingMan 原生 App、`Shared/AssistantService.swift` 的披露和账号功能编写。页面示例对话仅为演示，语气按钮在浏览器本地切换，不调用 AI、不收集输入。

## 开发与构建

需要 Bun 1.2+，无第三方运行时依赖：

```sh
bun run dev
bun run build
bun run preview
```

本地地址：`http://127.0.0.1:4173`。构建结果在 `dist/`，不提交。`/terms`、`/privacy` 在本地服务器和 Vercel clean URLs 下均可访问。三个页面都有 © 2026 SWINK AI INC.、hello@goswie.com、Terms 和 Privacy 入口。

## 发布配置

此仓库为独立网站，Vercel 导入 `diifan/wingman-website` 后使用根目录 `./`、Framework `Other`、`bun run build`、输出目录 `dist`。配置已保存在 `vercel.json`。本次交付范围为 GitHub 源码推送，没有创建托管项目或绑定域名。

正式域名未指定，因此不硬编码 canonical、Open Graph URL 或 sitemap 域名。确定域名后，构建时设置 `SITE_URL=https://正式域名` 即可生成三页 canonical、Open Graph URL、包含首页及 Terms/Privacy 的 sitemap 和 robots Sitemap 入口。

未发现正式 App Store 链接，目前使用联系邮箱入口并标记 In development for iPhone；上架后替换首页的联系 CTA 与 FAQ 中的获取方式。

## 验证

Bun 静态构建；通过本地 HTTP 检查首页、Terms、Privacy 与引用资源；使用 Chromium 在 1440、768、390、320 像素宽度检查页面溢出、图片、页脚、FAQ 与语气切换。截图在忽略的 `validation/` 目录。
