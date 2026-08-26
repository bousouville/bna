# BNA · 布索維爾國家航空官方网站

布索維爾共和國國家航空公司（Bousouville National Airways, BNA）的官方营销网站。1960 年由「民航局飛行總隊國際運營支隊」起家、1975 年改制、2007 年加入寰宇一家。繁体中文（书面普通话表述、港式拼音罗马化）与英语双语，SvelteKit 全静态预渲染，含 Three.js 程序化三维场景。

## 技术栈

- **框架**：SvelteKit 2 + Svelte 5（runes），`adapter-static` 全站预渲染
- **3D**：Three.js —— 航点地球（world-atlas 海岸线栅格化 + 大圆弧航线）与 A330-300 程序化机模（CanvasTexture 涂装绘制），进入视口懒加载；无 WebGL 环境自动降级为 2D SVG 航图 / 涂装侧视图
- **i18n**：路径前缀式双语（`/` 繁中 · `/en/` English），词典位于 `src/lib/i18n/`
- **订座演示流程**：确定性生成器（mulberry32 + FNV-1a）按「航线 × 日期」稳定生成班期、票价与座位图
- **字体**：Inter + Noto Sans TC（@fontsource 本地打包）
- **品牌色**：海军蓝 Pantone 281C `#00205B` · 金 Pantone 873C `#B0913F`

## 开发

```bash
pnpm install        # 安装依赖
pnpm dev            # 开发服务器
pnpm build          # 构建静态站点到 build/
pnpm preview        # 预览生产构建
pnpm check          # svelte-check
node scripts/process-assets.mjs   # 品牌位图素材处理（需原始素材）
```

## 目录

```
src/
├── lib/
│   ├── components/    # Header / Footer / BookingWidget / Mark / 3D 查看器等
│   ├── pages/         # 各板块共享页面组件（zh/en 复用）
│   ├── three/         # aircraft.js 机模构造 / globe.js 地球构造 / orbit.js 轨道控制
│   ├── data/          # destinations / fleet / booking 数据与确定性生成逻辑
│   ├── i18n/          # zh.js / en.js 双语词典
│   └── styles/        # palette.css 设计令牌 / app.css 全局样式
├── routes/            # 页面路由（zh 根路径 + [lang] en 镜像）
└── app.html
static/
├── brand/             # 处理后的标志矢量位图
├── data/land-110m.geojson  # Natural Earth 110m 陆地轮廓（自 world-atlas 转换）
└── img/, og.png, favicon*
```

## 页面结构

`首页` · `订座` · `航点`（3D 地球 + 港原快線专节）· `机上体验` · `机队`（多代机队 + 货机）· `寰宇一家` · `关于我们` · `新闻中心`（12 篇双语文章）· `旅行支援`（含机场沿革）

## 运营识别

| 项目 | 代码 |
| --- | --- |
| IATA 两字码 | BN |
| ICAO 三字码 | BNA |
| 无线电呼号 | HONGHU（鸿鹄） |
| 注册号前缀 | BU- |
| 枢纽 | 原海國際機場 YHI / EBHI |
| 网络 | 110 国际航点 + 6 国内航点，六大洲 |
| 机队 | 现役 89 架：客机十三型（宽体四型＋干线单通道四型＋支线五型）＋货机五型（另 A350F 订购），共 24 架在手订单 |

## 航线与机队的「考证」原则

- 航距与航程匹配：A350-1000ULR 专飞悉尼/墨尔本（约 16,000 km，19 小时级）；奥克蘭大圆距约 18,200 km 超出业载—航程包线，以悉尼一站保护性衔接呈现
- 多代混飞：A330 两代、A321/A321XLR、A321neo 与 C919、C909 与 ERJ-145 均在重叠带内按确定性随机混派；榆關固定 BAe 146、白橋固定 ATR 42、龍城快線固定 A321neo
- 特种运力：An-124 与重建的 An-225「米莉亞二號」构成超大货运能力；757F/767F 负责欧洲与中东夜间快递；历史机队含 CV-440、707、Tu-154M、747SP/-400、A340-300 与协和式
- 快线运行：原海—香港每日四班（BN202/204/208/206，与国泰互挂）+ 夜间货机；原海—龍城每日六班（BN801–811）
- 班期生成完全确定性：同一航线同一日期永远得到相同班表、票价、座位图与 PNR

本站为个人创作性质的虚构航空企划内容。
