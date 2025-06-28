import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMugSaucer } from '@fortawesome/free-solid-svg-icons';
import styles from './Header.module.scss';

export default function Header({ pathname, input }) {

    const [path, setPath] = useState('/');
    const [isMobile, setIsMobile] = useState(input);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        setIsMobile(input);
    }, [input])

    useEffect(() => {
        setPath(pathname);
    }, [pathname])

    function Switch() {
        setStatus(!status);
    }

    return (
        <div className={styles.main}>
            <div className={styles.left}>
                <h1><a href="./" title='點我調轉首頁'>GAMT<span>Hub</span></a></h1>
                {isMobile ? (
                    <div className={styles.phone}>
                        <div onClick={Switch}>
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                        <ul className={!status && styles.hide}>
                            <li className={path === '/' && styles.this}><a href="/" title='首頁'>/ 首頁</a></li>
                            <li className={path === '/Server' && styles.this}><a href="/Server" title='伺服器狀態'>/ 服務器狀態</a></li>
                            <li className={path === '/About' && styles.this}><a href="/About" title='關於網站'>/ 關於網站</a></li>
                            <li className={path === '/Join' && styles.this}><a href="/Join" title='加入 Discord'>/ 加入</a></li>
                        </ul>
                    </div>
                ) : (
                    <div className={styles.nav}>
                        <ul>
                            <li className={path === '/' && styles.this}><h4><a href="/" title='首頁'>/ 首頁</a></h4></li>
                            <li className={path === '/Server' && styles.this}><h4><a href="/Server" title='伺服器狀態'>/ 服務器狀態</a></h4></li>
                            <li className={path === '/About' && styles.this}><h4><a href="/About" title='關於網站'>/ 關於網站</a></h4></li>
                            <li className={path === '/Join' && styles.this}><h4><a href="/Join" title='加入 Discord'>/ 加入</a></h4></li>
                        </ul>
                    </div>
                )
                }
            </div>
            <div className={styles.right}>
                <a href="https://buymeacoffee.com/raxytw" target='_blank' rel="noreferrer" title='贊助我一點錢:3' className={isMobile ? styles.hide : ''}>By me a Coffee!</a>
                <a href="https://buymeacoffee.com/raxytw" target='_blank' rel="noreferrer" title='贊助我一點錢:3' className={!isMobile ? styles.hide : ''}>
                    <FontAwesomeIcon icon={faMugSaucer} />
                </a>
            </div>
        </div >
    )
}