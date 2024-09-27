import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule]
})
export class HeaderComponent {
  menuOpen = false; // Estado del menú

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Cambiar el estado del menú
  }
}
