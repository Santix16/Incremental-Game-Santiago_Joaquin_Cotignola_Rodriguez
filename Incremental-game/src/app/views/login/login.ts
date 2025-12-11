import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  username = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.username, this.password).subscribe(users => {
      if(users.length > 0){
        alert('Login exitoso');
        this.router.navigate(['/game']);
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}

