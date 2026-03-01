import { useRef, useEffect } from "react";

export default function NewYearCanva() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let fireworks = [];
    let particles = [];

    const random = (min, max) => Math.random() * (max - min) + min;

    class Firework {
      constructor() {
        this.x = random(canvas.width * 0.1, canvas.width * 0.9);
        this.y = canvas.height;
        this.targetX = this.x + random(-100, 100);
        this.targetY = random(canvas.height * 0.1, canvas.height * 0.4);

        const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        const speed = random(12, 18);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        this.hue = random(0, 360);
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.x += this.vx;
        this.vy += 0.15;
        this.y += this.vy;

        if (this.vy >= -1) {
          createParticles(this.x, this.y, this.hue);
          fireworks.splice(index, 1);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(
          this.coordinates[this.coordinates.length - 1][0],
          this.coordinates[this.coordinates.length - 1][1]
        );
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    class Particle {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
          this.coordinates.push([this.x, this.y]);
        }
        const angle = random(0, Math.PI * 2);
        const speed = random(1, 10);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.95;
        this.gravity = 0.1;
        this.hue = random(hue - 20, hue + 20);
        this.brightness = random(50, 80);
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
      }

      update(index) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
          particles.splice(index, 1);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(
          this.coordinates[this.coordinates.length - 1][0],
          this.coordinates[this.coordinates.length - 1][1]
        );
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    const createParticles = (x, y, hue) => {
      let particleCount = 60;
      while (particleCount--) {
        particles.push(new Particle(x, y, hue));
      }
    };

    let animationFrameId;

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      let i = fireworks.length;
      while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }

      let j = particles.length;
      while (j--) {
        particles[j].draw();
        particles[j].update(j);
      }

      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }
    };

    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-[100vh] absolute top-0 left-0 z-0">
      <canvas ref={canvasRef} id="newYearCanvas" className="block"></canvas>
    </div>
  );
}