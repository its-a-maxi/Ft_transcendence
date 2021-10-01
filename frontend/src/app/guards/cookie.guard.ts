import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CookieGuard implements CanActivate
{
	constructor(private cookieService: CookieService) {}

	canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
	{
		// if (this.cookieService.get('clientID'))
		// {
		// 	return true;
		// }
		return true
	}

}
