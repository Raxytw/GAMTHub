import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './NotFound.module.scss';

export default function NotFound() {

    const navigate = useNavigate();

    const handleGoBack = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <div id='body' className={styles.main}>
            <div className={styles.ti}>
                <img src="/images/back.gif" alt="back" />
                <hr />
                <p>回去吧! 這裡甚麼都沒</p>
                <a href="/#" onClick={handleGoBack}>返回首頁 <FontAwesomeIcon icon={faCaretLeft} /></a>
            </div>
        </div>
    )
}