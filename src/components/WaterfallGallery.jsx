import { useState, useEffect } from 'react';
import makeRequest from "../libs/request";

const MediaContent = ({ item, onImageClick }) => {
  const getFileType = (url, originalType) => {
    if (!url) return originalType || 'link';
    const cleanUrl = url.split('?')[0].split('#')[0];
    const extension = cleanUrl.split('.').pop().toLowerCase();

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];

    if (imageExts.includes(extension)) return 'image';
    if (videoExts.includes(extension)) return 'video';

    return originalType || 'link';
  };

  const fileType = getFileType(item.url, item.type);

  switch (fileType) {
    case 'image':
      return (
        <img
          src={item.url}
          alt={item.filename || "圖片"}
          className="w-full h-auto object-cover hover:opacity-90 transition-opacity cursor-pointer"
          loading="lazy"
          onClick={() => onImageClick && onImageClick(item)}
        />
      );
    case 'video':
      return (
        <video
          controls
          className="w-full h-auto"
          poster={item.thumbnail || ""}
        >
          <source src={item.url} type="video/mp4" />
          您的瀏覽器不支援影片播放。
        </video>
      );
    case 'link':
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-8 bg-zinc-900 border-2 border-zinc-800 hover:border-blue-500 hover:bg-zinc-800/80 transition-all duration-300 group rounded-xl text-center h-full min-h-[200px]"
        >
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <span className="text-blue-400 font-bold group-hover:text-blue-300 break-all text-sm truncate w-full px-2">
            {item.title || item.url}
          </span>
          <span className="mt-3 text-zinc-500 text-xs font-bold px-3 py-1 border border-zinc-700 rounded-full group-hover:border-zinc-500 transition-colors">
            點擊前往連結
          </span>
        </a>
      );
    default:
      return <div className="p-4 text-gray-500">不支援的格式</div>;
  }
};

const WaterfallGallery = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (selectedImage && !isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage, isClosing]);

  const handleCloseLightbox = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedImage(null);
      setIsClosing(false);
    }, 300);
  };

  /*  ========================
      獲取基本資訊
  ==========================*/
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await makeRequest("GET", "/api/image?type=img,video,link");
  //       setBasicInfo(res);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getData();
  // }, [])

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await makeRequest("GET", "https://gamt-api.vercel.app/api/private/GetDiscordImage");
        setItems(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getData();
  }, [])

  const skeletonHeights = ['h-48', 'h-64', 'h-40', 'h-80', 'h-56'];

  return (
    <div className="w-full relative z-10">
      <div className="p-4 columns-2 md:columns-3 xl:columns-4 gap-4">
        {isLoading ?
          Array.from({ length: 20 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className={`w-full bg-gray-200 rounded-xl animate-pulse break-inside-avoid mb-4 ${skeletonHeights[index % skeletonHeights.length]
                }`}
            />
          ))
          :
          items.map((item) => (
            <div
              key={item.id}
              className="w-full break-inside-avoid mb-4 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              <MediaContent item={item} onImageClick={setSelectedImage} />
            </div>
          ))}
      </div>

      {/* 圖片放大 Lightbox */}
      {selectedImage && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12 ${isClosing ? 'animate-[fadeOut_0.3s_ease-out_forwards]' : 'animate-[fadeIn_0.3s_ease-out_forwards]'
            }`}
          onClick={handleCloseLightbox}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeOut {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            @keyframes scaleDown {
              from { transform: scale(1); opacity: 1; }
              to { transform: scale(0.95); opacity: 0; }
            }
          `}</style>

          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* 關閉按鈕 */}
            <button
              className="fixed top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 z-[110] transition-colors rounded-full hover:bg-white/10"
              onClick={handleCloseLightbox}
              title="關閉"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <img
              src={selectedImage.url}
              alt={selectedImage.filename || "圖片放大"}
              className={`max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg select-none ${isClosing ? 'animate-[scaleDown_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]' : 'animate-[scaleUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]'
                }`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterfallGallery;