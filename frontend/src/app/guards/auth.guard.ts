import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService){


  }

  
 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
    if(!this.userService.isLogged()){
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
 }

  
    
  
}
