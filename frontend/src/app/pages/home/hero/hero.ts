import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class Hero {
  constructor(private router: Router) {}

  illustration: string = 'public/assets/homeimage.png';

}