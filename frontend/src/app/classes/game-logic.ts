import { Ball } from "./ball";
import { ControlState } from "./control-state";
import { Paddle } from "./paddle";

export class GameLogic {

    ball !: Ball;
    playerPaddle !: Paddle;
    enemyPaddle !: Paddle;

    constructor(private height: number,
                private width: number)
    {
        // Construct game objects
        this.ball = new Ball(15, 15, 2,
            { x: height / 2, y: width / 2 },
            { x: 1, y: 1 });
        this.playerPaddle = new Paddle(100, 20, 1.5,
            { x: 50, y: height / 2 });
        this.enemyPaddle = new Paddle(100, 20, .8,
            { x: width - 50, y: height / 2 });
    }

    tick(controlState: ControlState)
    {
        this.ball.move();
        // Set acceleration, move player paddle based on input
        let accelRatio = 0.2;
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
        if (this.ball.getPosition().y < this.enemyPaddle.getPosition().y)
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
        let paddleBounds = this.playerPaddle.getCollisionBoundaries();

    
        console.log("LOGIC: Player bounds are (top, bottom, left, right): "
        + paddleBounds.top + " ," + paddleBounds.bottom + ", "
        + paddleBounds.left + " ," + paddleBounds.right + ")");
    
    /*
    console.log("Ball bounds are (" + ballBounds.top +
        " ," + ballBounds.bottom + ");(" + ballBounds.left +
        ", " + ballBounds.right + ")");
    */
        // Player paddle hit
        if (paddleBounds.top <= 0 || paddleBounds.bottom >= this.height)
            this.playerPaddle.decelerate(1);
        if (ballBounds.left - paddleBounds.right >= 0 &&
            ballBounds.left - paddleBounds.right <= 3 &&
            ballBounds.bottom >= paddleBounds.top &&
            ballBounds.top <= paddleBounds.bottom) {
            console.log("BOUNCE OFF PLAYER!");
            this.ball.reverseX();

            // Set vertical speed ratio by taking ratio of 
            // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
            // Negate because pixels go up as we go down :)
            var vsr = - (this.ball.getPosition().y - this.playerPaddle.getPosition().y)
                / (paddleBounds.top - this.playerPaddle.getPosition().y);

            // Max vsr is 1
            vsr = Math.min(vsr, 1);
            this.ball.setVerticalSpeedRatio(vsr);
        }

        // Enemy paddle hit
        paddleBounds = this.enemyPaddle.getCollisionBoundaries();
        if (ballBounds.right - paddleBounds.left >= 0 &&
            ballBounds.right - paddleBounds.left <= 3 &&
            ballBounds.bottom >= paddleBounds.top &&
            ballBounds.top <= paddleBounds.bottom) {
            console.log("BOUNCE OFF ENEMY!");
            this.ball.reverseX();

            // Set vertical speed ratio by taking ratio of 
            // dist(centerOfBall, centerOfPaddle) to dist(topOfPaddle, centerOfPaddle)
            // Negate because pixels go up as we go down :)
            var vsr = - (this.ball.getPosition().y - this.enemyPaddle.getPosition().y)
                / (paddleBounds.top - this.enemyPaddle.getPosition().y);

            // Max vsr is 1
            vsr = Math.min(vsr, 1);
            this.ball.setVerticalSpeedRatio(vsr);
        }
    }

    gameOver(): boolean {
        var collisionBoundaries = this.ball.getCollisionBoundaries();
        if (this.ball.getCollisionBoundaries().left <= 0 ||
            this.ball.getCollisionBoundaries().right >= this.width) return true;
        else return false;
    }

}
