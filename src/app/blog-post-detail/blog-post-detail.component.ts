import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BlogPost} from "../models";
import {NgIf} from "@angular/common";
import {BlogPostService} from "../services/blog-post.service";
import {HttpClientModule} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-blog-post-detail',
  standalone: true,
  imports: [
    NgIf,
    HttpClientModule
  ],
  templateUrl: './blog-post-detail.component.html',
  styleUrl: './blog-post-detail.component.css'
})
export class BlogPostDetailComponent implements OnInit, OnDestroy {
  post: BlogPost | undefined;
  private postSubscription!: Subscription; // Store subscription

  constructor(private route: ActivatedRoute, private blogPostService: BlogPostService) {}

  ngOnInit() {
    const postId = Number(this.route.snapshot.paramMap.get('id'));

    this.postSubscription = this.blogPostService.getPostById(postId).subscribe(post => {
      this.post = post;
    });
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe(); // Prevent memory leaks
    }
  }

}
