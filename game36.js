const basket = document.getElementById('basket');
const apple = document.getElementById('apple');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startBtn = document.getElementById('start-btn');
const gameOverEl = document.getElementById('game-over');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

const containerWidth = 500;
const containerHeight = 400;
const basketWidth = 90;
const basketHeight = 24;
const basketBottom = 10;
const appleSize = 28;

let score = 0;
let lives = 3;
let basketX = (containerWidth - basketWidth) / 2;
let appleX = 0;
let appleY = 0;
let speed = 2.5;
let isRunning = false;
let animId = null;

function resetApple() {
    appleY = 0;
    appleX = Math.floor(Math.random() * (containerWidth - appleSize));
    apple.style.top = appleY + 'px';
    apple.style.left = appleX + 'px';
}

/**
 * @param {'left' | 'right'} dir
 */
function moveBasket(dir) {
    if (!isRunning) return;
    const step = 25;
    if (dir === 'left') {
        basketX = Math.max(0, basketX - step);
    } else if (dir === 'right') {
        basketX = Math.min(containerWidth - basketWidth, basketX + step);
    }
    basket.style.left = basketX + 'px';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveBasket('left');
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveBasket('right');
    }
});

if (btnLeft) {
    btnLeft.addEventListener('click', () => moveBasket('left'));
}

if (btnRight) {
    btnRight.addEventListener('click', () => moveBasket('right'));
}

function gameLoop() {
    if (!isRunning) return;

    appleY += speed;
    apple.style.top = appleY + 'px';

    const basketTop = containerHeight - basketBottom - basketHeight;
    const basketBottomEdge = containerHeight - basketBottom;

    const isHit =
        appleY + appleSize >= basketTop &&
        appleY <= basketBottomEdge &&
        appleX + appleSize >= basketX &&
        appleX <= basketX + basketWidth;

    if (isHit) {
        score++;
        scoreEl.textContent = String(score);
        speed += 0.3;
        resetApple();
    } else if (appleY + appleSize >= containerHeight) {
        lives--;
        livesEl.textContent = String(lives);

        if (lives <= 0) {
            isRunning = false;
            if (animId !== null) {
                cancelAnimationFrame(animId);
            }
            gameOverEl.style.display = 'flex';
            return;
        }
        resetApple();
    }

    animId = requestAnimationFrame(gameLoop);
}

startBtn.addEventListener('click', () => {
    if (animId !== null) {
        cancelAnimationFrame(animId);
    }
    score = 0;
    lives = 3;
    speed = 2.5;
    basketX = (containerWidth - basketWidth) / 2;

    scoreEl.textContent = String(score);
    livesEl.textContent = String(lives);
    basket.style.left = basketX + 'px';
    gameOverEl.style.display = 'none';

    resetApple();
    isRunning = true;
    gameLoop();
});
