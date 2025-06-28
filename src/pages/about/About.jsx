import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import styles from './About.module.scss';

export default function About() {

    const [jsonData, setJsonData] = useState(null);

    useEffect(() => {
        fetch('/json/test.json')
            .then(response => response.json())
            .then(data => setJsonData(data));
    }, [])

    const formatJSON = (data, indent = '　　') => {
        if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
                return (
                    '[\n' +
                    data.map(item => `${indent}${indent}${formatJSON(item, indent)}`).join(',\n') +
                    `\n${indent}]`
                );
            }

            return (
                '{\n' +
                Object.entries(data)
                    .map(([key, value]) => {
                        return `${indent}<span class="${styles.jsonKey}">"${key}":</span> ${formatJSON(value, indent + '  ')}`;
                    })
                    .join(',\n') +
                `\n${indent.slice(0, -2)}}`
            );
        }
        if (typeof data === 'string') {
            return `<span class="${styles.jsonValue}">"${data}"</span>`;
        } else if (typeof data === 'number' || typeof data === 'boolean') {
            return `<span class="${styles.jsonValue}">${data}</span>`;
        } else if (data === null) {
            return `<span class="${styles.jsonValue}">null</span>`;
        }

        return '';
    };

    const handleCopy = (event) => {
        const link = event.currentTarget.getAttribute('data-link');
        navigator.clipboard.writeText(link)
            .then(() => alert(`已複製到剪貼簿 \n${link}`))
            .catch(err => console.error('複製失敗', err));
    }

    return (
        <main id="body" className={styles.main}>
            <div>
                <h1>關於網站</h1>
                <p>
                    本網站旨在提供即時且準確的用戶數據，致力於為使用者提供便捷的服務。在此平台中，用戶無需登錄 Discord 帳號，即可查看其他用戶的在線狀態及其當前遊玩的遊戲。網站致力於簡化用戶體驗，使用戶能夠輕鬆獲取遊戲社群動態，並促進更高效的互動與交流。
                </p>
                <br />
                <p>
                    此功能旨在為遊戲玩家及社群成員提供一個更直觀、便捷的方式來了解彼此的遊戲活動，無需額外的帳號綁定或操作。
                </p>
                <h1>網站服務</h1>
                <h3>GAMTHub Server API 服務 ( Power by vercel )</h3>
                <p>本網站基於 Vercel 架設並運行 API 服務器，為所有用戶及本網站功能提供穩定的 API 支持。</p>
                <p>請注意，需經 <strong>開發者</strong> 授權後，方可向服務器發送請求。</p>
                <p>若需使用，API 請通過 HTTPS 協議訪問以下地址：</p>
                <pre><span> https://gamt-api.vercel.app/ </span></pre>
                <p>並在請求中傳遞您的用戶 ID 作為驗證依據。</p>
                <p>如需更詳細的說明和使用指引，請點擊 <a href="https://gamt-api.vercel.app/docs" target='_blank' rel="noreferrer">這裡</a></p>
                <ol>
                    <li>
                        <h3>api / UserInfo</h3>
                        <h4>接口地址：</h4>
                        <div>
                            <pre> https://gamt-api.vercel.app/api/UserInfo?id=<span>{"[ your_id ]"}</span>&who=<span>{"[ user_id ]"}</span> </pre>
                            <button title='copy' data-link="https://gamt-api.vercel.app/api/UserInfo?id=&who=" onClick={handleCopy}><FontAwesomeIcon icon={faClipboard} /></button>
                        </div>
                        <h4>功能：</h4>
                        <p>獲取指定服務器中的用戶基本資料。</p>
                        <ul>
                            <li>
                                <pre>id</pre>
                                ：您的用戶 ID，用於驗證請求合法性。
                            </li>
                            <li>
                                <pre>who</pre>
                                ：目標用戶的 ID，指定需查詢的對象。
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>api / GroupInfo</h3>
                        <h4>接口地址：</h4>
                        <div>
                            <pre> https://gamt-api.vercel.app/api/GroupInfo?id=<span>{"[ your_id ]"}</span>&group=<span>{"[ group_id ]"}</span> </pre>
                            <button title='copy' data-link="https://gamt-api.vercel.app/api/GroupInfo?id=&grouop=" onClick={handleCopy}><FontAwesomeIcon icon={faClipboard} /></button>
                        </div>
                        <h4>功能：</h4>
                        <p>獲取指定頻道的所有檔案，包括圖片、影片及其他文件。</p>
                        <ul>
                            <li>
                                <pre>id</pre>
                                ：您的用戶 ID，用於驗證請求合法性。
                            </li>
                            <li>
                                <pre>group</pre>
                                ：頻道 ID，指定需查詢的頻道。
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>api / test</h3>
                        <h4>接口地址：</h4>
                        <div>
                            <pre> https://gamt-api.vercel.app/api/test </pre>
                            <button title='copy' data-link="https://gamt-api.vercel.app/api/test" onClick={handleCopy}><FontAwesomeIcon icon={faClipboard} /></button>
                        </div>
                        <h4>功能：</h4>
                        <p>檢測 API 服務器的運行狀況，確認服務是否正常。</p>
                    </li>
                </ol>
                <h3>返回格式</h3>
                <pre dangerouslySetInnerHTML={{
                    __html: formatJSON(jsonData)
                }} />
                <h1>資料安全</h1>
                <p>本網站承諾不會收集或儲存任何用戶數據，用戶的隱私與數據安全將獲得充分保障。</p>
                <p>所有資料的獲取均通過自建的後端站點服務完成，且該資料僅限於特定功能用途，任何未授權的第三方均無法訪問或獲取。</p>
                <pre><span> https://gamt-api.vercel.app/api/private </span></pre>
                <h1>服務條款</h1>
                <p>本網站會收集並處理服務器中之用戶資料，該資料僅用於提供服務所需的功能。如有需要，網站管理者或開發者可依照業務需求與用戶進行聯繫。如用戶希望終止資料顯示，請隨時通知我們，我們將遵照相關規範進行處理。</p>
            </div>
        </main >
    )
}