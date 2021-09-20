import { Component, OnInit } from '@angular/core';
import { Boundaries } from 'src/app/classes/boundaries';
import { ControlState } from 'src/app/classes/control-state';
import { GameLogic } from 'src/app/classes/game-logic';
import { Controls } from 'src/app/enums/controls';
import { P5JSInvoker } from 'src/p5-jsinvoker';

@Component({
  selector: 'app-pong-game',
  templateUrl: './pong-game.component.html',
  styleUrls: ['./pong-game.component.css']
})
export class PongGameComponent extends P5JSInvoker implements OnInit {

  public width: number = 800;
  public height: number = 600;

  private pongGame !: GameLogic;
  private ticksPerSecond: number = 60;
  private controlState !: ControlState; 

  constructor() {
    super();
    this.pongGame = new GameLogic(this.height,this.width);
    this.controlState = { upPressed: false, downPressed: false };
    this.startP5JS(document.body);
    //this.p5.frameRate(this.ticksPerSecond);
  }

  setup()
  {
    this.p5.createCanvas(this.width, this.height);
    
  }

  draw()
  {
    this.p5.fill('black');
    this.p5.rect(0,0,this.width,this.height);

    // Only run if game still going
    if (this.pongGame.gameOver()) {
      setTimeout(() => location.reload(), 500);
      return;
    }
    // Set to white for game objects
    this.p5.fill('white');

    let bounds: Boundaries;

    // Draw player paddle
    let paddleObj = this.pongGame.playerPaddle;
    bounds = paddleObj.getCollisionBoundaries();
    this.p5.rect(bounds.left, bounds.top,
      paddleObj.getWidth(), paddleObj.getHeight());

    // Draw enemy paddle
    let enemyObj = this.pongGame.enemyPaddle;
    bounds = enemyObj.getCollisionBoundaries();
    this.p5.rect(bounds.left, bounds.top,
      enemyObj.getWidth(), enemyObj.getHeight());

    // Draw ball
    let ballObj = this.pongGame.ball;
    bounds = ballObj.getCollisionBoundaries();
    this.p5.rect(bounds.left, bounds.top,
      ballObj.getWidth(), ballObj.getHeight());
    
  }

  keyPressed()
  {
    if (this.p5.keyCode == this.p5.UP_ARROW)
    {
      this.controlState.upPressed = true;
    }
    else if (this.p5.keyCode == this.p5.DOWN_ARROW)
    {
      this.controlState.downPressed = true;
    }
  }

  keyReleased()
  {
    if (this.p5.keyCode == this.p5.UP_ARROW)
    {
      this.controlState.upPressed = false;
    }
    else if (this.p5.keyCode == this.p5.DOWN_ARROW)
    {
      this.controlState.downPressed = false;
    }
  }

  ngOnInit(): void {
    // Game model ticks 60 times per second. Doing this keeps same game speed
    // on higher FPS environments.
    setInterval(() => this.pongGame.tick(this.controlState),
      1 / this.ticksPerSecond);
  }

}
