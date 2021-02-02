import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-encontrada',
  templateUrl: './no-encontrada.component.html',
  styleUrls: ['./no-encontrada.component.css']
})
export class NoEncontradaComponent implements OnInit {
  imageSrc = 'assets/images/404.png';
  imageMando = 'assets/images/mando.png'
  constructor() { }

  ngOnInit(): void {
  }

}
