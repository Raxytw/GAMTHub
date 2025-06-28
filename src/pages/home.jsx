import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

import 'animate.css';
import styles from './css/home.module.css';

import HomeTd from '../widgets/home_td';
import Marquee from '../widgets/marquee';
import ImageModal from '../widgets/modal/image';

export default function Home({ status, images, isMobile }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (url) => {
        setSelectedImage(url);
    }

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <main className={`${styles.main} ${status ? styles.active : ''}`}>
            <div className={styles.card}>
                <img src="/assets/images/Mario_live.gif" alt="by Pixel Jeff" />
                <div className={styles.cardbox}>
                    <HomeTd status={status} />
                </div>
                <a href='#main' className={`${status ? 'animate__rotateIn' : ''} animate__animated`}>
                    <FontAwesomeIcon icon={faArrowDown} /> 繼續觀看 <FontAwesomeIcon icon={faArrowDown} />
                </a>
            </div>
            <div id='main'>
                <div className={`${styles.marquee} ${isMobile ? styles.mobile : ''}`}>
                    <Marquee />
                </div>
                <div className={styles.content}>
                    <h1>關於 Discord</h1>
                    <hr />
                    <ul className={isMobile ? styles.mobile : ''}>
                        <li>
                            <img src="/assets/images/ex1.png" alt="多元互動" />
                            <div>
                                <h2>伺服器中<span>多元互動</span></h2>
                                <p>提供一個讓成員們進行多元交流的平台。透過語音、文字、圖片及表情符號等多種互動方式，使用者可 以輕鬆地分享想法、討論話題，並建立更緊密的社群關係。</p>
                            </div>
                        </li>
                        <li>
                            <img src="/assets/images/ex2.png" alt="每日歡樂" />
                            <div>
                                <h2>伺服器中<span>每日歡樂</span></h2>
                                <p>不定時間段晚間組團開黑、玩樂，歡迎任何人來參與；每日會傳一張梗圖或是好笑的文章在頻道，歡迎看看。</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className={styles.images}>
                    <h1>圖片預覽</h1>
                    <hr />
                    <ul>
                        {images.length > 0 ? images.slice(0, isMobile ? 12 : images.length).map((image, index) => (
                            <div key={index} onClick={() => handleImageClick(image.url)}>
                                <img src={image.url} alt={image.filename} title={image.filename} />
                            </div>
                        ))
                            :
                            <div className={styles.empty}>
                                <p>目前沒有圖片</p>
                            </div>
                        }
                    </ul>
                </div>
                <div className={`${styles.marquee} ${isMobile ? styles.mobile : ''}`}>
                    <Marquee />
                </div>
            </div>
            {selectedImage && <ImageModal URL={selectedImage} onClose={closeModal} />}
        </main>
    )
}