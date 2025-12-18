class Snake {
    snake = [];
    snakeHTMLElement = [];
    previousPositions = []

    constructor(snake) {
        this.snake = snake;
        this.previousPositions = this.snake.map(segment => ({...segment}));

        this.initSquare();
        this.generateSnake();
        this.showSnake();

        this.snakeHTMLElement = document.querySelectorAll('.square');
    }

    initSquare() {
        return document.querySelector('.game-square');
    }

    generateSnake() {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");

        svg.setAttribute("viewBox", "0 0 462 562");
        const group = document.createElementNS(svgNS, "g");
        group.setAttribute("id", "snake");

        this.snake.forEach((segment, index) => {
            const rect = document.createElementNS(svgNS, "rect");

            const stone = document.createElement('p');
            const game_square = document.querySelector('.game-square');
            stone.classList.add('stone');

            rect.setAttribute("width", "18");
            rect.setAttribute("height", "18");
            rect.setAttribute('class', 'square');
            rect.setAttribute("rx", index === 0 ? "3" : "2");
            rect.setAttribute("fill", index === 0 ? "#4CAF50" : "#66BB6A");
            rect.style.transition = "transform 0.15s linear";

            rect.style.transform = `translate(${segment.x}px, ${segment.y}px)`;

            group.appendChild(rect);
            game_square.appendChild(stone);
        });

        svg.appendChild(group);
        return svg;
    }

    showSnake() {
        this.initSquare().replaceChildren(this.generateSnake());
        this.snakeHTMLElement = document.querySelectorAll('.square');
    }
}

class MoveSnake extends Snake {
    score = {
        x: 20,
        y: 20
    };
    moveInterval = null;

    constructor(snake) {
        super(snake);
        this.changeSnakePosition();
    }

    changeSnakePosition() {
        // variable which don't allow press the same key one more time if its already pressed
        let previousEvent = null;

        // variable which will don't allow move from right to left or from up to down.
        let direction = null;

        document.addEventListener('keyup', (e) => {

            if (e.key !== previousEvent) {
                clearInterval(this.moveInterval);
                previousEvent = e.key;
                switch (e.key) {
                    case 'ArrowUp':
                        if (direction !== 'down') {
                            direction = 'up'
                            this.moveSnake(0, -this.score.y);
                        } else {
                            console.log("second")
                            this.moveSnake(0, this.score.y);
                        }
                        break;
                    case 'ArrowDown':
                        if (direction !== 'up') {
                            direction = 'down'
                            this.moveSnake(0, this.score.y);
                        } else {
                            this.moveSnake(0, -this.score.y);
                        }
                        break;
                    case 'ArrowLeft':
                        if (direction !== 'right') {
                            direction = 'left'
                            this.moveSnake(-this.score.x, 0);
                        } else {
                            this.moveSnake(this.score.x, 0)
                        }
                        break;
                    case 'ArrowRight':
                        if (direction !== 'left') {
                            direction = 'right'
                            this.moveSnake(this.score.x, 0);
                        } else {
                            this.moveSnake(-this.score.x, 0);
                        }
                        break;
                }
            }
        });
    }

    moveSnake(deltaX, deltaY) {
        const time = 200
        this.moveInterval = setInterval(() => {

            this.snake[0].x += deltaX;
            this.snake[0].y += deltaY;

            for (let i = 1; i < this.snake.length; i++) {
                this.snake[i].x = this.previousPositions[i - 1].x;
                this.snake[i].y = this.previousPositions[i - 1].y;
            }

            this.updateSnakeVisuals();

        }, time)
    }

    updateSnakeVisuals() {
        this.snakeHTMLElement.forEach((element, index) => {
            if (index === 0) {
                const box = document.querySelector('svg').getBoundingClientRect();

                // stop game when snake pass the box borders
                if (this.snake[0].x > box.width || this.snake[0].y > box.height || this.snake[0].x < 0 || this.snake[0].y < 0) {
                    clearInterval(this.moveInterval);

                }
            }
            element.style.transform = `translate(${this.snake[index].x}px, ${this.snake[index].y}px)`;
        });
    }
}

class EatStone extends MoveSnake {

    constructor(snake) {
        super(snake)
    }

}

new EatStone([
    {x: 240, y: 200},
    {x: 220, y: 200},
    {x: 200, y: 200},
    {x: 180, y: 200}
]);