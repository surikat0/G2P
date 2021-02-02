import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  imageSrc = 'assets/images/logo.png'  
  imageAlt = 'iPhone'
  constructor() { }

  ngOnInit(): void {
  }

}
