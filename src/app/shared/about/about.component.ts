import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  public readonly appName = 'Sistema de Estacionamento';
  public readonly version = '1.0.0';
  public readonly author = 'Xavier';
  public readonly year = new Date().getFullYear();
}
