import {Component, Input} from '@angular/core';
import {ThemeService} from "../../services/theme.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isDarkMode = false;

  logoLightPath: string = '../../../assets/images/logo-nero.png';
  logoDarkPath: string = '../../../assets/images/logo-bianco.png';

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
