import styles from './Loading.module.scss';

export default function Loading() {
    return (
        <div className={styles.main}>
            <img src="/images/Loading.gif" alt="Loading" />
            <h1>資料讀取中</h1>
        </div>
    )
}