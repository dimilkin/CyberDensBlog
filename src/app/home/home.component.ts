import {Component, OnInit} from '@angular/core';
import {BlogPost} from "../models";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {BlogPostComponent} from "../blog-post/blog-post.component";
import {FooterComponent} from "../footer/footer.component";
import {BlogPostService} from "../services/blog-post.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    HeaderComponent,
    BlogPostComponent,
    FooterComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  posts: BlogPost[] = [];

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit() {
    this.posts = this.blogPostService.getPosts();
  }
}
