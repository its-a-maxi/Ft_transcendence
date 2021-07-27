import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from "../models/user";

axios.defaults.withCredentials = true;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL_GET: string = 'http://localhost:3000/auth/authUser'
  API_URL_POST: string = 'http://localhost:3000/auth/storeUser'
  selectedUser: User;

  constructor() { this.selectedUser = new User()}

  async getAuthUser()
  {
      return await axios.get(this.API_URL_GET)
  }

  async postAuthUser(user: User)
  {
     return await axios.post(this.API_URL_POST, user)
  }

  async showAllUsers()
  {
    return await axios.get<User[]>('http://localhost:3000/auth/AllUsers')
  }
}
