import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Fetch } from './middleware/fetch';
import { CustomError } from './middleware/error';

import Home from './pages/home';
import Server from './pages/server';
import About from './pages/about';
import Error from './pages/error';

import FullLoad from './widgets/full_load';
import Header from './widgets/header';
import Footer from './widgets/footer';

export default function App() {
  const [isLoad, setIsLoad] = useState(false);
  const [isView, setIsView] = useState(true);
  const [isError, setIsError] = useState(false);
  const [status, setStatus] = useState({ home: false, server: false });
  const [isMobile, setIsMobile] = useState(false);
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [online, setOnline] = useState([]);
  const [members, setMembers] = useState(0);
  const [errors, setErrors] = useState([]);
  const isCached = useRef(false);
  const router = useLocation().pathname;

  // Ko-fi
  // useEffect(() => {
  //   if (document.querySelector('script[src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"]')) {
  //     return;
  //   }

  //   const script = document.createElement('script');
  //   script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
  //   script.async = true;
  //   script.onload = () => {
  //     try {
  //       console.log('Ko-fi script loaded successfully!');
  //       if (window.kofiWidgetOverlay) {
  //         console.log('kofiWidgetOverlay is available:', window.kofiWidgetOverlay);
  //         window.kofiWidgetOverlay.draw('raxytw', {
  //           'type': 'floating-chat',
  //           'floating-chat.donateButton.text': 'Donate',
  //           'floating-chat.donateButton.background-color': '#00b9fe',
  //           'floating-chat.donateButton.text-color': '#fff'
  //         });
  //       } else {
  //         console.error('kofiWidgetOverlay is not available!');
  //       }
  //     } catch (error) {
  //       console.error('Error while executing Ko-fi script:', error);
  //     }
  //   };
  //   script.onerror = () => {
  //     console.error('Failed to load Ko-fi script!');
  //   };
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  const fetchAllData = async () => {
    const errorsTemp = [];

    try {
      const [imageResult, dataResult] = await Promise.allSettled([
        FetchImage(),
        FetchData(),
        FetchMembers()
      ]);

      if (imageResult.status === 'rejected') {
        errorsTemp.push(imageResult.reason.errMsg || imageResult.reason.message);
      }
      if (dataResult.status === 'rejected') {
        errorsTemp.push(dataResult.reason.errMsg || dataResult.reason.message);
      }

      await FetchOnline().catch((error) => {
        console.error('FetchOnline failed:', error.errMsg);
        errorsTemp.push(error.errMsg || error.message);
      });

      const hasCriticalError = imageResult.status === 'rejected' || dataResult.status === 'rejected';

      if (hasCriticalError) {
        setErrors(errorsTemp);
        setIsError(true);
      }

      setIsLoad(true);

      if (!hasCriticalError) {
        setTimeout(() => setIsView(false), 1000);
        isCached.current = true;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrors([...errorsTemp, error.errMsg || error.message]);
      setIsError(true);
    }
  };

  const FetchImage = async () => {
    try {
      const data = await Fetch(`/api/private/GetDiscordImage`);
      if (data.data.Code === 400) throw new CustomError('圖片獲取失敗', `Image : ${data.data.Message || '未知錯誤'}`);
      setImages(data.data || []);
      return true;
    } catch (error) {
      console.error('Error fetching image data:', error);
      setStatus({ ...status, home: true })
      throw new CustomError('圖片獲取失敗', error.errMsg || error.message);
    }
  };

  const FetchData = async () => {
    try {
      const data = await Fetch(`/api/private/GetDiscordOnline`);
      if (data.data.Code === 400) throw new CustomError('服務器資訊獲取失敗', `Data : ${data.data.Message || '未知錯誤'}`);
      setData(data.data || []);
      return true;
    } catch (error) {
      console.error('Error fetching data:', error);
      setStatus({ ...status, server: true })
      throw new CustomError('服務器資訊獲取失敗', error.errMsg || error.message);
    }
  };

  const FetchMembers = async () => {
    try {
      const SearchStorage = localStorage.getItem('searches');
      if (SearchStorage && router !== '/') {
        setMembers(SearchStorage)
        return
      }
      const data = await Fetch(`/api/defualt`);
      if (data.data.Code === 400) throw new CustomError('服務器資訊獲取失敗', `Members : ${data.data.Message || '未知錯誤'}`);
      setMembers(data.data.searches || 0);
      localStorage.setItem('searches', data.data.searches);
      return true;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw new CustomError('成員獲取失敗', error.errMsg || error.message);
    }
  }

  const FetchOnline = async () => {
    try {
      const data = await Fetch(`/api/private/GetUserOnline`);
      if (data.data.Code === 400) throw new CustomError('即時狀態獲取失敗', `Online : ${data.data.Message || '未知錯誤'}`);
      setOnline(data.data || []);
      return true;
    } catch (error) {
      console.error('Error fetching online data:', error);
      throw new CustomError('即時狀態獲取失敗', error.errMsg || error.message);
    }
  };

  useEffect(() => {
    if (!isCached.current) {
      fetchAllData();
    } else {
      setIsView(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768 ? true : false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const continueView = () => {
    setIsView(false);
    setIsError(false);
  };

  return (
    <>
      {(isView && router === '/') && <FullLoad status={isLoad} />}
      {isError ? <Error ErrorMsg={errors} onClose={continueView} /> :
        <>
          <Header status={!isView} router={router} isMobile={isMobile} err={status} />
          <Routes>
            <Route path="/" element={<Home status={!isView} images={images} isMobile={isMobile} />} />
            <Route path="/server" element={<Server data={data} online={online} isMobile={isMobile} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer members={members} />
        </>
      }
    </>
  );
}