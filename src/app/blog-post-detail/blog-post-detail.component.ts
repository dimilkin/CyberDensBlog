import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {BlogPost} from "../models";
import {NgIf} from "@angular/common";
import {BlogPostService} from "../services/blog-post.service";

@Component({
  selector: 'app-blog-post-detail',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './blog-post-detail.component.html',
  styleUrl: './blog-post-detail.component.css'
})
export class BlogPostDetailComponent implements OnInit{

  post: BlogPost | undefined;

  constructor(private route: ActivatedRoute, private blogPostService: BlogPostService) {}

  ngOnInit() {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.post = this.blogPostService.getPostById(postId);
  }

}
