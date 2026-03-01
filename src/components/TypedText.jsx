import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function TypedText({ text, loop = false, typeSpeed = 100, backSpeed = 100 }) {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: text,
      typeSpeed,
      backSpeed,
      loop,
    })

    return () => {
      typed.destroy();
    }
  }, [text, loop, typeSpeed, backSpeed])

  return <span ref={el} />
}