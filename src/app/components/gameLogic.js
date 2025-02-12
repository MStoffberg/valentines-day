'use client';

import { useEffect, useRef, useState } from 'react';

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    const playerImage = new Image();
    playerImage.src = '/images/kitty-player.png';

    const enemyImages = [
      '/images/enemys/enemy2.png',
      '/images/kitty-enemy.png',
      '/images/enemys/enemy3.png',
      '/images/enemys/enemy4.png',
    ];

    const shootSound = new Audio('/sounds/shoot.mp3');
    const hitSound = new Audio('/sounds/alienshort.mp3');

    let player = { x: 375, y: 550, width: 50, height: 50, speed: 5 };
    let bullets = [];
    let enemies = [];
    let alive = [];
    let gameOver = false;
    let enemySpeed = 0.3;
    const dangerLineY = 500;

    const spawnEnemies = () => {
      enemies = [];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
          let enemy = {
            x: 50 + j * 80,
            y: 50 + i * 40,
            width: 40,
            height: 40,
            img: new Image(),
            alive:true
          };
          enemy.img.src = enemyImages[Math.floor(Math.random() * enemyImages.length)];
          enemies.push(enemy);
        }
      }
    };

    spawnEnemies();

    const keys = {};
    const handleKeyDown = (e) => (keys[e.key] = true);
    const handleKeyUp = (e) => (keys[e.key] = false);

    const update = () => {
    
      if (gameOver) return;

      // Player movement
      if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
      if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
      if (keys[' ']) {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 5, height: 10 });
        shootSound.play();
        keys[' '] = false;
      }

      // Keep player within bounds
      player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

      // Move bullets
      bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
      });

      // Move enemies
      enemies.forEach((enemy) => {
        enemy.y += enemySpeed;
      });

      // Check for bullet collisions
      bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y &&
            enemy.alive
          ) {
            console.log(enemies)
            enemy.alive = false;
            enemies.splice(enemyIndex, 1);
            bullets.splice(bulletIndex, 1);
            hitSound.play();
            setScore((prev) => prev + 100);
          }
        });
      });

      // Check if enemies reach the danger line
      let anyAliveEnemy = enemies.some((enemy) => enemy.alive);
      
      if (anyAliveEnemy) {
        // Check if any alive enemy has reached or crossed the danger line
        let enemyCrossedDangerLine = enemies.some(
          (enemy) => enemy.alive && enemy.y + enemy.height >= dangerLineY
        );
        if (enemyCrossedDangerLine) {
          console.log("Game Over! An enemy reached the danger line.");
          setShowGameOverPopup(true);
          gameOver = true;
        }
      }

      // Spawn a new wave when all enemies are defeated
      if (enemies.length === 0) {
        setScore((prev) => prev + 500); // Bonus points for clearing wave
        enemySpeed += 0.2; // Increase difficulty
        spawnEnemies();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw danger line
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, dangerLineY);
      ctx.lineTo(canvas.width, dangerLineY);
      ctx.stroke();

      // Draw player
      ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

      // Draw bullets
      ctx.fillStyle = 'red';
      bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      // Draw enemies
      enemies.forEach((enemy) => {
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
      });
    };

    const gameLoop = () => {
      update();
      draw();
      if (!gameOver) requestAnimationFrame(gameLoop);
    };

    gameLoop();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="game-container">
      <h1>Kitty Space Invaders</h1>
      <div className="canvas-container">
        <canvas ref={canvasRef} width={800} height={600} />
      </div>
      <div className="score">Score: {score}</div>

      {/* Game Over Popup */}
      {showGameOverPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Game Over!</h2>
            <p>Good job My cutie pie</p>
            <p>Your score: {score}</p>
            <button onClick={() => window.location.reload()}>Restart</button>
            <button onClick={() => (window.location.href = '/')}>Return to Main Menu</button>
          </div>
        </div>
      )}

      {/* Win Popup */}
      {showWinPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>You Win!</h2>
            <p>Your score: {score}</p>
            <button onClick={() => window.location.reload()}>Play Again</button>
            <button onClick={() => (window.location.href = '/')}>Return to Main Menu</button>
          </div>
        </div>
      )}

      {/* Controls Popup */}
      {showControls && (
        <div className="popup">
          <div className="popup-content">
            <h2>Controls</h2>
            <p>To Move Left cutie just hit : 'A' or Left Arrow</p>
            <p>And for Right use these baby: 'D' or Right Arrow</p>
            <p>To pew pew them use: Spacebar</p>
            <button onClick={() => setShowControls(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="game-controls">
        <button onClick={() => window.location.reload()}>reset</button>
        <button onClick={() => setShowControls(true)}>how to play</button>
        <button onClick={() => (window.location.href = '/')}>Return to Main Menu</button>
      </div>
    </div>
  );
};

export default SpaceInvaders;
