import React, { useEffect } from 'react';
import styles from './css/image.module.css';

export default function ImageModal({ URL, onClose }) {

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    return (
        <div className={`${styles.modalOverlay} ${URL ? styles.active : ''}`} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <img src={URL} alt="Enlarged" />
            </div>
        </div>
    );
}