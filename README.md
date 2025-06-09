# GameHub

<div align="center">
  [![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://gamthub-v2.web.app)  
　[![Deploy Status](https://img.shields.io/badge/deploy-passing-blue)](https://gamthub-v2.web.app)
</div>

## 📌 About
簡介 GameHub 的核心用途與特色功能。

## 🚀 Features
- 遊戲資料瀏覽：標題、封面、分級、類型、敘述、截圖。
- 教學影片整合：內建 YouTube 嵌入播放器。
- 活動公告：支援日期、時間、提醒發布。
- Discord 實況：顯示最新訊息與成員動態。
- PWA 安裝功能：手機/桌面版皆適用。
- Firebase 部署：安全快速上線。

## 🛠 Tech Stack
- **前端**：React + TypeScript  
- **狀態管理**：Redux Toolkit  
- **後端／資料來源**：Firebase Functions + Firestore  
- **部屬／Hosting**：Firebase Hosting  
- **Discord 互動**：Discord API、Webhook／Bot

## 💻 Demo
- 在線預覽：[gamthub-v2.web.app](https://gamthub-v2.web.app)
- PWA 安裝引導：手機或 Chrome「加入主畫面」

## ⚙️ Installation & Setup

```bash
git clone https://github.com/你的帳號/GameHub-V2.git
cd GameHub-V2
npm install
# 本地開發
npm run start
# 編譯打包
npm run build
# 部署
firebase deploy
```

## 🗂 Project Structure
/public        - 靜態資源與 PWA manifest    
/src     
/api         - Firebase Functions       
　　/components  - 可重用元件（遊戲卡、列表、播放器…）        
　　/pages       - 主頁、遊戲詳情、公告頁等        
　　/redux       - Redux slices        
　　index.tsx        
/firebase.json        
/tsconfig.json        
/package.json        

## 📝 License
MIT © 2024 Raxytw
