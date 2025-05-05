const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// Canvas dimensions
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;


// Game variables
let player = { x: canvas.width / 2, y: canvas.height - 50, width: 30, height: 30, color: 'cyan' };
let bullets = [];
let enemies = [];
let score = 0;


// Key controls
let keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));


// Spawn enemies
function spawnEnemies() {
  setInterval(() => {
    const size = Math.random() * 40 + 10;
    const x = Math.random() * (canvas.width - size);
    enemies.push({ x, y: -size, width: size, height: size, color: 'red' });
  }, 1000);
}


// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}


// Draw bullets
function drawBullets() {
  ctx.fillStyle = 'yellow';
  bullets.forEach((bullet, index) => {
    bullet.y -= 10;
    if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}


// Draw enemies
function drawEnemies() {
  ctx.fillStyle = 'red';
  enemies.forEach((enemy, index) => {
    enemy.y += 3;
    if (enemy.y > canvas.height) enemies.splice(index, 1);
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);


    // Check collision with player
    if (
      enemy.x < player.x + player.width &&
      enemy.x + enemy.width > player.x &&
      enemy.y < player.y + player.height &&
      enemy.y + enemy.height > player.y
    ) {
      alert(`Game Over! Your score: ${score}`);
      document.location.reload();
    }
  });
}


// Check bullet collisions
function checkCollisions() {
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score++;
      }
    });
  });
}


// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // Move player
  if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
  if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += 5;


  drawPlayer();
  drawBullets();
  drawEnemies();
  checkCollisions();


  // Display score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);


  requestAnimationFrame(gameLoop);
}


// Shoot bullets
window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20 });
  }
});


// Start the game
spawnEnemies();
gameLoop();