import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validarQueSeanIguales: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const password = control.get('contrasena');
  const confirmarPassword = control.get('repetir_contrasena');

  return password.value === confirmarPassword.value
    ? null
    : { noSonIguales: true };
};