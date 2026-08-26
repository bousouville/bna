# 素材与数据来源致谢

## 字体

- **Inter**（SIL Open Font License 1.1）— Rasmus Andersson
- **Noto Sans TC**（SIL Open Font License 1.1）— Google Noto 项目

以上均通过 @fontsource 打包，本地自托管。

## 地理数据

- **world-atlas / Natural Earth**（Natural Earth 公有领域许可）— `land-110m.json` 经 TopoJSON → GeoJSON 转换后用于航点地球的陆地绘制（`static/data/land-110m.geojson`）

## 依赖库

| 库 | 许可 |
| --- | --- |
| Svelte / SvelteKit | MIT |
| Three.js | MIT |
| d3-geo, topojson-client | ISC |
| adapter-static, vite-plugin-svelte | MIT |
| sharp（构建期素材处理） | Apache-2.0 |

## 品牌素材

品牌标志、单字标等原始位图为项目自有创作素材，位于 `assets/source/`；`scripts/process-assets.mjs` 使用 sharp 完成抠图、反白、favicon 与 OG 图生成。全部站点图形（含矢量单字标 `Mark.svelte`、机身涂装 CanvasTexture、SVG 插画）为程序化重绘。
