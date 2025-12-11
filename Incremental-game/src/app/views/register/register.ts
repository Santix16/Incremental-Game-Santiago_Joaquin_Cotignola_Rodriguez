import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class Register {
  username = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  register() {
    const user = { username: this.username, password: this.password, points: 0, coins: 0 };
    this.userService.register(user).subscribe(() => {
      alert('Usuario registrado con éxito');
      this.router.navigate(['/']);
    });
  }
}

