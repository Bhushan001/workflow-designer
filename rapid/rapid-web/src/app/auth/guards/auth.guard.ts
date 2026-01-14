import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, map, Observable, of, tap } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private _userService: UserService
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this._userService.validateToken().pipe(
            map((isAuthenticated) => {
                if (isAuthenticated) {
                    return true;
                } else {
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                }
            }),
            catchError(() => {
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return of(false);
            })
        );
    }
}
