import { MoveableObject } from "./moveable-object";
import { Position } from "./position";
import { SpeedCoord } from "./speed-coord";

export class Paddle extends MoveableObject {

    constructor(height: number,
                width: number,
                position: Position,
                private maxSpeed: number)
    {
        super(height, width, position, {x:0, y: 0});
    }

    /**
     * Accelerates towards the max speed in the down direction
     * @param ratioChange - the percentage of the max speed that the paddle should accelerate to
     */
    accelerateDown(ratioChange: number) {
        if (ratioChange < 0) return;
        this.getSpeedCoord().y = Math.min(this.maxSpeed, this.getSpeedCoord().y + ratioChange);
        this.move();
    }

    /**
     * Accelerates towards the max speed in the up direction
     * @param ratioChange - the percentage of the max speed that the paddle should accelerate to
     */
    accelerateUp(ratioChange: number) {
        if (ratioChange < 0) return;
        this.getSpeedCoord().y = Math.max(-1 * this.maxSpeed, this.getSpeedCoord().y - ratioChange);
        this.move();
    }

    /**
     * Decelerate the object towards zero
     * @param ratioChange - the percentage of the max speed that the paddle should decelerate
     */
    decelerate(ratioChange: number) {
        if (this.getSpeedCoord().y < 0) {
            this.getSpeedCoord().y = Math.min(this.getSpeedCoord().y + ratioChange, 0);
        }
        else if (this.getSpeedCoord().y > 0) {
            this.getSpeedCoord().y = Math.max(this.getSpeedCoord().y - ratioChange, 0);
        }
        this.move();
    }

    move(): void {
        super.move();
    }
}
