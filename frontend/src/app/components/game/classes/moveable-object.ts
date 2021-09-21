import { Position } from './position';
import { SpeedCoord } from './speed-coord';
import { Boundaries } from './boundaries';

export abstract class MoveableObject {
    constructor(private height: number,
                private width: number,
                private position: Position,
                private speedCoord: SpeedCoord){

    }

    move(): void {
        this.position.x += this.speedCoord.x;
        this.position.y += this.speedCoord.y;
    }

    getCollisionBoundaries(): Boundaries {
        return {
            top: this.position.y,
            bottom: this.position.y + this.height,
            right: this.position.x + this.width,
            left: this.position.x
        }
    }

    getWidth(): number { return this.width;}
    getHeight(): number { return this.height;}
    getPosition(): Position { return this.position;}
    setPosition(position: Position): void { this.position = position; }
    getSpeedCoord(): SpeedCoord { return this.speedCoord; }
    setSpeedCoord(speedCoord: SpeedCoord): void{
        this.speedCoord = speedCoord;
    }
}
