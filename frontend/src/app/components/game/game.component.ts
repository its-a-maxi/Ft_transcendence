import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game-service/game.service';
import { AuthService } from '../../services/auth-service/auth.service';
import { Boundaries } from './classes/boundaries';
import { ControlState } from './classes/control-state';
import { GameLogic } from './classes/game-logic';
import { P5JSInvoker } from './classes/p5-jsinvoker';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent extends P5JSInvoker implements OnInit {

    public width: number = 800;
    public height: number = 600;
  
    private pongGame !: GameLogic;
    private ticksPerSecond: number = 60;
    private controlState !: ControlState; 
  
    constructor(private gameService: GameService) {
      super();
      this.pongGame = new GameLogic(this.height,this.width);
      this.controlState = { upPressed: false, downPressed: false };
      this.startP5JS(document.body);
      this.p5.frameRate(2 * this.ticksPerSecond);
    }
  
    setup()
    {
        try {
          setTimeout(() => this.p5.createCanvas(this.width, this.height).parent('field'), 0);
        } catch {}
     
      
    }
  
    draw()
    {
      this.p5.fill('black');
      this.p5.rect(0,0,this.width,this.height);
  
      // Only run if game still going
      if (this.pongGame.gameOver()) {
        this.pongGame.newMatch();
        //setTimeout(() => location.reload(), 500);
        return;
      }

      // Set to white for game objects
      this.p5.fill('white');

      //Print Scores
      this.p5.rect(this.width / 2, 0, this.width / 512, this.height);
      this.p5.textSize(this.width / 15);
      this.p5.text(this.pongGame.playerScore, 3 * this.width / 12, this.height / 10);
      this.p5.text(this.pongGame.enemyScore, 9 * this.width / 12, this.height / 10);
  
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

	  let data = {
			up: this.controlState.upPressed,
			down: this.controlState.downPressed
		}
		this.gameService.keyReled(data)
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

	  let data = {
		  up: this.controlState.upPressed,
		  down: this.controlState.downPressed
	  }
	  this.gameService.keyReled(data)
    }
  
    ngOnInit(): void {
      // Game model ticks 60 times per second. Doing this keeps same game speed
      // on higher FPS environments.
      setInterval(() => this.pongGame.tick(this.controlState),
        1 / this.ticksPerSecond);
    }

}
