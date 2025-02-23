import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  selectedLang = 'en';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['lang']) {
        this.selectedLang = params['lang'];
      }
    });
  }

  changeLanguage(event: Event) {
    const newLang = (event.target as HTMLSelectElement).value;
    const currentLang = this.selectedLang;
    const currentPath = this.router.url.replace(`/${currentLang}`, '');

    this.router.navigate([`/${newLang}${currentPath}`]);
  }
}
