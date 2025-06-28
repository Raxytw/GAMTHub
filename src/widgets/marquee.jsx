import { faComment, faGamepad, faHeadphones, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Marquee() {
    return (
        <ul>
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
            <div>
                <FontAwesomeIcon icon={faPeopleGroup} />
                <span>聚會</span>
            </div>
        </ul>
    )
}