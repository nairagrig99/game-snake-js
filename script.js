class Snake {
    snake = [];
    snakeHTMLElement = [];

    constructor(snake) {
        this.snake = snake;

        this.initSquare();
        this.generateSnake();
        this.showSnake();
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
            const stone = document.createElement('p');
            const game_square = this.initSquare();
            stone.classList.add('stone');

            const rect = document.createElementNS(svgNS, "rect");

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
            const previousPositions = this.snake.map(segment => ({...segment}));
            this.snake[0].x += deltaX;
            this.snake[0].y += deltaY;
            //
            for (let i = 1; i < this.snake.length; i++) {
                this.snake[i].x = previousPositions[i - 1].x;
                this.snake[i].y = previousPositions[i - 1].y;
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

                this.eatStone()
            }

            element.style.transform = `translate(${this.snake[index].x}px, ${this.snake[index].y}px)`;
        });
    }
}

class EatStone extends MoveSnake {
    stonePosition = {}

    constructor(snake) {
        super(snake)
        this.drawStoneInGameBoard()
    }

    drawStoneInGameBoard() {
        const createStone = document.createElement('p');
        createStone.innerHTML = '';
        createStone.classList.add('stone');
        this.generateRandomPositionOfStone(createStone);
        this.initSquare().appendChild(createStone);
        const stoneList = document.querySelectorAll('.stone');
        if (stoneList.length > 1) {
            stoneList[0].remove()
        }
    }

    generateRandomPositionOfStone(stone) {
        const positionY = Math.floor(Math.random() * 500);
        const positionX = Math.floor(Math.random() * 500);

        stone.style.top = `${positionY}px`;
        stone.style.left = `${positionX}px`;
        this.stonePosition = {
            x: positionX,
            y: positionY
        }
    }

    eatStone() {
        const targetX = this.stonePosition.x
        const targetY = this.stonePosition.y
        const findNearPositionX = Math.abs(targetX - this.snake[0].x) <= 10;
        const findNearPositionY = Math.abs(targetY - this.snake[0].y) <= 10;

        if (findNearPositionX && findNearPositionY) {
            this.addNewStone();
        }
    }

    addNewStone() {
        const lastPosition = this.snake[this.snake.length - 1];
        const newStone = {x: lastPosition.x - this.score.x, y: lastPosition.y + this.score.y}
        this.snake.push(newStone);
        const newSvg = this.snakeHTMLElement[this.snakeHTMLElement.length - 1];
        const newElement = newSvg.cloneNode(true);
        newElement.style.transform = `translate(${newStone.x}px, ${newStone.y}px)`;
        document.querySelector('#snake').appendChild(newElement);
        this.snakeHTMLElement = document.querySelectorAll('.square');
        this.drawStoneInGameBoard()
    }
}

new EatStone([
    {x: 240, y: 200},
    {x: 220, y: 200},
    {x: 200, y: 200},
    {x: 180, y: 200}
]);