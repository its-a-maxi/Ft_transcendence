import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-service/auth.service';
import jwt_decode from "jwt-decode";

interface TokenI
{
    id: number;
    loginName: string;
    userEmail: string;
    exp: number;
    iat: number;
}

@Injectable({
	providedIn: 'root'
})
export class CookieGuard implements CanActivate
{
	constructor(private cookieService: CookieService,
                private authService: AuthService,
                private router: Router) {}

	canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
        const token = this.cookieService.get('clientID')
        const decoded: TokenI = jwt_decode(token)
        //console.log("TOKEN: ", decoded.iat - decoded.exp)
        console.log("NEW DATE", new Date(decoded.exp * 1000))
		if (token)
		{
			return true;
		}

        this.router.navigate([''])
		return false
	}

}
