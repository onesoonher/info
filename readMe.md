# 何萬順教授個人網站

何萬順教授之學術與出版資訊之靜態網站，以繁體中文為預設介面，並提供英文介面切換。

## 線上網址

- **GitHub Pages：** [https://onesoonher.github.io/info/index.html](https://onesoonher.github.io/info/index.html)

## 技術概要

- 靜態 HTML、CSS、JavaScript（無建置步驟）
- 介面多語系：`js/i18n.js` 搭配 `i18n/zh-Hant.json`、`i18n/en.json`；網址可帶 `?lang=en` 分享英文版
- 樣式與元件：Bootstrap、自訂 `css/main.css` 等
- 部署：GitHub Pages

## 專案結構（精簡）

| 路徑 | 說明 |
|------|------|
| `index.html` | 首頁 |
| `experience.html` | 學歷經歷 |
| `research.html` | 學術研究 |
| `publications.html` | 出版著作與搜尋 |
| `css/` | 全站樣式 |
| `js/main.js` | 導航、捲動等 |
| `js/i18n.js` | 語系切換與字典套用 |
| `i18n/*.json` | 可翻譯之 UI 字串 |
| `publication/` | 著作 PDF |
| `img/` | 圖片資源 |

## 本機預覽

在專案根目錄啟動任一靜態檔伺服器即可，例如：

```bash
npx --yes serve .
```

瀏覽器開啟提示的本機網址（通常為 `http://localhost:3000`），並開啟 `index.html`。

## 維護說明

較完整的更新守則（內容、i18n、著作 PDF、獎項區塊等）見專案內 **[doc.md](./doc.md)**。

## 維護者

- [katie5413](https://github.com/katie5413)
