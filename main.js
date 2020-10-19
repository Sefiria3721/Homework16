// Убраны глобальные объекты для изоляции логики внутри классов
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Выносим логику обработки каждого шарика в отдельный класс
// Избавляемся от зависимостей с глобальными переменными
class Ball {
    constructor (x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }
    // Отрисовка в заданный графический контекст
    draw = (ctx) => {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update = (width, height) => {
        if ((this.x + this.size) >= width) {
          this.velX = -(this.velX);
        }
      
        if ((this.x - this.size) <= 0) {
          this.velX = -(this.velX);
        }
      
        if ((this.y + this.size) >= height) {
          this.velY = -(this.velY);
        }
      
        if ((this.y - this.size) <= 0) {
          this.velY = -(this.velY);
        }
      
        this.x += this.velX;
        this.y += this.velY;
    }
    // Проверяем столкновение между собой и другим, убрала цикл поскольку это не является частью логики отдельного шарика
    collisionDetect = (anotherBall) => {
        if (this === anotherBall)
            return;

        const dx = this.x - anotherBall.x;
        const dy = this.y - anotherBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
      
        if (distance >= this.size + anotherBall.size)
            return;
        
        anotherBall.color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';     
    }
}
// Класс-контейнер отрисовки страницы
class PageView {
    constructor (canvas, ballsQty) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.balls = [];

        this.generateBalls(ballsQty);
    }

    generateBalls = (ballsQty) => {
        while (this.balls.length < ballsQty) {
            const ball = new Ball (
                random (0, this.width),
                random (0, this.height),
                random (-7, 7),
                random (-7, 7),
                // Используем интерполяцию строк, клеить с кавычками не очень удобно
                'rgb({random(0,255)}, {random(0,255)}, {random(0,255)})',
                random (10, 20)
            );
            this.balls.push(ball);
        }
    }
    // Оставлена только логика, касающаяся непосредственно анимации. Создание списка Balls вынесено в метод generateBalls
    loop = () => {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (const ball of this.balls) {
            ball.draw(this.ctx);
            ball.update(this.width, this.height);
            this.balls.forEach(anotherBall => ball.collisionDetect(anotherBall));
        }
          
        requestAnimationFrame(this.loop);
    }
}
// Инициализация страницы и ее отрисовки
(() => {
    const view = new PageView(document.querySelector('canvas'), 25);
    view.loop();
})();