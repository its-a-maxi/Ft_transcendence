export class Paddle
{
    x: number;
    y: number;
    score: number;
    player: number;
    gameId: number;

    constructor(x: number, y: number, score: number, player: number, gameId: number)
    {
        this.x = x;
        this.y = y;
        this.score = score;
        this.player = player;
        this.gameId = gameId
    }
}