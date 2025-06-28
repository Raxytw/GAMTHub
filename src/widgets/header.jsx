import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import React, { useState, useEffect } from 'react';

import styles from './css/header.module.css';
import 'animate.css';
import { faEject, faHouse, faServer } from '@fortawesome/free-solid-svg-icons';

export default function Header({ status, router, isMobile, err }) {
    const [active, setActive] = useState(false);

    // 動態導航欄
    useEffect(() => {
        const handleScroll = () => setActive(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`animate__animated ${styles.header} ${status ? styles.fadeIn : ''} ${status ? 'animate__fadeInDown' : ''} ${active ? styles.active : ''} ${(router === '/about' || router === '/server') ? styles.show : ''}`}>
            <div className={styles.logo}>
                <div>
                    <img src="./assets/images/logo.png" alt="Logo" />
                </div>
                <h1>GAMT<span>Hub</span></h1>
            </div>
            {!isMobile &&
                <div>
                    <ul>
                        <li className={`${router === '/' ? styles.active : ''} ${err.home ? styles.err : ''}`}>
                            <a href="/" title={err.home ? '發生錯誤' : '就是首頁'}><FontAwesomeIcon icon={faHouse} /> 首頁</a>
                        </li>
                        <li className={`${router === '/server' ? styles.active : ''} ${err.server ? styles.err : ''}`}>
                            <a href="/server" title={err.server ? '發生錯誤' : '關於服務器'}><FontAwesomeIcon icon={faServer} />服務器</a>
                        </li>
                        <li className={router === '/about' ? styles.active : ''}>
                            <a href="/about" title='關於網站'><FontAwesomeIcon icon={faEject} /> 關於</a>
                        </li>
                    </ul>
                </div>
            }
            <div>
                <ul>
                    <li>

                    </li>
                    <li>
                        <a
                            target='_blank'
                            rel="noreferrer"
                            title='Join Discord'
                            href="https://discord.gg/kZqN4hQPNq"
                            className={styles.discord}>
                            <FontAwesomeIcon icon={faDiscord} />
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    )
}