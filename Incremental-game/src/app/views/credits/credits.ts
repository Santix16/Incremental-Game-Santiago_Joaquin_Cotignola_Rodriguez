import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credits.html',
  styleUrls: ['./credits.css']
})
export class Credits {
  
  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/menu']);
  }
}