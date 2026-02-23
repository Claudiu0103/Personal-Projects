import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { tap, map } from 'rxjs/operators';
import { RoutePaths } from '../../app.routes';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkSession().pipe(
    tap(loggedIn => {
      if (!loggedIn) {
        router.navigate([RoutePaths.login]);
      }
    }),
    map(loggedIn => loggedIn)
  );
};
