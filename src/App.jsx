import { useEffect, useState, useRef } from "react";
import Lenis from 'lenis';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getDocs, collection, increment, updateDoc, doc } from "firebase/firestore";
import Matter from "matter-js";
import CountUp from 'react-countup';
import TypedText from "./components/TypedText";
import Marquees from "./components/Marquees";
import BgMarquees from "./components/BgMarquees";
import { db } from "./libs/firebase";
import { faArrowRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import WaterfallGallery from "./components/WaterfallGallery";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [stats, setStats] = useState({});
  const [newsList, setNewsList] = useState([]);
  const tvRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const joyRef = useRef(null);

  /* =========================
     LENIS 平滑滾動設定
  ========================== */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      lerp: 0.1,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
    };
  }, []);

  /* =========================
     Firebase 資料抓取
  ========================== */
  useEffect(() => {
    const getData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "sitestats"));
        if (!querySnapshot.empty) {
          let combinedData = {};

          querySnapshot.forEach((doc) => {
            combinedData[doc.id] = doc.data();
          });

          if (combinedData.views && typeof combinedData.views.player === 'number') {
            combinedData.views.player += 1;
          }
          setStats(combinedData);
        }

        await updateDoc(doc(db, "sitestats", "views"), {
          player: increment(1)
        });

        const newsSnapshot = await getDocs(collection(db, "news"));
        let fetchedNews = [];
        newsSnapshot.forEach((doc) => {
          fetchedNews.push({ id: doc.id, ...doc.data() });
        });
        fetchedNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNewsList(fetchedNews);
      } catch (error) {
        console.error("抓取 Firebase 資料時發生錯誤:", error);
      }
    };

    getData();
  }, []);

  /* =========================
     Matter.js 物理引擎與 ScrollTrigger
  ========================== */
  useEffect(() => {
    if (!containerRef.current || !tvRef.current) return;

    const Engine = Matter.Engine,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Body = Matter.Body;

    const engine = Engine.create();
    engine.gravity.y = 1;

    const tvWidth = 150;
    const tvHeight = 130;

    const tvBody = Bodies.rectangle(-1000, -1000, tvWidth, tvHeight, {
      restitution: 0.6,
      friction: 0.1,
      density: 0.05,
      inertia: Infinity,
      isStatic: true
    });

    window.testTvBody = tvBody;
    window.testMatter = Matter;

    let boundaries = [];

    const updateBounds = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const t = 30;

      if (boundaries.length > 0) {
        Composite.remove(engine.world, boundaries);
      }

      boundaries = [
        Bodies.rectangle(w / 2, h + t / 2, w * 2, t, { isStatic: true }),
        Bodies.rectangle(w / 2, -t / 2, w * 2, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, h / 2, t, h * 2, { isStatic: true }),
        Bodies.rectangle(w + t / 2, h / 2, t, h * 2, { isStatic: true })
      ];

      Composite.add(engine.world, boundaries);
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);

    Composite.add(engine.world, [tvBody]);

    if (tvRef.current) {
      tvRef.current.style.transform = `translate(${tvBody.position.x - tvWidth / 2}px, ${tvBody.position.y - tvHeight / 2}px)`;
    }

    const updateEngine = () => {
      Engine.update(engine, 16.66);

      if (tvRef.current) {
        tvRef.current.style.transform = `translate(
          ${tvBody.position.x - tvWidth / 2}px, 
          ${tvBody.position.y - tvHeight / 2}px
        )`;
      }
    };
    gsap.ticker.add(updateEngine);

    /* =========================
       自動計算拋物線發射
    ========================== */
    const launchTV = () => {
      if (!containerRef.current || !joyRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const joyRect = joyRef.current.getBoundingClientRect();

      const startX = containerRect.width - 150;
      let startY = joyRect.top - containerRect.top;
      if (startY < 100) startY = 200;
      if (startY > containerRect.height - 200) startY = containerRect.height - 300;

      Matter.Body.setStatic(tvBody, false);
      Matter.Body.setPosition(tvBody, { x: startX, y: startY });

      Matter.Body.setVelocity(tvBody, { x: -15, y: -10 });

      console.warn(`🚀 [系統] 電視機發射！座標: X:${startX.toFixed(0)}, Y:${startY.toFixed(0)}`);
    };

    window.manualLaunchTV = launchTV;

    const resetTV = () => {
      Body.setStatic(tvBody, true);
      Body.setPosition(tvBody, { x: -1000, y: -1000 });
      console.warn("🔵 [系統] 電視機重置收回");
    };

    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: joyRef.current,
        start: "top 75%",
        markers: false,
        onEnter: () => {
          console.warn("🟢 [Trigger] 往下滾，進入觸發區！");
          launchTV();
        },
        onEnterBack: () => {
          console.warn("🟡 [Trigger] 往上滾，進入觸發區！");
          launchTV();
        },
        onLeave: resetTV,
        onLeaveBack: resetTV
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const targetGravity = self.direction === 1 ? 1.5 : -1.5;
          gsap.to(engine.gravity, {
            y: targetGravity,
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(engine.gravity, {
                y: 1,
                duration: 0.5,
                delay: 0.1,
                overwrite: "auto"
              });
            }
          });
        }
      });
    }, containerRef);

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateBounds);
      ctx.revert();
      gsap.ticker.remove(updateEngine);
      Engine.clear(engine);
    };
  }, []);

  const TitleComponent = ({ title }) => {
    return (
      <div ref={titleRef} className="relative flex items-center justify-center w-[320px] h-[156px]">
        <img src="/assets/textbox.png" alt="textbox" className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none -z-10" />
        <h1 className="text-4xl font-black tracking-wide pb-12">{title}</h1>
      </div>
    )
  }

  const createNewsCard = (news) => {
    const typeStyles = {
      server: {
        label: '系統公告',
        cardHover: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
        gradient: 'from-blue-500/10',
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        textHover: 'group-hover:text-blue-400',
        iconHover: 'group-hover:bg-blue-500/20 group-hover:text-blue-400'
      },
      activity: {
        label: '活動情報',
        cardHover: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
        gradient: 'from-purple-500/10',
        badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        textHover: 'group-hover:text-purple-400',
        iconHover: 'group-hover:bg-purple-500/20 group-hover:text-purple-400'
      },
      update: {
        label: '更新日誌',
        cardHover: 'hover:border-green-500/50 hover:shadow-green-500/10',
        gradient: 'from-green-500/10',
        badge: 'bg-green-500/20 text-green-400 border-green-500/30',
        textHover: 'group-hover:text-green-400',
        iconHover: 'group-hover:bg-green-500/20 group-hover:text-green-400'
      }
    };

    const style = typeStyles[news.type] || {
      label: '其他消息',
      cardHover: 'hover:border-zinc-500/50 hover:shadow-zinc-500/10',
      gradient: 'from-zinc-500/10',
      badge: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
      textHover: 'group-hover:text-zinc-400',
      iconHover: 'group-hover:bg-zinc-500/20 group-hover:text-zinc-400'
    };
    return (
      <div key={news.id} className={`group relative w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-6 transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:-translate-y-1 ${style.cardHover}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${style.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>{style.label}</span>
              <span className="text-zinc-500 text-sm font-medium">{news.createdAt}</span>
            </div>
            <h3 className={`text-2xl font-black text-white transition-colors ${style.textHover}`}>{news.title}</h3>
            <p className="text-zinc-400 text-base font-medium leading-relaxed max-w-3xl">
              {news.subtitle}
            </p>
          </div>
          <div className={`hidden md:flex items-center justify-center p-4 mx-2 bg-zinc-800 rounded-xl transition-all duration-300 border border-zinc-700 group-hover:translate-x-1 ${style.iconHover}`}>
            <FontAwesomeIcon icon={faArrowRight} className={`text-zinc-400 transition-colors ${style.textHover}`} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[999] px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-xl bg-black/40 border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer group">
          <p className="text-2xl md:text-3xl font-black text-[var(--theme-color-1)] tracking-widest">
            GAMT<span className="text-[var(--theme-color-2)]">Hub</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={stats.URLink?.Github ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl active:scale-95 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faGithub} className="text-xl md:text-2xl text-zinc-1000 group-hover:text-white transition-colors duration-300" />
          </a>
          <a
            href={stats.URLink?.Discord ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl active:scale-95 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faDiscord} className="text-xl md:text-2xl text-[#5865F2] group-hover:text-[#ebedff] transition-colors duration-300" />
          </a>
        </div>
      </nav>

      <div className="w-full h-[100vh] flex flex-col items-center justify-center">
        <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">
          <img src="./assets/banner.gif" alt="banner" className="w-full h-full object-cover pointer-events-none" />
        </div>
        <div className="flex flex-col items-center justify-center z-10">
          <p className="text-[8rem] font-bold m-2 text">GAMTHub</p>
          <p><TypedText text={["這裡是 GAMTHub 的小網站", "在這裡你能發現更多", "歡迎來到 GAMTHub 3"]} typeSpeed={50} backSpeed={50} /></p>
        </div>
      </div>

      <Marquees />

      <div ref={containerRef} className="relative w-full overflow-hidden">
        <BgMarquees />

        <div
          ref={tvRef}
          className="absolute z-[100] w-[150px] h-[130px] top-0 left-0 origin-center"
          style={{ willChange: 'transform' }}
        >
          <div className="relative w-full h-full bg-zinc-800 border-[6px] border-zinc-700 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 w-full h-4 bg-zinc-900 border-b-2 border-zinc-700 flex justify-end px-2 items-center gap-1 z-10">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <div className="w-[90%] h-[75%] mt-3 bg-black rounded border-2 border-zinc-900 overflow-hidden relative">
              <img src="/assets/pixel-cat-sticker.gif" alt="tv-content" className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-24 px-[10%] py-24 z-20 relative">
          <TitleComponent title="關於服務器" />

          <div className="w-full flex flex-col xl:flex-row items-start justify-between gap-12">
            <div className="flex flex-col w-[100%] xl:w-[45%] gap-4">
              <h2 className="text-5xl font-black tracking-wide">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6b21a8] to-[#3b82f6]">
                  多元互動
                </span>
              </h2>
              <p className="text-[var(--text-color)] text-lg leading-relaxed font-medium pt-2">
                提供一個讓成員們進行多元交流的平台。透過語音、文字、圖片及表情符號等多種互動方式，使用者可以輕鬆地分享想法、討論話題，並建立更緊密的社群關係。
              </p>

              <div className="w-full flex items-center justify-center">
                <img src="/assets/bird.gif" alt="bird" className="w-64 object-cover" />
              </div>
            </div>

            <div className="w-full xl:w-[45%] overflow-hidden rounded-2xl">
              <img src="./assets/ex1.png" alt="banner" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-12">
            <div className="w-full xl:w-[45%] overflow-hidden rounded-2xl">
              <img src="./assets/ex2.png" alt="banner" className="w-full h-full object-cover" />
            </div>

            <div ref={joyRef} className="flex flex-col w-[100%] xl:w-[45%] gap-4">
              <h2 className="text-5xl font-black tracking-wide">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6b21a8] to-[#3b82f6]">
                  每日歡樂
                </span>
              </h2>
              <p className="text-[var(--text-color)] text-lg leading-relaxed font-medium pt-2">
                不定時間段晚間組團開黑、玩樂，歡迎任何人來參與；每日會傳一張梗圖或是好笑的文章在頻道，歡迎看看。
              </p>
            </div>
          </div>

          <TitleComponent title="一些圖片" />

          <div className="w-full overflow-x-auto relative z-10">
            <WaterfallGallery />
          </div>

          <TitleComponent title="最新消息" />

          <div className="w-full flex flex-col gap-6 z-10 max-w-5xl p-2">
            {newsList.length === 0 ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="w-full bg-zinc-900/50 border-2 border-zinc-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-20 bg-zinc-800 rounded-full"></div>
                      <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                    </div>
                    <div className="h-8 w-3/4 max-w-md bg-zinc-800 rounded"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-full max-w-2xl bg-zinc-800 rounded"></div>
                      <div className="h-4 w-4/5 max-w-xl bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                  <div className="hidden md:flex h-14 w-14 bg-zinc-800 rounded-xl"></div>
                </div>
              ))
            ) : (
              newsList.map((news) => {
                return createNewsCard(news)
              })
            )}

            <div className="w-full flex justify-center mt-4 mb-8">
              <button className="px-8 py-3 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-all active:scale-95 flex items-center gap-2 border border-zinc-600 hover:border-zinc-500 shadow-lg">
                查看更多消息，前往 GAMTChat
                <FontAwesomeIcon icon={faChevronDown} />
              </button>
            </div>
          </div>

          <TitleComponent title="相關項目" />

          <div className="flex flex-col gap-6 w-full max-w-5xl z-10 p-5">
            <a href={stats.URLink?.GAMTChat ?? "#"} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl bg-zinc-900 border-4 border-zinc-700 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 w-full cursor-pointer">
              <div className="flex flex-col gap-3 relative z-10 w-full md:w-4/5">
                <h3 className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
                  GAMTChat 聊天吧
                </h3>
                <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                  專屬於我們的無縫聊天空間！隨時隨地與好朋友哈拉打屁，分享梗圖與生活趣事，享受最流暢的交流互動與最新功能。
                </p>
              </div>
              <div className="mt-6 md:mt-0 relative z-10 bg-zinc-800 p-5 rounded-2xl border-4 border-zinc-700 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-white transition-colors"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <div className="absolute right-0 top-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </a>

            <a href={stats.URLink?.Sponsor ?? "#"} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl bg-zinc-900 border-4 border-zinc-700 hover:border-pink-500 hover:-translate-y-2 transition-all duration-300 w-full cursor-pointer">
              <div className="flex flex-col gap-3 relative z-10 w-full md:w-4/5">
                <h3 className="text-3xl font-black text-white group-hover:text-pink-400 transition-colors">
                  贊助開發
                </h3>
                <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                  喜歡 GAMTHub 嗎？您的支持是我們持續開發與維護伺服器的最大動力。買杯咖啡給開發者，讓更多豐富有趣的功能提早實現！
                </p>
              </div>
              <div className="mt-6 md:mt-0 relative z-10 bg-zinc-800 p-5 rounded-2xl border-4 border-zinc-700 group-hover:bg-pink-500 group-hover:border-pink-400 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-white transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </div>
              <div className="absolute left-0 bottom-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </a>
          </div>
        </div>
      </div>

      <div className="relative w-full h-48 flex items-end">
        <Marquees direction="right" />
        <div className="absolute right-[50px] top-[25px]">
          <img src="/assets/pixel-cat-sticker.gif" alt="pixel-cat-sticker" className="w-32" draggable="false" />
        </div>
      </div>

      <div className="w-full flex items-center justify-between p-10 bg-black">
        <div>
          <img src="/assets/pedro.gif" alt="pedro" className="w-32" draggable="false" />
        </div>
        <div>
          <p className="text-4xl font-bold text-white">GAMT<span className="text-[var(--theme-color-2)]">Hub</span></p>
          <span className="text-white">Copyright &copy; 2024 - {new Date().getFullYear()} By <a className="text-blue-500" href="/">GAMTHub</a>, All right reserved.</span>
          <hr className="my-2" />
          <div className="flex">
            <span className="text-white">總訪問人數 = <CountUp end={stats.views?.player ?? 0} duration={3} /></span>
          </div>
        </div>
      </div>
    </>
  );
}