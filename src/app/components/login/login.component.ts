import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validateform';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit
{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private toast: NgToastService
  )
  {

  }

  ngOnInit(): void
  {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['string'],
      lastname: ['string'],
      email: ['string'],
      token: ['string'],
      role: ['string'],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.auth.signIn(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.loginForm.reset();
            this.auth.storeToken(res.token)
            this.toast.success(res.message, "SUCCESS", 5000)
            this.router.navigate(['dashboard'])
          },
          error: (err) => {
            this.toast.danger("Something when wrong!","ERROR",5000)
          }
        })
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm)
    }
  }
}
