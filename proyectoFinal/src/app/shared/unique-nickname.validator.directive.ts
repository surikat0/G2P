import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

export function uniqueNicknameValidator(
  userService: UserService
): AsyncValidatorFn {
  return (
    c: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.getUserByNickname(c.value).pipe(
      map((usuarios) => {
        return usuarios && usuarios.length > 0
          ? { uniqueNickname: true }
          : null;
      })
    );
  };
}

@Directive({
  selector: '[uniqueNickname]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: UniqueNicknameValidatorDirective,
      multi: true,
    },
  ],
})
export class UniqueNicknameValidatorDirective implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(
    c: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return uniqueNicknameValidator(this.userService)(c);
}
}
