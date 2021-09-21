import { MoveableObject } from "./moveable-object";
import { Position } from "./position";
import { SpeedCoord } from "./speed-coord";

export class Ball extends MoveableObject {

    constructor(height: number,
                width: number,
                position: Position,
                speedCoord: SpeedCoord)
    {
        super(height, width, position, speedCoord);
    }

    /**
    * Reverses the ball in the x direction
    */
    reverseX(): void {
        this.getSpeedCoord().x = -this.getSpeedCoord().x;
    }

    /**
     * Reverses the ball in the y direction
     */
    reverseY(): void {
        this.getSpeedCoord().y = -this.getSpeedCoord().y;
    }

    /**
     * Moves object using existing speed ratio
     */
    move() {
        super.move();
    }
}
