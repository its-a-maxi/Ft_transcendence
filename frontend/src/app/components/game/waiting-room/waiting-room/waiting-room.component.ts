import { AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game-service/game.service';
import { UserI } from 'src/app/services/models/user.interface';

interface PlayerI {
    plOne: number;
    plTwo: number;
}

@Component({
	selector: 'app-waiting-room',
	templateUrl: './waiting-room.component.html',
	styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges, DoCheck
{
	check: boolean = false
	lenUsers: number = 0

    playerOne!: number
    playerTwo!: number
    inter!: any
    roomGame:any
    roomId: number = 0

	constructor(private gameService: GameService,
                private router: Router) { this.gameService.test2() }

	ngOnInit()
	{
        //this.gameService.test2()
		this.gameService.joinRoom()
        this.gameService.findUsers()
        this.inter = setInterval(() => {
            this.gameService.findUsers()
            this.gameService.getListUsers().subscribe(res => {
			
                // this.playerOne = res.plOne
                // this.playerTwo = res.plTwo
                this.roomGame = res
                if (this.roomGame && this.roomGame.id)
                    this.roomId = res.id
                console.log(res)
            })
            
        }, 5000)
        
	}
	
    private async connections()
    {
        
        
		this.gameService.getListUsers().subscribe(res => {
			
			//this.users = res
			console.log(res)
		})
    }

	ngOnDestroy()
	{
		// let option = confirm("DO YOU WANT EXIT?")
		// if (!option)
		// 	return
        this.playerTwo = 0
		//this.gameService.leaveRoom()
        if (this.inter)
        {
            clearInterval(this.inter)
           
        }
	}

	ngAfterViewInit()
	{
		
		//setInterval(() => this.ngOnInit(), 3000)
		
	}

	ngOnChanges(changes: SimpleChanges)
	{
		
	}

    ngDoCheck()
    {
        
        
    }

	changeCheck()
	{
		this.check = true
        //this.ngOnInit()
        // this.gameService.test2()
        // this.gameService.joinRoom()
        //this.gameService.findUsers()
		// this.gameService.getListUsers().subscribe(res => {
			
		// 	this.playerOne = res.plOne
        //     this.playerTwo = res.plTwo
		// 	console.log(res)
		// })
	}

	destroyUsers()
	{
		this.gameService.destroyUsers()
	}

}
