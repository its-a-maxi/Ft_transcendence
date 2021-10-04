import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { NavigationComponent } from '../../components/navigation/navigation.component';
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
                private cookieService: CookieService,) { this.selectedUser = new User()}

	// async getAuthUser()
	// {
	// 	return await axios.get<User>(this.API_URL_GET)
	// }

	// async postAuthUser(user: UserI)
	// {
	// 	return await axios.post(this.API_URL_POST, user)
	// }

    async refreshToken()
    {
        console.log("ENTRA REFRESH")
        return await axios.post("http://localhost:3000/auth/refresh")
    }

	async showAllUsers()
	{
		return await axios.get<User[]>('http://localhost:3000/auth/AllUsers')
	}

    // showUsers_test(): Observable<UserI[]>
    // {
    //     return this.http.get<UserI[]>('http://localhost:3000/auth/AllUsers_test')
    // }

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

	// statusLogin()
	// {
	// 	return !!localStorage.getItem('nick')
	// }

	async twoFactor()
	{
		return await axios.get('http://localhost:3000/auth/2fa')
	}

    // twoFactor_test(): Observable<any>
	// {
	// 	return this.http.get<any>('http://localhost:3000/auth/2fa_test')
	// }

	async verifyCode(num: any)
	{
		return await axios.post('http://localhost:3000/auth/verify', num)
	}

	async createAvatar(image: File | undefined)
	{
		const fd = new FormData()
		fd.append('image', <File>image)
		return await axios.post('http://localhost:3000/auth/image', fd)
	}

	async updateUser(user: User)
	{
		return await axios.put<User>('http://localhost:3000/auth/updateUser', user)
	}

	async updateFriends(friends: Array<UserI>, id: string)
	{
		return await axios.put('http://localhost:3000/auth/updateFriends', {friends, id})
	}
	async addMatch(match: string, id: string)
	{
		return await axios.put('http://localhost:3000/auth/addMatch', {match, id})
	}

	async enableTwofactor()
	{
		//return await axios.put<User>('http://localhost:3000/auth/updateUser', user)
	}

	async getUserById(id: string)
	{
		const url: string = `http://localhost:3000/auth/getUserById/${id}`
		return axios.get(url)
	}
}
