import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { BlogPostDetailComponent } from "./blog-post-detail/blog-post-detail.component";
import { NgModule } from "@angular/core";
import { AboutMeComponent } from "./about-me/about-me.component";

export const routes: Routes = [
  {
    path: ':lang',
    children: [
      { path: '', component: HomeComponent },
      { path: 'blog-post/:id', component: BlogPostDetailComponent },
      { path: 'about', component: AboutMeComponent },
    ],
  },
  // Redirect root path to default language (e.g., / -> /en)
  { path: '', redirectTo: 'en', pathMatch: 'full' },

  // Optional fallback to handle unknown routes (e.g., 404s)
  { path: '**', redirectTo: 'en' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
