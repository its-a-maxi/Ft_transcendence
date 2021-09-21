import { Ball } from "./ball";
import { ControlState } from "./control-state";
import { Paddle } from "./paddle";

export class GameLogic {

    ball !: Ball;
    playerPaddle !: Paddle;
    enemyPaddle !: Paddle;
    playerScore: number = 0;
    enemyScore: number = 0;

    constructor(private height: number,
                private width: number)
    {
        // Construct game objects
        var plusOrMinus = Math.round(Math.random()) * 2 - 1.0;
        let velModInit = (512 * 60)  / (this.width * 30);
        let velX = Math.random() * velModInit;
        this.ball = new Ball(2 * width / 256, 2 * width / 256,
            { x: height / 2, y: width / 2 },
            { x: velX,
              y: plusOrMinus * Math.sqrt(Math.pow(velModInit,2)-Math.pow(velX,2))});
        this.playerPaddle = new Paddle( 7 * height / 64, 2 * width / 256,
            { x: width / 12, y: height / 2 },
            3 * (512 * 60) / (this.width * 30));
        this.enemyPaddle = new Paddle(7 * height / 64, 2 * width / 256,
            { x: 11 * width / 12, y: height / 2 },
            3 * (512 * 60) / (this.width * 30));
    }

    tick(controlState: ControlState)
    {
        this.ball.move();
        // Set acceleration, move player paddle based on input
        let accelRatio = 5;
        let paddleBounds = this.playerPaddle.getCollisionBoundaries();
        if (controlState.upPressed && paddleBounds.top > 0) {
            this.playerPaddle.accelerateUp(accelRatio);
        }

        else if (controlState.downPressed && paddleBounds.bottom < this.height) {
            this.playerPaddle.accelerateDown(accelRatio);
        }

        else {
            this.playerPaddle.decelerate(accelRatio * 2);
        }
        this.moveEnemyPaddle();
        this.checkCollisions();
    }

    private moveEnemyPaddle() {
        if (this.ball.getPosition().y - this.enemyPaddle.getPosition().y < 0)
            this.enemyPaddle.accelerateUp(1)
        else 
            this.enemyPaddle.accelerateDown(1)
        this.enemyPaddle.move()
    }

    private checkCollisions() {
        // Bounce off top/bottom
        let ballBounds = this.ball.getCollisionBoundaries();
        if (ballBounds.bottom >= this.height || ballBounds.top <= 0)
        {
            this.ball.reverseY();
        }

        let velBounce = 2 * (512 * 60) / (this.width * 30);

        let paddleBounds = this.playerPaddle.getCollisionBoundaries();

        // Player paddle hit
        if (paddleBounds.top <= 0 || paddleBounds.bottom >= this.height)
            this.playerPaddle.decelerate(3);
        if (ballBounds.left >= paddleBounds.right &&
            ballBounds.left - paddleBounds.right <= 2 * this.ball.getWidth() &&
            ballBounds.bottom >= paddleBounds.top &&
            ballBounds.top <= paddleBounds.bottom) {
            this.ball.reverseX();

            // Set vertical speed ratio by taking ratio of 
            // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
            // Negate because pixels go up as we go down :)
            let vsr = Math.abs((ballBounds.bottom - this.ball.getHeight()/2 - paddleBounds.bottom + this.enemyPaddle.getHeight()/2)
                / (this.enemyPaddle.getHeight()/2));

            // Max vsr is 1
            //vsr = Math.min(vsr, 1);
            console.log('vsr: ' + vsr);
            let sign = (this.ball.getSpeedCoord().x >= 0) ? 1 : -1;
            let velY = 0.5 * vsr * velBounce;
            this.ball.setSpeedCoord({x: sign * Math.sqrt(Math.pow(velBounce,2)-Math.pow(velY,2)),
                                     y: velY});
           // console.log('Player Bounce Speed: (' + this.ball.getSpeedCoord().x
           // + ', ' + this.ball.getSpeedCoord().y + ')');
        }

        // Enemy paddle hit
        paddleBounds = this.enemyPaddle.getCollisionBoundaries();
        if (paddleBounds.top <= 0 || paddleBounds.bottom >= this.height)
            this.enemyPaddle.decelerate(3);
        if (ballBounds.right <= paddleBounds.left &&
            - ballBounds.right + paddleBounds.left <= 2 * this.ball.getWidth() &&
            ballBounds.bottom >= paddleBounds.top &&
            ballBounds.top <= paddleBounds.bottom) {
            this.ball.reverseX();

            // Set vertical speed ratio by taking ratio of 
            // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
            // Negate because pixels go up as we go down :)
            let vsr = Math.abs((ballBounds.bottom - this.ball.getHeight()/2 - paddleBounds.bottom + this.enemyPaddle.getHeight()/2)
                / (this.enemyPaddle.getHeight()/2));

            // Max vsr is 1
            //vsr = Math.min(vsr, 1);
            console.log('vsr: ' + vsr);
            let sign = (this.ball.getSpeedCoord().x >= 0) ? 1 : -1;
            let velY = 0.5 * vsr * velBounce;
            this.ball.setSpeedCoord({x: sign * Math.sqrt(Math.pow(velBounce,2)-Math.pow(velY,2)),
                                     y: velY});
            //console.log('Enemy Bounce Speed: (' + this.ball.getSpeedCoord().x
            //+ ', ' + this.ball.getSpeedCoord().y + ')');
        }
    }

    gameOver(): boolean {
        var collisionBoundaries = this.ball.getCollisionBoundaries();
        if (this.ball.getCollisionBoundaries().left <= 0)
        {
            this.enemyScore++;
            return true;
        }
        else if (this.ball.getCollisionBoundaries().right >= this.width)
        { 
            this.playerScore++;
            return true;
        } 
        else return false;
    }
    newMatch(): void {
        this.ball.setPosition({ x: this.height / 2,
                                y: this.width / 2 });
        let plusOrMinus = Math.round(Math.random()) * 2 - 1.0;
        let velModInit = 1.0;
        let velX = Math.random() * velModInit;
        this.ball.setSpeedCoord({x: velX,
                                 y: plusOrMinus * Math.sqrt(Math.pow(velModInit,2)-Math.pow(velX,2))});
    }

}
