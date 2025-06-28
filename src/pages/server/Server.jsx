import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faRobot } from '@fortawesome/free-solid-svg-icons';
import { faFirefox } from '@fortawesome/free-brands-svg-icons';
import styles from './Server.module.scss';

import Loading from '../../widgets/loading/Loading';

export default function Server() {

    const [data, setData] = useState({});
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let userOnlineData = [];
            let discordOnlineData = {};

            try {
                const response = await fetch('https://gamt-api.vercel.app/api/private/GetUserOnline');
                if (!response.ok) {
                    throw new Error('Failed to fetch user online data');
                }
                const data = await response.json();
                userOnlineData = data.data;
            } catch (err) {
                console.log(err);
            }

            try {
                const response = await fetch('https://gamt-api.vercel.app/api/private/GetDiscordOnline');
                if (!response.ok) {
                    throw new Error('Failed to fetch discord online data');
                }
                const data = await response.json();
                discordOnlineData = data.data;
            } catch (err) {
                console.log(err);
                setStatus(false);
                return;
            }

            if (userOnlineData.length === 0) {
                setData(discordOnlineData);
                setStatus(true);
                return;
            }

            const mergedData = discordOnlineData.users.map((user) => {
                const matchingUser = userOnlineData.find((u) => u.id === user.id);
                return {
                    ...user,
                    status: matchingUser ? matchingUser.status : 'offline',
                };
            });

            const datalist = {
                discord_online: discordOnlineData.discord_online,
                discord_members: discordOnlineData.discord_members,
                users: mergedData,
            };

            setData(datalist);
            setStatus(true);
        };

        fetchData();
    }, []);

    return (
        <div id="body" className={styles.main}>
            <div className={styles.title}>
                <h1>服務器人數 </h1>
                <h3>( {status ? `${data.discord_online - 4} / ${data.discord_members - 5}` : '0 / 0'} )</h3>
            </div>
            <div className={styles.total}>
                <p>在線人數 : {status ? data.discord_online - 4 : 0}</p>
                <p>總人數 : {status ? data.discord_members - 5 : 0}</p>
            </div>
            <div className={styles.users}>
                <ul className={styles.group}>
                    {status ? (
                        data.users.map((item, index) => (
                            <li
                                key={index}
                                className={`
                                    ${item.status === 'online' ? styles.online : item.status === 'idle' ? styles.idle : 'offline'} 
                                    ${item.dev ? styles.dev : ''} 
                                    ${item.bot ? styles.bot : ''}
                                    ${item.fox ? styles.fox : ''}
                                `}
                                title={`
                                    ${item.status === 'online' ? '線上' : item.status === 'idle' ? '閒置' : '離線'}
                                `}>
                                <div className={styles.img}>
                                    <img src={item.avatar ? item.avatar : "/images/dclogo.png"} alt={item.nick} />
                                </div>
                                <h3>{item.nick}</h3>
                                {
                                    item.dev &&
                                    item.bot !== true &&
                                    <FontAwesomeIcon icon={faCrown} title='開發者' />
                                }
                                {
                                    item.bot &&
                                    <FontAwesomeIcon icon={faRobot} title='機器人' />
                                }
                                {
                                    item.fox &&
                                    <FontAwesomeIcon icon={faFirefox} title='狐狐' />
                                }
                            </li>
                        ))
                    ) : (
                        <Loading />
                    )}
                </ul>
            </div>
        </div >
    )
}