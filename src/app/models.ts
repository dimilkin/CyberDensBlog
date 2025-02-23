export interface BlogPost {
  id: number;         // Unique identifier for the post (useful for routing)
  title: string;      // Title of the blog post
  content: string;    // Main content of the blog post
  date: string;       // Date the post was published
  author?: string;    // Optional author name
  imageUrl?: string;  // Optional image for the post (if any)
}
