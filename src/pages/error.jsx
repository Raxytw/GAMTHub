import styles from './css/error.module.css';

export default function Error({ ErrorMsg, onClose }) {
    return (
        <main className={styles.main}>
            <div className={styles.card}>
                <div className={styles.cardbox}>
                    <h1>發生錯誤</h1>
                    <ul>
                        {ErrorMsg.length > 0 && ErrorMsg.map((error, index) => (
                            <li key={index}>
                                錯誤 {index + 1} :
                                <br />
                                {error}
                            </li>
                        ))}
                    </ul>
                    <p>抱歉，發生錯誤，請稍後再試。</p>
                    <button onClick={onClose}>嘗試加載，返回</button>
                </div>
            </div>
        </main>
    )
}