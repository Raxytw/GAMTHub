import { useRef, useEffect } from "react";

export default function SnowCanva() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const particles = [];
    const maxParticles = 200;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random() * 0.5 + 0.3,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 2 + 1,
        radius: Math.random() * 3 + 1,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.03 + 0.01
      });
    }

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < maxParticles; i++) {
        let p = particles[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
        ctx.fill();
      }
      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    const update = () => {
      for (let i = 0; i < maxParticles; i++) {
        let p = particles[i];
        p.sway += p.swaySpeed;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.sway) * 0.5;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 10) {
          p.x = -10;
        } else if (p.x < -10) {
          p.x = canvas.width + 10;
        }
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-[100vh] absolute top-0 left-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} id="snowCanvas" className="block"></canvas>
    </div>
  );
}
