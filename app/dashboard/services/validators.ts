import { AbstractControl } from '@angular/forms';

export class CustomValidators {
    
    static passwordMatchValidator(control: AbstractControl) {
        const password: string = control.get('user_password').value; // get password from our password form control
        const confirmPassword: string = control.get('user_confirmpassword').value; // get password from our confirmPassword form control
        // compare is the password math
        if (password !== confirmPassword) {
          // if they don't match, set an error in our confirmPassword form control
          control.get('user_confirmpassword').setErrors({ NoPassswordMatch: true });
        }
      }
}
