import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faHeadphones, faPeopleGroup, faComment } from '@fortawesome/free-solid-svg-icons';
import styles from './Home.module.scss';

import Loading from '../../widgets/loading/Loading';

export default function Home({ input }) {

    const [show, setShow] = useState(false);
    const [images, setImages] = useState([]);
    const [mobile, setMobile] = useState(input);

    useEffect(() => {
        const FetchData = async () => {
            try {
                const res = await fetch("https://gamt-api.vercel.app/api/private/GetDiscordImage");
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const data = await res.json();
                setImages(data.data || []);
                setShow(true);
            } catch (err) {
                console.log(err);
            }
        };

        FetchData();
    }, [])

    useEffect(() => {
        setMobile(input);
    }, [input])

    return (
        <div id="body" className={styles.main}>
            <div className={styles.card}>
                <div className={styles.cardbg}>
                    <p>©️ Pixel Jeff</p>
                </div>
                <div className={styles.cardbox}>
                    <h1>GAMTHub</h1>
                    <hr />
                    <p>一個網站，我們的網站</p>
                    <br />
                    <a href="#start">認識我們</a>
                </div>
            </div>
            <div className={styles.content} id="start">
                <div className={styles.server}>
                    <h1>關於 Discord</h1>
                    <div className={styles.msg}>
                        <div className={styles.cc}>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={styles.show1}>
                            <div className={styles.img}>
                                <img src="/images/GAMT.png" alt="Discord server chat interface showing user interactions" />
                            </div>
                            <div className={styles.chat}>
                                <h1>伺服器中<span>多元互動</span></h1>
                                <p>
                                    提供一個讓成員們進行多元交流的
                                    平台。透過語音、文字、圖片及表
                                    情符號等多種互動方式，使用者可
                                    以輕鬆地分享想法、討論話題，並
                                    建立更緊密的社群關係。
                                </p>
                            </div>
                        </div>
                        <div className={styles.show2}>
                            <div className={styles.img}>
                                <img src="/images/See.png" alt="Discord server activities and fun moments with members" />
                            </div>
                            <div className={styles.chat}>
                                <h1>伺服器中<span>每日歡樂</span></h1>
                                <p>
                                    不定時間段晚間組團開黑、玩樂，歡
                                    迎任何人來參與；每日會傳一張梗圖
                                    或是好笑的文章在頻道，歡迎看看。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.dymic}>
                    <div className={styles.marquee}>
                        <div>
                            <FontAwesomeIcon icon={faHeadphones} />
                            <span>通話</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faGamepad} />
                            <span>遊玩</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faComment} />
                            <span>聊天</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faPeopleGroup} />
                            <span>聚會</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faHeadphones} />
                            <span>通話</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faGamepad} />
                            <span>遊玩</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faComment} />
                            <span>聊天</span>
                        </div>
                        <div className={mobile && styles.hide}>
                            <FontAwesomeIcon icon={faPeopleGroup} />
                            <span>聚會</span>
                        </div>
                    </div>
                </div>
                <div className={styles.imgbox}>
                    {show ? (
                        <div className={styles.group}>
                            {images.slice(0, 24).map((item, index) => (
                                <div key={index} className={styles.item}>
                                    {item.url.includes('.mp4') ? (
                                        <video src={item.url} controls alt={item.filename} />
                                    ) : (
                                        <img src={item.url} alt={item.filename} />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        </div >
    )
}