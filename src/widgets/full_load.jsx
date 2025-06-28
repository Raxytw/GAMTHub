import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

import styles from './css/full_load.module.css';

export default function FullLoad({ status }) {
    return (
        <div className={`${styles.load} ${status ? styles.fadeOut : ''}`}>
            <div>
                <div className={styles.wrapper}>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.shadow}></div>
                    <div className={styles.shadow}></div>
                    <div className={styles.shadow}></div>
                </div>
                <div className={styles.text}>
                    <FontAwesomeIcon icon={faBolt} />
                    <p><strong>Loading... </strong></p>
                    <FontAwesomeIcon icon={faBolt} />
                </div>
            </div>
        </div>
    );
}