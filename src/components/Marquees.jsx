import Marquee from "react-fast-marquee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faDiceD6, faPaw, faShareNodes, faVolume } from "@fortawesome/free-solid-svg-icons";

const ICON_LIST = [
  { name: "通話", icon: faVolume },
  { name: "遊戲", icon: faDiceD6 },
  { name: "分享", icon: faShareNodes },
  { name: "聊天", icon: faComment },
  { name: "爪", icon: faPaw },
];

export default function Marquees({ direction = "left", gradient = true }) {

  return (
    <Marquee
      speed={100}
      gradient={gradient}
      direction={direction}
      loop={0}
      pauseOnHover={true}
      autoFill={true}
      gradientColor={[142, 45, 226]}
      className="bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white"
    >
      <div className="flex items-center gap-12 p-6 opacity-50">
        {ICON_LIST.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-2xl">
            <FontAwesomeIcon icon={item.icon} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </Marquee>
  );
}