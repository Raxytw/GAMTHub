import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function HomeTd({ status }) {
    const tdRef = useRef(null);

    useEffect(() => {
        if (status) {
            const typed = new Typed(tdRef.current, {
                strings: ["一個網站，我們的網站", "你知道這是 2.0 網站？", "GAMTHub 2.0 正式上線！", "歡迎來到 GAMTHub 2.0"],
                typeSpeed: 50,
                backSpeed: 50,
                showCursor: false,
                loop: false
            });

            return () => {
                typed.destroy();
            };
        }
    }, [status]);

    return (
        <div>
            <h1>GAMTHub</h1>
            <span ref={tdRef} />
        </div>
    )
}