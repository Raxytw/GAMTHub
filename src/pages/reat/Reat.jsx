import { useState, useEffect, useRef, useCallback } from 'react';
import { TiDelete } from "react-icons/ti";
import { FaArrowRight } from "react-icons/fa";
import styles from './Reat.module.scss';

import Loading from './loading/Loading';

export default function Reat() {

    const [data, setData] = useState(null);
    const [savedata, setSavedata] = useState(null);
    const [remove, setRemove] = useState(null);
    const [newitem, setNewitem] = useState(null);
    const [draggingItem, setDraggingItem] = useState(null);
    const [viewText, setViewText] = useState("");
    const [isDrawing, setIsDrawing] = useState(false);
    const foodRef = useRef(null);
    const uConfettiRef = useRef(null);
    const CanvasRef = useRef(null);

    // save api
    const updateData = useCallback(async () => {
        if (!data) {
            alert("Data is not available yet. Please try again later.");
            return;
        }
        try {
            await fetch('https://gamt-api.vercel.app/api/private/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.data.status === true) {
                        console.log("update suessful")
                    } else {
                        console.log("update error")
                        setData(savedata)
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
        } catch (e) {
            alert("當前網路不佳，稍後在試")
            console.error(e.message);
        }
    }, [data, savedata])

    // 獲取數據
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetch('https://gamt-api.vercel.app/api/private/reat')
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        setData(data.data);
                        setSavedata(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                    })
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, [])

    useEffect(() => {
        if (data) {
            setSavedata(data);
            updateData();
        }
    }, [data, updateData])

    const createConfetti = () => {

        const uConfetti = uConfettiRef.current;
        const canvas = CanvasRef.current;

        uConfetti.style.position = 'fixed';
        uConfetti.style.top = '0';
        uConfetti.style.left = '0';
        uConfetti.style.width = '100%';
        uConfetti.style.height = '100%';
        uConfetti.style.zIndex = '9999';
        uConfetti.style.pointerEvents = 'none';
        const ctx = canvas.getContext('2d');
        const W = window.innerWidth;
        const H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        const confetti = Array.from({ length: 200 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H - H,
            r: Math.random() * 5 + 2,
            color: ['#ff6f61', '#6bdea5', '#73b3d8', '#ffe680', '#f3a6e8'][Math.floor(Math.random() * 5)],
            o: 1,
            sp: Math.random() * 15 + 8
        }));

        (function draw() {
            ctx.clearRect(0, 0, W, H);
            let particlesLeft = false;
            confetti.forEach(p => {
                p.y += p.sp;
                if (p.y > H * 0.75) p.o -= 0.03;
                if (p.y <= H && p.o > 0) {
                    particlesLeft = true;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                    ctx.fillStyle = p.color.replace(')', `,${p.o})`).replace('rgb', 'rgba');
                    ctx.fill();
                }
            });
            if (particlesLeft) {
                requestAnimationFrame(draw);
            } else {
                uConfetti.style.display = 'none';
            }
        })();
    };

    const triggerConfetti = () => {
        const uConfetti = uConfettiRef.current;
        uConfetti.style.display = 'block';
        createConfetti();
    };

    const handleDraw = () => {
        if (data?.white.length > 0 && !isDrawing) {
            setIsDrawing(true);
            let count = 0;
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * data.white.length);
                const randomItem = data.white[randomIndex];
                setViewText(randomItem);

                count += 1;
                if (count === 100) {
                    clearInterval(interval);
                    moveToBlackAfterDraw(randomItem);
                    triggerConfetti()
                }
            }, 100);
        }
    };

    const moveToBlackAfterDraw = (item) => {
        setRemove(item);
        setTimeout(() => {
            setData((prevData) => {
                const updatedWhite = prevData.white.filter((whiteItem) => whiteItem !== item);
                const updatedBlack = [...prevData.black, item];
                return { black: updatedBlack, white: updatedWhite };
            });
            setRemove(null);

            setTimeout(() => {
                setNewitem(item);
                setTimeout(() => {
                    setNewitem(null);
                }, 500);
            }, 50);
            setIsDrawing(false);
        }, 300);
    };

    // 移除移動
    const moveToWhite = (item) => {
        setRemove(item);
        setTimeout(() => {
            setData((prevData) => {
                const updatedBlack = prevData.black.filter((blackItem) => blackItem !== item);
                const updatedWhite = [...prevData.white, item];
                return { black: updatedBlack, white: updatedWhite };
            });
            setRemove(null);

            setTimeout(() => {
                setNewitem(item);
                setTimeout(() => {
                    setNewitem(null);
                }, 500);
            }, 50);
        }, 300);
    };

    const moveToBlack = (item) => {
        setRemove(item);
        setTimeout(() => {
            setData((prevData) => {
                const updatedWhite = prevData.white.filter((whiteItem) => whiteItem !== item);
                const updatedBlack = [...prevData.black, item];
                return { black: updatedBlack, white: updatedWhite };
            });
            setRemove(null);

            setTimeout(() => {
                setNewitem(item);
                setTimeout(() => {
                    setNewitem(null);
                }, 500);
            }, 50);
        }, 300);
    };

    // 輸入添加食物
    const addFood = () => {
        const newFood = foodRef.current.value;
        if (data.white.includes(newFood)) {
            foodRef.current.value = '';
        } else if (newFood !== '') {
            setData((prevData) => ({
                ...prevData,
                white: [...prevData.white, newFood],
            }));
            foodRef.current.value = '';
            setTimeout(() => {
                setNewitem(newFood);
                setTimeout(() => {
                    setNewitem(null);
                }, 500);
            }, 50);
        }
    };

    // input 觸發添加
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addFood();
        }
    };

    const handleDragStart = (item) => {
        setDraggingItem(item);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add(styles.dragOver);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove(styles.dragOver);
        if (draggingItem) {
            setData((prevData) => {
                const updatedWhite = prevData.white.filter((whiteItem) => whiteItem !== draggingItem);
                const updatedBlack = [...prevData.black, draggingItem];
                return { black: updatedBlack, white: updatedWhite };
            });
            setDraggingItem(null);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.list}>
                <h2>目前抽過</h2>
                <ul
                    className={styles.black}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {Array.isArray(data?.black) ? (
                        data.black.length > 0 ? (
                            data.black.map((item, key) => (
                                <li
                                    key={key}
                                    className={`${newitem === item ? styles.new : ""} ${remove === item ? styles.remove : ""}`}
                                >
                                    <p>{item}</p>
                                    <TiDelete title="刪除" onClick={() => moveToWhite(item)} />
                                </li>
                            ))
                        ) : (
                            <li className={styles.empty}>目前沒有抽過的項目</li>
                        )
                    ) : (
                        <Loading />
                    )}
                </ul>
                <h2>尚未抽過</h2>
                <ul className={styles.white}>
                    {Array.isArray(data?.white) ? (
                        data.white.length > 0 ? (
                            data.white.map((item, key) =>
                                <li
                                    key={key}
                                    draggable
                                    onDragStart={() => handleDragStart(item)}
                                    className={`${newitem === item ? styles.new : ""} ${remove === item ? styles.remove : ""}`}
                                >
                                    <p>{item}</p>
                                    <FaArrowRight title='移出' onClick={() => moveToBlack(item)} />
                                </li>
                            )) :
                            (
                                <li className={styles.empty}>目前沒有抽過的項目</li>
                            )
                    ) :
                        <Loading />
                    }
                </ul>
                <div className={styles.input}>
                    <input type="text" ref={foodRef} onKeyDown={handleKeyPress} placeholder='Input new food...' />
                </div>
            </div>
            <div className={styles.ui}>
                <div ref={uConfettiRef} className={styles.uConfetti} >
                    <canvas ref={CanvasRef}></canvas>
                </div>
                <div className={styles.view}>
                    {viewText}
                </div>
                <div className={styles.cmd}>
                    <button onClick={handleDraw} disabled={data && isDrawing}>🎲 抽 🎲</button>
                </div>
            </div>
        </main >
    )
}