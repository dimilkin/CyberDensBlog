import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { BlogPost } from "../models";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { tap, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  private postsUrlBg = 'assets/articles-bg/posts.json';  // Path to Bulgarian JSON file
  private postsUrlEn = 'assets/articles-en/posts.json';  // Path to English JSON file
  private postsCacheBg: BlogPost[] | null = null;
  private postsCacheEn: BlogPost[] | null = null;

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private localeId: string
  ) {}

  /** Get posts based on locale */
  public getPosts(): Observable<BlogPost[]> {
    return this.localeId === 'bg' ? this.getPostsBg() : this.getPostsEn();
  }

  /** Get a post by ID */
  public getPostById(id: number): Observable<BlogPost | undefined> {
    return this.getPosts().pipe(
      map(posts => posts.find(post => post.id === id))
    );
  }

  /** Fetch Bulgarian posts with caching */
  private getPostsBg(): Observable<BlogPost[]> {
    if (this.postsCacheBg) {
      return of(this.postsCacheBg);
    }
    return this.http.get<BlogPost[]>(this.postsUrlBg).pipe(
      tap(posts => this.postsCacheBg = posts)
    );
  }

  /** Fetch English posts with caching */
  private getPostsEn(): Observable<BlogPost[]> {
    if (this.postsCacheEn) {
      return of(this.postsCacheEn);
    }
    return this.http.get<BlogPost[]>(this.postsUrlEn).pipe(
      tap(posts => this.postsCacheEn = posts)
    );
  }
}
