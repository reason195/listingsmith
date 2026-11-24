# ListingSmith AI — BUILDLOG

日期：2026-11-24。栈：Vite + TypeScript + 原生 CSS，无重型框架。未部署、未建 GitHub 仓库、未接真实支付（按任务约束）。

## 已实现（真实可用）

- **结构化表单**：地址、社区、城市/州、价格、卧室、浴室、面积 sqft、房龄；卖点 16 项多选（每项映射一句成稿文案）+ 自由输入 highlights；语气三选一（Professional / Warm / Luxury）。
- **一键生成四种文案**：MLS 长版（实测样例 199 词，目标约 180–220）、MLS 短版（约 60–70 词）、Instagram/Facebook 帖子（含 hashtags）、邮件标题 3 条。每版带复制按钮和词数显示。
- **公平住房合规筛查（核心差异化，纯前端）**：`src/wordlist.ts` 内置 **81 条**敏感短语，覆盖 Race/Color、National Origin、Religion、Sex/Gender、Familial Status、Disability、Source of income、General steering 七类，每条带风险类别、字面替换文本和风险说明。最长匹配优先（"walking distance to church"、"bachelor pad" 不会被拆成两条）。生成结果自动逐版扫描并显示 ✓/⚠ 徽章；独立筛查区支持粘贴任意文案、命中高亮（`<mark>`）、逐条「Apply fix」和「Apply all suggested fixes」一键替换（替换后自动处理多余空格/标点/句首大写）。页面两处标注 "screening aid, not legal advice"。
- **AI 接入（BYOK）**：设置区填 Gemini API key 存 localStorage，调用 `generativelanguage.googleapis.com` 的 gemini-2.5-flash（JSON 模式，prompt 内置 Fair Housing 约束）；调用失败自动回退模板引擎并弹窗说明。无 key 时为模板引擎 Demo mode，界面顶部徽章和结果来源均明确标注，模板按语气拼装开场/卖点/地段/收尾四段，实测自产出文案零命中敏感词。
- **历史记录**：生成结果存 localStorage（上限 20 条），可回看（载入结果区）、一键复制 MLS 长版、删除。
- **定价区**：Free（1 套完整挂牌）/ Pro $19/月（不限量）两档展示。

## 占位（明确标注，未假装打通）

- Pro 订阅按钮为 disabled 占位，标注 "Subscribe — coming soon"，页面注明 checkout 未上线。
- Free 档「1 套」限制为软限制：生成计数存 localStorage，超量后显示提示文案说明 Pro 即将推出，但 MVP 构建仍可继续生成（方便演示与测试）。
- Gemini 调用未用真实 key 端到端验证（本地无 key）；代码按官方 generateContent 接口写，失败有回退，不影响 Demo 全流程。

## 验证

- `npm run build`（tsc + vite build）通过，产物约 30 KB JS（gzip 9.7 KB）。
- Node 实测（esbuild 打包后运行）：词表 81 条；含 7 处埋点的样例文案全部命中且类别/替换正确；一键替换后文本通顺；模板引擎样例长版 199 词、短版 69 词、标题 3 条、社交文案含 hashtags、自产出扫描 0 命中。

## 待办

- 接 Stripe Checkout 实现 Pro 订阅与硬性用量限制（替换现在的软限制）。
- 用真实 Gemini key 做端到端生成验证，并对 AI 输出做一轮敏感词回归（AI 模式下同样过筛查，已有 UI 徽章兜底）。
- 词表持续维护：补充州级规则（如 source-of-income 更多州、55+ 社区例外话术）与 MLS 地方格式差异。
- 落地页/SEO 与经纪人社群冷启动（获客不在本 MVP 范围）。
- 部署到 Firebase Hosting（与 chess-coach 同栈）并建公开仓库时补 LICENSE。
