import styles from '../Reat.module.scss'

export default function Loading() {
    return (
        <div className={styles.loader}>
            <div className={styles.line}></div>
        </div>
    )
}