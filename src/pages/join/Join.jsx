import { useEffect } from 'react';
import styles from './Join.module.scss';

export default function Join() {
    const url = 'https://discord.gg/kZqN4hQPNq';

    useEffect(() => {
        window.location.href = url;
    }, []);

    return (
        <div id="body" className={styles.main}>
            <h1>跳轉至 Discord 連結</h1>
            <div>
                <img src="/images/qrcode.png" alt="掃描 QRCode 加入" />
            </div>
            <p>沒跳轉 ? <a href={url}>這裡</a></p>
            <span>copyright &copy; 2024 by GAMTHub</span>
        </div>
    );
}