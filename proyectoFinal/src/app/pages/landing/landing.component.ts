import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  imageSrc = 'assets/images/logo.png';
  imageMando = 'assets/images/mando.png'

  constructor() { }

  ngOnInit(): void {
  }

}
