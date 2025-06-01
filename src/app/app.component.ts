import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ToastGlobalComponent } from "./shared/toast-global/toast-global.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgbModule, ToastGlobalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'estacionamento-front-angular';
}
