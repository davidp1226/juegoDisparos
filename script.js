const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const retryButton = document.getElementById("retryButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables del juego
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;

const playerImage = new Image();
playerImage.src = 'images/gato.png'; // Imagen del jugador

const bulletImage = new Image();
bulletImage.src = 'images/Huella.png'; // Imagen de los disparos

const enemyImage = new Image();
enemyImage.src = 'images/Ovni.png'; // Imagen de los enemigos


// Nave
const player = {
    width: 50,
    height: 50,
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    speed: 10,
    dx: 0,
};

// Disparos
const bullets = [];
const bulletSpeed = 7;

// Enemigos
const enemies = [];
const enemySpeed = 2;
const enemySize = 50;

// Función para dibujar la nave
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function shootBullet() {
    if (!gameOver) {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 30, height: 30 });
    }
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

function createEnemies() {
    if (Math.random() < 0.02) {
        const x = Math.random() * (canvas.width - enemySize);
        enemies.push({ x, y: 0, width: enemySize, height: enemySize });
    }
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function moveEnemies() {
    enemies.forEach(enemy => enemy.y += enemySpeed);
}

function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                updateScore();
            }
        });
    });
}

function updateScore() {
    document.getElementById("score").textContent = "Puntos: " + score;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    document.getElementById("highScore").textContent = "Puntuación más alta: " + highScore;
}

function showGameOver() {
    document.getElementById("gameOver").textContent = "Fin del Juego! Puntuación final: " + score;
    document.getElementById("gameOver").style.display = "block";
    retryButton.style.display = "block";
    updateHighScore();
}

function restartGame() {
    gameOver = false;
    score = 0;
    enemies.length = 0;
    bullets.length = 0;
    document.getElementById("gameOver").style.display = "none";
    retryButton.style.display = "none";
    updateScore();
    updateGame();
}

function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveBullets();
    moveEnemies();
    detectCollisions();

    drawPlayer(); // Dibuja al jugador con su imagen
    drawBullets();
    drawEnemies();
    createEnemies();

    enemies.forEach(enemy => {
        if (enemy.y + enemy.height > canvas.height) {
            gameOver = true;
            showGameOver();
        }
    });

    requestAnimationFrame(updateGame);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === " " && !gameOver) shootBullet();
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") player.dx = 0;
});

retryButton.addEventListener("click", restartGame);

updateHighScore();
updateGame();
