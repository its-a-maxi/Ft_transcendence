import { Position } from './position';
import { SpeedRatio } from './speed-ratio';
import { Boundaries } from './boundaries';

export abstract class MoveableObject {
    constructor(private height: number,
                private width: number,
                private MaxSpeed: number,
                private position: Position){

    }

    move(speedRatio: SpeedRatio): void {
        this.position.x += this.MaxSpeed * speedRatio.x;
        this.position.y += this.MaxSpeed * speedRatio.y;
    }

    getCollisionBoundaries(): Boundaries {
        return {
            top: this.position.y - this.height / 2,
            bottom: this.position.y + this.height / 2,
            right: this.position.x + this.width / 2,
            left: this.position.x - this.width / 2
        }
    }

    getWidth(): number { return this.width;}
    getHeight(): number { return this.height;}
    getPosition(): Position { return this.position;}
    setPosition(position: Position): void {this.position = position;}
}
