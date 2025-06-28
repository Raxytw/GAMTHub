import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import styles from './css/footer.module.css';

export default function Footer({ members }) {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div>
                <h1>製作團隊</h1>
                <hr />
                <p>專注於 Discord 服務器網站開發的創意團隊，致力於為每一個服務器打造專屬的數位門面。無論您是管理遊戲社區、學術論壇、粉絲群組還是專業協作平台，我們都能根據您的需求，設計出兼具功能性與美觀的網站，提升用戶體驗。</p>
                <p>在社群平台的背後，提供一個專業且引人入勝的窗口，讓更多人了解您的 Discord 服務器，並快速加入其中。我們相信，一個優秀的網站，不僅能提升服務器的形象，還能促進更高效的社群互動。</p>
                <p>加入我們，讓您的 Discord 服務器更具吸引力！</p>
            </div>
            <hr />
            <span><FontAwesomeIcon icon={faUserGroup} /> {members}</span>
            <hr />
            <span>CopyRight &copy; 2024 - {year} By <a href="/">GAMTHub</a></span>
        </footer>
    )
}