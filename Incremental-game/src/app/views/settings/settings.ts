import { Component } from '@angular/core';
import { ConfigForm } from '../../components/config-form/config-form';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ConfigForm, RouterLink],
  templateUrl: './settings.html'
})
export class Settings {}

