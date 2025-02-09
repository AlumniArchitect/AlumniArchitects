import React, { useState } from "react";
import "../../style/navbar/Blog.css";
import { 
  PenSquare, 
  BookOpen, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Calendar 
} from "lucide-react";
import { format } from "date-fns";

const INITIAL_BLOGS = [
  {
    id: 1,
    title: "React 18 Features Deep Dive",
    content: "Just finished exploring the latest features in React 18! The automatic batching and transitions are absolute game-changers for performance optimization. Here's what I learned...",
    author: "Alice Johnson",
    category: "Technical",
    createdAt: new Date("2024-02-08"),
    likes: 12,
    dislikes: 0,
    comments: [],
    likedBy: [],
    dislikedBy: []
  },
  {
    id: 2,
    title: "Modern State Management",
    content: "Deep dive into modern state management patterns in React. Comparing Context API, Redux, and Zustand with real-world examples and performance benchmarks...",
    author: "Bob Smith",
    category: "Tutorial",
    createdAt: new Date("2024-02-07"),
    likes: 8,
    dislikes: 1,
    comments: [],
    likedBy: [],
    dislikedBy: []
  }
];

const BlogUI = () => {
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [activeTab, setActiveTab] = useState('view');
  const [newBlog, setNewBlog] = useState('');
  const [comment, setComment] = useState('');
  const [activeBlogId, setActiveBlogId] = useState(null);
  const currentUser = localStorage.getItem("fullName"); // Get the current user's name from localStorage

  const handleCreateBlog = (e) => {
    e.preventDefault();
    if (!newBlog.trim()) return;

    const blog = {
      id: blogs.length + 1,
      title: newBlog.split('\n')[0] || 'Untitled',
      content: newBlog,
      author: currentUser, // Set the author to the current user
      profilePic: localStorage.getItem("profileImageUrl") || "https://i.pravatar.cc/50",
      category: 'General',
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      comments: [],
    };

    setBlogs([blog, ...blogs]);
    setNewBlog('');
    setActiveTab('view');
  };

  const handleLike = (blogId) => {
    setBlogs(blogs.map(blog => {
      if (blog.id === blogId) {
        const hasLiked = blog.likedBy?.includes(currentUser);
        const hasDisliked = blog.dislikedBy?.includes(currentUser);
  
        if (hasLiked) return blog; // User has already liked the blog
  
        return {
          ...blog,
          likes: blog.likes + 1,
          dislikes: hasDisliked ? blog.dislikes - 1 : blog.dislikes,
          likedBy: [...(blog.likedBy || []), currentUser],
          dislikedBy: hasDisliked 
            ? blog.dislikedBy.filter(user => user !== currentUser) 
            : blog.dislikedBy
        };
      }
      return blog;
    }));
  };
  
  const handleDislike = (blogId) => {
    setBlogs(blogs.map(blog => {
      if (blog.id === blogId) {
        const hasDisliked = blog.dislikedBy?.includes(currentUser);
        const hasLiked = blog.likedBy?.includes(currentUser);
  
        if (hasDisliked) return blog; // User has already disliked the blog
  
        return {
          ...blog,
          dislikes: blog.dislikes + 1,
          likes: hasLiked ? blog.likes - 1 : blog.likes,
          dislikedBy: [...(blog.dislikedBy || []), currentUser],
          likedBy: hasLiked 
            ? blog.likedBy.filter(user => user !== currentUser) 
            : blog.likedBy
        };
      }
      return blog;
    }));
  };  
  
  const handleComment = (blogId) => {
    if (!comment.trim()) return;

    setBlogs(blogs.map(blog => 
      blog.id === blogId 
        ? {
            ...blog,
            comments: [...blog.comments, {
              id: blog.comments.length + 1,
              text: comment,
              author: currentUser,
              createdAt: new Date()
            }]
          }
        : blog
    ));

    setComment('');
    setActiveBlogId(null);
  };

  const handleDeleteBlog = (blogId) => {
    setBlogs(blogs.filter(blog => blog.id !== blogId));
  };

  const renderSidebar = () => (
    <div className="sidebar">
      <button 
        className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
        onClick={() => setActiveTab('create')}
      >
        <PenSquare className="w-5 h-5" />
        Create Blog
      </button>
      <button 
        className={`tab-button ${activeTab === 'my-blogs' ? 'active' : ''}`}
        onClick={() => setActiveTab('my-blogs')}
      >
        <User className="w-5 h-5" />
        My Blogs
      </button>
      <button 
        className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
        onClick={() => setActiveTab('view')}
      >
        <BookOpen className="w-5 h-5" />
        All Blogs
      </button>
    </div>
  );

  const renderCreateBlog = () => (
    <div className="create-blog">
      <h2 className="text-2xl font-bold mb-4">Create a New Blog Post</h2>
      <form onSubmit={handleCreateBlog}>
        <textarea
          value={newBlog}
          onChange={(e) => setNewBlog(e.target.value)}
          placeholder="Write your blog post here..."
          className="textarea-field"
          required
        />
        <button type="submit" className="button">
          Publish Blog
        </button>
      </form>
    </div>
  );

  const renderBlogCard = (blog) => (
    <article key={blog.id} className="blog-card">
      <div className="blog-card-content">
        <div className="blog-card-header">
          <span className="blog-card-category">{blog.category}</span>
          <span className="blog-card-date">
            <Calendar className="w-4 h-4" />
            {format(blog.createdAt, "MMM d, yyyy")}
          </span>
        </div>
        
        <h2 className="blog-card-title">{blog.title}</h2>
        <p className="blog-card-excerpt">{blog.content}</p>
        
        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="blog-card-author-avatar">
              <img src={blog.profilePic} alt="Profile" />
            </div>
            <div className="blog-card-author-info">
              <span className="blog-card-author-name">{blog.author}</span>
              <span className="blog-card-author-role">Author</span>
            </div>
          </div>
          
          <div className="blog-card-stats">
            <button 
              onClick={() => handleLike(blog.id)}
              className="blog-card-stat"
            >
              <ThumbsUp className="w-4 h-4" />
              {blog.likes}
            </button>
            <button 
              onClick={() => handleDislike(blog.id)}
              className="blog-card-stat"
            >
              <ThumbsDown className="w-4 h-4" />
              {blog.dislikes}
            </button>
            <button 
              onClick={() => setActiveBlogId(activeBlogId === blog.id ? null : blog.id)}
              className="blog-card-stat"
            >
              <MessageCircle className="w-4 h-4" />
              {blog.comments.length}
            </button>
            {blog.author === currentUser && (
              <button 
                onClick={() => handleDeleteBlog(blog.id)}
                className="blog-card-stat text-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {activeBlogId === blog.id && (
          <div className="blog-card-comments">
            {blog.comments.map(comment => (
              <div key={comment.id} className="blog-comment">
                <div className="blog-comment-header">
                  <span className="blog-comment-author">{comment.author}</span>
                  <span className="blog-comment-date">
                    {format(comment.createdAt, "MMM d, yyyy")}
                  </span>
                </div>
                <p className="blog-comment-text">{comment.text}</p>
              </div>
            ))}
            <div className="blog-comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="textarea-field"
              />
              <button 
                onClick={() => handleComment(blog.id)}
                className="button"
              >
                Post Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );

  const renderBlogs = () => {
    const filteredBlogs = activeTab === 'my-blogs'
      ? blogs.filter(blog => blog.author === currentUser) // Filter blogs by the current user
      : blogs;

    return (
      <div className="blog-list">
        <div className="blog-list-header">
          <h1 className="blog-list-title">
            {activeTab === 'my-blogs' ? 'My Blog Posts' : 'Latest Blog Posts'}
          </h1>
          <p className="blog-list-description">
            {activeTab === 'my-blogs'
              ? 'Manage and view your published blog posts'
              : 'Discover insightful articles from our community'}
          </p>
        </div>
        <div className="blog-card-list">
          {filteredBlogs.map(renderBlogCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="blog-ui">
      {renderSidebar()}
      <div className="content">
        {activeTab === 'create' ? renderCreateBlog() : renderBlogs()}
      </div>
    </div>
  );
};

export default BlogUI;