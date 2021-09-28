export class Ball
{
    x: number;
    y: number;
    speed: number;
    velocityX: number;
    velocityY: number;

    constructor(x: number, y: number, speed: number, velocityX: number, velocityY: number)
    {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
};