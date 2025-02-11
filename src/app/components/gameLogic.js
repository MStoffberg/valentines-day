"use client"; // Mark as a Client Component

import { useEffect, useRef, useState } from 'react';

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const enemiesRef = useRef([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [enemySpeed, setEnemySpeed] = useState(1);
  const [randomMovement, setRandomMovement] = useState(false);
  const [hardModeEnabled, setHardModeEnabled] = useState(false);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [showGameOverPopup, setShowGameOverPopup] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [impactEffects, setImpactEffects] = useState([]);

  // Load images
  const playerImage = new Image();
  const enemyImage = new Image();
  playerImage.src = '/images/kitty-player.png';
  enemyImage.src = '/images/kitty-enemy.png';

  // Load sound effects
  const shootSound = new Audio('/sounds/shoot.mp3');
  const hitSound = new Audio('/sounds/alienshort.mp3');

  // Game variables
  const player = useRef({
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
  });

  const bullets = useRef([]);
  const bulletSpeed = 5;

  const enemyRows = 3;
  const enemyColumns = 8;
  const enemyWidth = 40;
  const enemyHeight = 40;
  const enemyPadding = 20;
  const enemyOffsetTop = 30;
  const enemyOffsetLeft = 30;

  const enemyImages = [
    "/images/enemys/enemy2.png",
    "/images/kitty-enemy.png",
    "/images/enemys/enemy3.png",
    "/images/enemys/enemy4.png",
  ];

  // Initialize enemies
  const initializeEnemies = () => {
    if (enemiesRef.current.length === 0) {
      for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyColumns; col++) {
          const x = col * (enemyWidth + enemyPadding) + enemyOffsetLeft;
          const y = row * (enemyHeight + enemyPadding) + enemyOffsetTop;
          const randomImage = enemyImages[Math.floor(Math.random() * enemyImages.length)];
          enemiesRef.current.push({ x, y, width: enemyWidth, height: enemyHeight, image: randomImage });
        }
      }
    }
  };

  // Draw player
  const drawPlayer = (ctx) => {
    ctx.drawImage(playerImage, player.current.x, player.current.y, player.current.width, player.current.height);
  };

  // Draw bullets
  const drawBullets = (ctx) => {
    ctx.fillStyle = '#FF1493';
    bullets.current.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
  };

  // Draw enemy bullets
  const drawEnemyBullets = (ctx) => {
    ctx.fillStyle = '#FF0000';
    enemyBullets.forEach((bullet) => {
      ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
  };

  // Draw enemies
  const drawEnemies = (ctx) => {
    enemiesRef.current.forEach((enemy) => {
      const img = new Image();
      img.src = enemy.image;
      ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
  };

  // Draw impact effects
  const drawImpactEffects = (ctx) => {
    impactEffects.forEach((effect, index) => {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(effect.x, effect.y, 10, 10);
      effect.duration--;

      if (effect.duration <= 0) {
        impactEffects.splice(index, 1);
      }
    });
  };

  // Update player position
  const updatePlayer = () => {
    player.current.x += player.current.dx;

    // Prevent player from moving out of bounds
    if (player.current.x < 0) player.current.x = 0;
    if (player.current.x + player.current.width > canvasRef.current.width) {
      player.current.x = canvasRef.current.width - player.current.width;
    }
  };

  // Update bullets
  const updateBullets = () => {
    bullets.current.forEach((bullet, index) => {
      bullet.y -= bulletSpeed;

      // Remove bullet if it goes off screen
      if (bullet.y + 10 < 0) {
        bullets.current.splice(index, 1);
      }
    });
  };

  // Update enemy bullets
  const updateEnemyBullets = () => {
    enemyBullets.forEach((bullet, index) => {
      bullet.y += bulletSpeed;

      // Remove bullet if it goes off screen
      if (bullet.y > canvasRef.current.height) {
        enemyBullets.splice(index, 1);
      }

      // Check if enemy bullet hits the player
      if (
        bullet.x < player.current.x + player.current.width &&
        bullet.x + 5 > player.current.x &&
        bullet.y < player.current.y + player.current.height &&
        bullet.y + 10 > player.current.y
      ) {
        setGameOver(true);
        setShowGameOverPopup(true);
        hitSound.play();
      }
    });
  };

  // Update enemies
  const updateEnemies = () => {
    let enemySpeedLocal = enemySpeed; // Use a local variable for speed
  
    enemiesRef.current.forEach((enemy) => {
      if (randomMovement) {
        enemy.x += (Math.random() - 0.5) * enemySpeedLocal * 2; // Random movement
      } else {
        enemy.x += enemySpeedLocal; // Normal movement
      }
  
      // Reverse direction if enemies hit the edge
      if (enemy.x + enemy.width > canvasRef.current.width || enemy.x < 0) {
        enemySpeedLocal *= -1; // Reverse direction locally
        enemiesRef.current.forEach((e) => {
          e.y += 20; // Move enemies down
        });
      }
  
      // Check if enemies reach the player
      if (enemy.y + enemy.height > player.current.y) {
        setGameOver(true);
        setShowGameOverPopup(true);
      }
    });
  
    // Enemies shoot randomly in Hard Mode
    if (hardModeEnabled && Math.random() < 0.02) {
      const randomEnemy = enemiesRef.current[Math.floor(Math.random() * enemiesRef.current.length)];
      setEnemyBullets((prevBullets) => [
        ...prevBullets,
        { x: randomEnemy.x + randomEnemy.width / 2 - 2.5, y: randomEnemy.y + randomEnemy.height },
      ]);
    }
  
    // Check if all enemies are defeated (win condition)
    if (enemiesRef.current.length === 0) {
      setGameOver(true);
      setShowWinPopup(true);
    }
  };
  // Detect collisions
  const detectCollisions = () => {
    bullets.current.forEach((bullet, bulletIndex) => {
      enemiesRef.current.forEach((enemy, enemyIndex) => {
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + 5 > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + 10 > enemy.y
        ) {
          bullets.current.splice(bulletIndex, 1);
          enemiesRef.current.splice(enemyIndex, 1);
          setScore((prevScore) => prevScore + 10);
          hitSound.play();
          setImpactEffects((prevEffects) => [
            ...prevEffects,
            { x: enemy.x + enemy.width / 2 - 5, y: enemy.y + enemy.height / 2 - 5, duration: 10 },
          ]);
        }
      });
    });
  };

  // Game loop
  const gameLoop = (ctx) => {
    const canvas = canvasRef.current;

    // Ensure the canvas is available
    if (!canvas || gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(ctx);
    drawBullets(ctx);
    drawEnemyBullets(ctx);
    drawEnemies(ctx);
    drawImpactEffects(ctx);

    updatePlayer();
    updateBullets();
    updateEnemyBullets();
    updateEnemies();
    detectCollisions();

    requestAnimationFrame(() => gameLoop(ctx));
  };

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
      player.current.dx = -player.current.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      player.current.dx = player.current.speed;
    } else if (e.key === ' ') {
      bullets.current.push({ x: player.current.x + player.current.width / 2 - 2.5, y: player.current.y });
      shootSound.play();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
      player.current.dx = 0;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    // Ensure the canvas is available
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Initialize player position
    player.current.x = canvas.width / 2 - 25;
    player.current.y = canvas.height - 50;

    // Initialize enemies
    initializeEnemies();

    // Start game loop
    const loopId = requestAnimationFrame(() => gameLoop(ctx));

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      // Cleanup
      cancelAnimationFrame(loopId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, gameStarted, enemySpeed, randomMovement, hardModeEnabled, enemyBullets, impactEffects]);

  return (
    <div className="game-container">
      <h1>Space Invaders</h1>
      <div className="canvas-container">
        <canvas ref={canvasRef} width={800} height={600} />
      </div>
      <div className="score">Score: {score}</div>

      {/* Game Over Popup */}
      {showGameOverPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Game Over!</h2>
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
            <p>Move Left: 'A' or Left Arrow</p>
            <p>Move Right: 'D' or Right Arrow</p>
            <p>Shoot: Spacebar</p>
            <button onClick={() => setShowControls(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="game-controls">
        <button onClick={() => window.location.reload()}>Restart</button>
        <button onClick={() => setShowControls(true)}>Controls</button>
        <button
          onClick={() => {
            setEnemySpeed((prevSpeed) => prevSpeed + 1);
            setRandomMovement(true);
            setHardModeEnabled(true);
          }}
          disabled={hardModeEnabled}
        >
          {hardModeEnabled ? 'Hard Mode' : 'Increase Difficulty'}
        </button>
        <button onClick={() => (window.location.href = '/')}>Return to Main Menu</button>
      </div>
    </div>
  );
};

export default SpaceInvaders;