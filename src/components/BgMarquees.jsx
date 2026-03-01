import Marquee from "react-fast-marquee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSteam } from "@fortawesome/free-brands-svg-icons";
import { faDiceD6, faShareNodes, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

export default function BgMarquees({ gradient = false }) {
  const iconList = [
    { name: "通話", icon: faVolumeHigh },
    { name: "遊戲", icon: faDiceD6 },
    { name: "分享", icon: faShareNodes },
    { name: "聊天", icon: faSteam }
  ];

  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none select-none">

      {/* 旋轉角度可以讓背景看起來更有設計感，例如 -5度 或 -12度 */}
      <div className="rotate-[-12deg] scale-125 opacity-[0.03]">
        <Marquee
          speed={50} // 作為背景，速度慢一點比較不刺眼
          gradient={gradient}
          autoFill={true}
        >
          <div className="flex items-center gap-20 py-10">
            {iconList.map((item, index) => (
              <div key={index} className="flex items-center gap-6 text-[8rem] font-black italic uppercase">
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </Marquee>
      </div>

      {/* 如果需要多行，可以再複製一個反向滾動的 Marquee */}
    </div>
  );
}