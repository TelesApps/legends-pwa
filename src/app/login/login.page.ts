import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isRegister = false;
  loginForm: FormGroup;
  loadingModal: HTMLIonLoadingElement;

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
      this.loginForm = new FormGroup({
        userName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPass: new FormControl('', [Validators.required, Validators.minLength(6)])
      })
    }
    else {
      this.loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
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
        this.loginForm.get('confirmPass').setErrors({ 'valid': false });
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
