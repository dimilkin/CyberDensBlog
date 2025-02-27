import {Component, OnDestroy, OnInit} from '@angular/core';
import {BlogPost} from "../models";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HeaderComponent} from "../header/header.component";
import {BlogPostComponent} from "../blog-post/blog-post.component";
import {FooterComponent} from "../footer/footer.component";
import {BlogPostService} from "../services/blog-post.service";
import {HttpClientModule} from "@angular/common/http";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    HeaderComponent,
    BlogPostComponent,
    FooterComponent,
    HttpClientModule
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{

  posts: BlogPost[] = [];
  private postsSubscription!: Subscription;

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit() {
    this.postsSubscription = this.blogPostService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe(); // Cleanup to prevent memory leaks
    }
  }
}
