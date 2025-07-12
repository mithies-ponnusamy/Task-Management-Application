import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { About } from '../about/about';
import { Header } from '../header/header';
import { Hero } from '../hero/hero';
import { BackToTop } from '../back-to-top/back-to-top';
import { Features } from '../features/features';
import { Impacts } from '../impacts/impacts';
import { Testimonials } from '../testimonials/testinomials';
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Hero,
    Header,
    About,
    BackToTop,
    Features,
    Impacts,
    Testimonials,
    Contact,
    Footer
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  title = 'GenFlow - Task Management';
}