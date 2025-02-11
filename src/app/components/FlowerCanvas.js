"use client";
import { useEffect, useRef } from "react";
export default function FlowerCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const flowerImages = [
      "/images/flowers/purple-flower.png",
      "/images/flowers/pink-flower.png",
      "/images/flowers/blue-flower.png",
      "/images/flowers/purpleblue-flower.png",
      "/images/flowers/yellow-flower.png",
    ];

    const flowers = [];
    const glitters = [];
    const loadedImages = [];

    function preloadImages() {
      return flowerImages.map((src) => {
        const img = new Image();
        img.src = src;
        return img;
      });
    }

    class Flower {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)];
      }
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
      }
      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = -this.size;
          this.x = Math.random() * canvas.width;
          this.image = loadedImages[Math.floor(Math.random() * loadedImages.length)];
        }
      }
    }

    class Glitter {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.color = `rgba(255, 255, 255, ${this.opacity})`; // Glitter color
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
    }

    function startAnimation() {
      for (let i = 0; i < 15; i++) {
        flowers.push(new Flower());
      }
      for (let i = 0; i < 50; i++) {
        glitters.push(new Glitter());
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        flowers.forEach((flower) => {
          flower.update();
          flower.draw();
        });
        glitters.forEach((glitter) => {
          glitter.update();
          glitter.draw();
        });
        requestAnimationFrame(animate);
      }
      animate();
    }

    loadedImages.push(...preloadImages());
    Promise.all(loadedImages.map((img) => new Promise((res) => (img.onload = res)))).then(startAnimation);
  }, []);

  return <canvas ref={canvasRef} className="flower-canvas" />;
}
