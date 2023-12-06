import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginUsuario: FormGroup;
  loading: boolean = false;

  email: string;
  password: string;
  nombre: string;
  apellido: string;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService
  ) {
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      
    })
  }

  ngOnInit(): void {}

  login() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;
    const nombre = this.loginUsuario.value.nombre;
    const apellido = this.loginUsuario.value.apellido;

    this.loading = true;
    this.afAuth.signInWithEmailAndPassword(email, password).then((user) => {
      if(user.user?.emailVerified) {
        this.router.navigate(['/show']);
      } else {
        this.router.navigate(['/verificar-correo']);
      }
    }).catch((error) => {
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    })
  }
}
