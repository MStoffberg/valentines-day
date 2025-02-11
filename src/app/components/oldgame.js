"use client";

import { useEffect, useRef, useState } from "react";

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [enemies, setEnemies] = useState([]);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const playerImage = new Image();
    playerImage.src = "/images/kitty-player.png";

    const enemyImages = [
      "/images/enemys/enemy2.png",
      "/images/kitty-enemy.png",
      "/images/enemys/enemy3.png",
      "/images/enemys/enemy4.png",
    ];

    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 60,
      width: 50,
      height: 50,
      dx: 0,
      speed: 5,
    };

    const bullets = [];
    const bulletSpeed = 5;

    // Generate Enemies Once at Game Start
    if (enemies.length === 0) {
      const enemyRows = 3;
      const enemyColumns = 8;
      const enemyWidth = 40;
      const enemyHeight = 40;
      const enemyPadding = 20;
      const enemyOffsetTop = 30;
      const enemyOffsetLeft = 30;
      const newEnemies = [];

      for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyColumns; col++) {
          const x = col * (enemyWidth + enemyPadding) + enemyOffsetLeft;
          const y = row * (enemyHeight + enemyPadding) + enemyOffsetTop;
          const img = new Image();
          img.src = enemyImages[Math.floor(Math.random() * enemyImages.length)];
          newEnemies.push({ x, y, width: enemyWidth, height: enemyHeight, image: img });
        }
      }
      setEnemies(newEnemies);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Player
      ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

      // Draw Bullets
      ctx.fillStyle = "#FF1493";
      bullets.forEach((bullet) => ctx.fillRect(bullet.x, bullet.y, 5, 10));

      // Draw Enemies
      enemies.forEach((enemy) => ctx.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height));
    }

    function update() {
      player.x += player.dx;
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

      bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y + 10 < 0) bullets.splice(index, 1);
      });
    }

    function gameLoop() {
      if (gameOver) return;
      draw();
      update();
      requestAnimationFrame(gameLoop);
    }

    function handleKeyDown(e) {
      if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
      if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
      if (e.key === " ") bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
    }

    function handleKeyUp() {
      player.dx = 0;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  return (
    <div style={{ textAlign: "center" }}>
      {!gameStarted ? (
        <button
          onClick={() => setGameStarted(true)}
          style={{ padding: "10px 20px", fontSize: "20px", cursor: "pointer" }}
        >
          Start Game
        </button>
      ) : (
        <canvas ref={canvasRef} width={800} height={600} />
      )}
    </div>
  );
};

export default SpaceInvaders;
