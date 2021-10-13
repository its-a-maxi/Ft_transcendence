import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import axios from 'axios';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { RoomI } from '../models/room.interface';
import { User } from "../models/user";
import { UserI } from '../models/user.interface';

axios.defaults.withCredentials = true;

@Injectable({
  providedIn: 'root'
})
export class AuthService
{

	API_URL_GET: string = 'http://localhost:3000/auth/authUser'
	API_URL_POST: string = 'http://localhost:3000/auth/storeUser'
	selectedUser: User;
	userId: any;
    cookie: string = this.cookieService.get('clientID')

	constructor(private router: Router,
                private cookieService: CookieService,
                private snackBar: MatSnackBar) { this.selectedUser = new User()}

    async refreshToken()
    {
        return await axios.post("http://localhost:3000/auth/refresh")
    }

	async showAllUsers()
	{
		return await axios.get<User[]>('http://localhost:3000/auth/AllUsers')
	}

	async logOutUser(check: boolean)
	{
		if (check)
		{
			let option = confirm("DO YOU WANT EXIT?")
			if (!option)
				return
		}
		return await axios.post('http://localhost:3000/auth/logout')
						.then(() => sessionStorage.removeItem('token'))
						.then(() => this.router.navigate(['']))
	}

    async createQR(userId: number)
    {
        return await axios.post('http://localhost:3000/auth/createQR', {userId} )
    }

	async twoFactor()
	{
		return await axios.get('http://localhost:3000/auth/2fa')
	}

	async verifyCode(num: any, userId: number)
	{
		return await axios.post('http://localhost:3000/auth/verify', {num, userId})
	}

	async createAvatar(image: File | undefined)
	{
		const fd = new FormData()
		fd.append('image', <File>image)
		return await axios.post('http://localhost:3000/auth/image', fd)
	}

	async updateUser(user: User)
	{
		return await axios.put<User>('http://localhost:3000/auth/updateUser', user).finally(() => {
            this.snackBar.open(`${user.nick} updated successfully`, 'Close', {
                duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
            })
        })
	}

	async updateFriends(friends: Array<UserI>, id: string)
	{
		return await axios.put('http://localhost:3000/auth/updateFriends', {friends, id})
	}
	async addMatch(match: string, id: string)
	{
		return await axios.put('http://localhost:3000/auth/addMatch', {match, id})
	}

	async getUserById(id: string)
	{
		const url: string = `http://localhost:3000/auth/getUserById/${id}`
		return axios.get(url)
	}

    async getRuteQr()
    {
        return await axios.get('http://localhost:3000/auth/assets/qrImage.png')
        
    }
}
