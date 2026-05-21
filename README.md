# GAMTHub 3

GAMTHub 3 是 GAMTHub 的第三版前端網站，使用 React 建置，整合 Firebase Firestore、外部媒體 API、跑馬燈動畫、打字機文字、瀑布流展示與節日 Canvas 特效。網站主要作為 GAMTHub 社群入口，集中展示社群資訊、公告、作品/媒體牆，以及 Discord、GitHub、GAMTChat、贊助等外部連結。

## 功能特色

- 首頁 Hero 區塊：使用動態背景圖與 Typed.js 打字機文字呈現網站標語。
- 社群資訊區：展示 GAMTHub 介紹、圖片素材與視覺區塊。
- 跑馬燈動畫：透過 `react-fast-marquee` 顯示通話、遊戲、分享、聊天等社群關鍵字。
- 公告列表：從 Firebase Firestore 的 `news` collection 讀取公告並依日期排序。
- 瀑布流媒體牆：從 GAMT API 載入圖片、影片與連結，並支援圖片燈箱預覽。
- 站台統計：從 Firestore 讀取瀏覽數，進站時自動累加。
- 節日效果：每年 1 月 1 日顯示煙火效果，12 月顯示下雪效果。
- 平滑捲動：桌面版使用 Lenis 提供平滑滾動體驗。
- Firebase Hosting：專案已包含 Firebase Hosting 設定。

## 技術棧

- React 19
- Create React App / react-scripts
- react-app-rewired
- Tailwind CSS
- Firebase Firestore
- Axios
- Lenis
- GSAP
- Matter.js
- Typed.js
- react-fast-marquee
- Font Awesome
- Firebase Hosting
- Webpack Obfuscator

## 專案結構

```text
.
├── public/
│   ├── assets/                 # 網站圖片、GIF 等靜態素材
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── bonus/              # 節日 Canvas 特效
│   │   ├── BgMarquees.jsx      # 背景跑馬燈
│   │   ├── HolidayRenderer.jsx # 依日期渲染節日效果
│   │   ├── Marquees.jsx        # 前景跑馬燈
│   │   ├── TypedText.jsx       # 打字機文字元件
│   │   └── WaterfallGallery.jsx# 瀑布流媒體牆
│   ├── fonts/                  # GenSenRoundedTW 字體檔
│   ├── libs/
│   │   ├── firebase.js         # Firebase 初始化
│   │   └── request.js          # Axios request helper
│   ├── App.jsx                 # 主要頁面
│   ├── index.css               # Tailwind 與全域樣式
│   └── index.js                # React 入口
├── config-overrides.js         # production build 混淆設定
├── firebase.json               # Firebase Hosting 設定
├── tailwind.config.js
└── package.json
```

## 安裝與啟動

請先確認本機已安裝 Node.js 與 npm。

```bash
npm install
npm start
```

啟動後預設會開在：

```text
http://localhost:3000
```

## 可用指令

```bash
npm start
```

啟動開發伺服器。

```bash
npm run build
```

建立 production build。此專案使用 `react-app-rewired build`，並在 production 模式透過 `webpack-obfuscator` 進行程式碼混淆。

```bash
npm test
```

啟動 React Testing Library / Jest 測試環境。

```bash
npm run eject
```

執行 Create React App eject。通常不建議使用，除非確定要完全接管 CRA 設定。

## 環境設定

目前 `.env` 內設定：

```env
GENERATE_SOURCEMAP=false
```

這會在 production build 時關閉 sourcemap 產生。

Firebase 設定目前位於：

```text
src/libs/firebase.js
```

若要切換 Firebase 專案，請更新該檔案內的 `firebaseConfig`。

## Firebase 資料需求

網站會讀取 Firestore 中的以下資料：

### `sitestats`

用於站台統計與外部連結。

預期會有類似以下文件：

```text
sitestats/views
sitestats/URLink
```

`views` 文件目前會使用：

```js
{
  player: number
}
```

`URLink` 文件目前會使用：

```js
{
  Github: string,
  Discord: string,
  GAMTChat: string,
  Sponsor: string
}
```

### `news`

用於首頁公告卡片。

每筆公告建議包含：

```js
{
  type: "server" | "activity" | "update" | string,
  createdAt: string,
  title: string,
  subtitle: string
}
```

首頁會依 `createdAt` 由新到舊排序。

## 外部 API

瀑布流媒體牆會呼叫：

```text
https://gamt-api.vercel.app/api/query/v3-image?type=img,video,link
```

回傳資料會被當作圖片、影片或外部連結顯示。建議資料至少包含：

```js
{
  id: string,
  url: string,
  type: "image" | "video" | "link",
  title?: string,
  filename?: string,
  thumbnail?: string
}
```

## 部署

此專案已設定 Firebase Hosting：

```json
{
  "hosting": {
    "site": "gamthub-v3",
    "public": "build"
  }
}
```

部署流程：

```bash
npm run build
firebase deploy
```

如尚未登入 Firebase CLI，請先執行：

```bash
firebase login
```

## 開發注意事項

- `src/index.css` 會載入 `src/fonts.css`，並套用 GenSenRoundedTW 作為主要字體。
- 桌面版會啟用 Lenis 平滑滾動，行動裝置則會停用。
- 12 月會自動顯示下雪 Canvas，1 月 1 日會自動顯示煙火 Canvas。
- `config-overrides.js` 只在 production build 加入 JavaScript obfuscation。
- `public/assets/` 內的圖片與 GIF 是首頁視覺的重要素材，移動或改名後需要同步更新引用路徑。

## License

此專案未在根目錄提供專案授權條款。字體 `GenSenRoundedTW` 隨附 `SIL_Open_Font_License_1.1.txt`，請依該授權使用字體檔案。
