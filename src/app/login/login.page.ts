import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isRegister = false;
  loginForm: UntypedFormGroup;
  loadingModal: HTMLIonLoadingElement;
  userName = new UntypedFormControl('', [Validators.required, Validators.maxLength(22)]);
  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  password = new UntypedFormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPass = new UntypedFormControl('', [Validators.required, Validators.minLength(6)]);

  constructor(public loadingController: LoadingController, public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.setLoginForm();
  }

  async presentLoading() {
    this.loadingModal = await this.loadingController.create({
      message: 'Loading',
    });
    await this.loadingModal.present();
  }

  setLoginForm() {
    if (this.isRegister) {
      this.loginForm = new UntypedFormGroup({
        userName: this.userName,
        email: this.email,
        password: this.password,
        confirmPass: this.confirmPass
      })
    }
    else {
      this.loginForm = new UntypedFormGroup({
        email: this.email,
        password: this.password,
      })
    }
  }

  onLoginSubmit() {
    this.presentLoading().then((value) => {
      let confirmPass;
      let userName;
      console.log(this.isRegister);
      if (this.isRegister) {
        confirmPass = this.loginForm.get('confirmPass').value;
        userName = this.loginForm.get('userName').value;
      }
      const email = this.loginForm.get('email').value;
      const password = this.loginForm.get('password').value
      if (this.isRegister) {
        this.authService.registerNewUser(email, confirmPass, userName).then((value) => {
          this.isRegister = false;
          this.loginForm.reset();
          this.loadingModal.dismiss();
          this.informUser('Verification Email Sent',
            'A new email was sent to you, please click on the link on it to verify your email, Thank you!');
        }).catch((error) => {
          this.loginForm.get('password').setValue('');
          this.loginForm.get('confirmPass').setValue('');
          this.loadingModal.dismiss();
          this.informUser(error.code, error.message);
        });
      } else {
        this.authService.signinWithEmailAndPassword(email, password).then((user) => {
          this.loginForm.reset();
          this.loadingModal.dismiss();
          this.router.navigate(['/']);
        }).catch((error) => {
          this.loginForm.get('password').setValue('');
          this.loadingModal.dismiss();
          this.informUser(error.code, error.message);
        })
      }
    });
  }

  async informUser(title: string, body: string) {
    // if (title == 'auth/user-not-found') {
    //   title = 'Error: auth/user-not-found'
    //   body += ' Try creating a new account'
    // } else {
    //   title = 'Error: ' + title;
    // }
    // const modal = await this.modalController.create({
    //   component: UserConfirmationModalComponent,
    //   componentProps: {
    //     'isInforming': true,
    //     'isDeletingBook': false,
    //     title,
    //     body,
    //   }
    // });
    // await modal.present();
  }

  checkPasswordMatch() {
    if (this.isRegister) {
      const pass = this.loginForm.get('password').value;
      const ver = this.loginForm.get('confirmPass').value;
      if (pass === ver) {
        console.log('matches')
      } else {
        console.log('not matching')
        this.loginForm.get('confirmPass').setErrors({ 'notMatch': true });
      }
    }
  }

  onRegister() {

  }

  onLoginWithGoogle() {
    this.authService.signInWithGoogle();
  }

  onLoginWithFacebook() {
    //this.authService.signInWithFacebook();
  }

}
