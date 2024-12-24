import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { ResetPasswordService } from '../../services/reset-password.service';
import { UserStoreService } from '../../services/user-store.service';
import { ResetPassword } from '../../models/reset-password.model';
import { ConfirmPasswordValidator } from '../../helpers/confirm-password.validator';

@Component({
  selector: 'app-reset',
  standalone: false,
  
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private resetService: ResetPasswordService, private router: Router,
    private toast: NgToastService) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    }, {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToken);
      console.log(this.emailToReset);
    });
  }

  reset() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetService.resetPassword(this.resetPasswordObj)
        .subscribe({
          next: (res) => {
            this.toast.success(res.message, "SUCCESS", 5000)
            this.router.navigate(['/'])
          },
          error: (err) => {
            this.toast.danger("Something when wrong!", "ERROR", 5000)
          }
        })
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
