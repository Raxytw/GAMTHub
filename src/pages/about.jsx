import styles from './css/about.module.css';

export default function About() {
    return (
        <main className={styles.main}>
            <div>
                <h1>關於網站</h1>
                <p>本網站旨在提供即時且準確的用戶數據，致力於為使用者提供便捷的服務。在此平台中，用戶無需登錄 Discord 帳號，即可查看其他用戶的在線狀態及其當前遊玩的遊戲。網站致力於簡化用戶體驗，使用戶能夠輕鬆獲取遊戲社群動態，並促進更高效的互動與交流。</p>
                <p>此功能旨在為遊戲玩家及社群成員提供一個更直觀、便捷的方式來了解彼此的遊戲活動，無需額外的帳號綁定或操作。</p>
            </div>
            <div>
                <h1>網站服務</h1>
                <h3>GAMTHub Server API 服務 ( Power by vercel )</h3>
                <p>網站基於 Vercel 架設並運行 API 服務器，為所有用戶及本網站功能提供穩定的 API 支持。</p>
                <p>請注意，需經 <strong>開發者</strong> 授權後，方可向服務器發送請求。</p>
                <p>若需使用，API 請通過 HTTPS 協議訪問以下地址：</p>
                <pre>
                    https://gamt-api.vercel.app/
                </pre>
                <p>並在請求中傳遞您的用戶 ID 作為驗證依據。</p>
                <p>如需更詳細的說明和使用指引，請點擊 如需更詳細的說明和使用指引，請點擊 <a href=" https://gamt-api.vercel.app/doc">這裡</a></p>
            </div>
            <div>
                <h1>資料安全</h1>
                <p>本網站承諾不會收集或儲存任何用戶數據，用戶的隱私與數據安全將獲得充分保障。</p>
                <p>所有資料的獲取均通過自建的後端站點服務完成，且該資料僅限於特定功能用途，任何未授權的第三方均無法訪問或獲取。</p>
                <pre>
                    https://gamt-api.vercel.app/api/private
                </pre>
            </div>
            <div>
                <h1>服務條款</h1>
                <p>本網站會收集並處理服務器中之用戶資料，該資料僅用於提供服務所需的功能。如有需要，網站管理者或開發者可依照業務需求與用戶進行聯繫。如用戶希望終止資料顯示，請隨時通知我們，我們將遵照相關規範進行處理。</p>
            </div>
        </main>
    )
}