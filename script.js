const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");

canvas.width = 400;
canvas.height = 600;

let player;
let platforms;
let score;
let isGameOver = false;

// Ігровий об'єкт
class Player {
    constructor() {
        this.width = 40;
        this.height = 40;
        this.color = "red";
        this.velocity = 0;
        this.isOnPlatform = false; // Додано для перевірки, чи на платформі
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    jump() {
        // Стрибок, коли персонаж на платформі
        if (this.isOnPlatform) {
            this.velocity = -10; // Графічний стрибок
            this.isOnPlatform = false; // Вимикаємо прапор, щоб не було подвійного стрибка
        }
    }

    update() {
        this.y += this.velocity;
        this.velocity += 0.5;

        // Перевірка, чи не впав персонаж за межі екрану
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height; // Не даємо персонажу виходити за межі екрану
            this.velocity = 0; // Зупиняємо рух
            isGameOver = true;
        }
    }

    moveWithPlatform(platform) {
        if (this.isOnPlatform) {
            this.x += platform.dx; // Рух з платформою
        }
    }
}

// Платформи
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = "green";
        this.dx = Math.random() > 0.5 ? 2 : -2; // Швидкість і напрямок
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.dx;

        // Якщо платформа виходить за межі екрану
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.dx *= -1; // Змінюємо напрямок руху
        }
    }
}

// Ініціалізація гри
function init() {
    player = new Player();
    platforms = [
        new Platform(150, 550, 100, 10),
        new Platform(200, 400, 100, 10),
        new Platform(50, 250, 100, 10),
        new Platform(250, 100, 100, 10),
    ];

    // Початкове положення персонажа на першій платформі
    player.x = platforms[0].x + (platforms[0].width / 2) - (player.width / 2);
    player.y = platforms[0].y - player.height;

    score = 0;
    isGameOver = false;
}

// Оновлення платформ
function updatePlatforms() {
    platforms.forEach((platform) => {
        platform.update();

        // Перевірка зіткнення з платформою
        if (
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width &&
            player.velocity >= 0
        ) {
            player.isOnPlatform = true;
            player.y = platform.y - player.height; // Персонаж стоїть на платформі
        } else {
            player.isOnPlatform = false;
        }

        // Якщо платформа йде вниз або вгору, персонаж все одно залишиться на ній
        player.moveWithPlatform(platform);
    });
}

// Малювання очок
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Очки: ${score}`, 10, 30);
}

// Малювання всього
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    platforms.forEach((platform) => platform.draw());
    drawScore();
}

// Оновлення гри
function updateGame() {
    if (isGameOver) {
        alert(`Гра закінчена! Твій рахунок: ${score}`);
        menu.style.display = "block";
        canvas.style.display = "none";
        return;
    }

    player.update();
    updatePlatforms();

    // Оновлення рахунку
    platforms.forEach((platform) => {
        if (platform.y > canvas.height) {
            platform.y = -10; // Переміщаємо платформу нагору
            platform.x = Math.random() * (canvas.width - platform.width);
            score++;
        }
    });

    draw();

    requestAnimationFrame(updateGame);
}

// Початок гри
startButton.addEventListener("click", () => {
    menu.style.display = "none";
    canvas.style.display = "block";
    init();
    updateGame();
});

// Додано обробку натискання на екран для стрибка
canvas.addEventListener("click", () => {
    player.jump();
});
