import {Component, Input} from '@angular/core';
import {BlogPost} from "../models";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css'
})
export class BlogPostComponent {
  @Input() post!: BlogPost;

  constructor(private router: Router) {}

  viewDetails(id: number) {
    // Get the current language (this.selectedLang or from the route)
    const currentLang = 'en';

    // Navigate with the language prefix
    this.router.navigate([`/${currentLang}/blog-post`, id]);
  }

}
