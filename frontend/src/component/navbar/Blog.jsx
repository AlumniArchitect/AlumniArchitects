import React, { useState, useEffect, useCallback } from "react";

import {
  PenSquare,
  BookOpen,
  User,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import "../../style/navbar/Blog.css";
import Constant from "../../utils/Constant.js";
 
const BlogUI = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("view");
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [comment, setComment] = useState("");
  const [activeBlogId, setActiveBlogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
 
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwt");
 
 
  const fetchAllBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const url = `${Constant.BASE_URL}/api/suggest/blog/${email}/${page}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      if (!Array.isArray(data)) return;
 
      setAllBlogs((prev) => (page === 1 ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Error fetching all blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [email, token]);
 
 
  const fetchMyBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${Constant.BASE_URL}/api/blog?email=${email}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      if (!response.ok) throw new Error("Failed to fetch my blogs");
      const data = await response.json();
      if (!Array.isArray(data)) return;
 
      setMyBlogs(data);
    } catch (error) {
      console.error("Error fetching my blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [email, token]);
 

  useEffect(() => {
    if (activeTab === "view") fetchAllBlogs(page);
    if (activeTab === "my-blogs") fetchMyBlogs();
  }, [fetchAllBlogs, fetchMyBlogs, activeTab, page]);
 
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);
 
  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
 
  // Handle creating a new blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.content.trim()) return;
 
    const blog = {
      email: email,
      author: localStorage.getItem("fullName"),
      title: newBlog.title,
      content: newBlog.content,
      upvote: 0,
      comments: [],
    };
 
    try {
      const response = await fetch(`${Constant.BASE_URL}/api/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blog),
      });
      if (response.ok) {
        const createdBlog = await response.json();
        setMyBlogs((prev) => [createdBlog, ...prev]);
        setAllBlogs((prev) => [createdBlog, ...prev]);
        setNewBlog({ title: "", content: "" });
        setActiveTab("view");
      }
    } catch (error) {
      console.error("Failed to create blog:", error);
    }
  };
 
  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const url =
        activeTab === "my-blogs"
          ? `${Constant.BASE_URL}/api/blog?email=${email}&page=${page}`
          : `${Constant.BASE_URL}/api/suggest/blog/${email}/${page}`;
 
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch blogs");
      }
 
      const data = await response.json();
 
      if (!Array.isArray(data)) {
        console.error("Unexpected data format:", data);
        return;
      }
 
      if (activeTab === "my-blogs") {
        setMyBlogs((prev) => (page === 1 ? data : [...prev, ...data]));
      } else {
        setAllBlogs((prev) => (page === 1 ? data : [...prev, ...data]));
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, email, token]);
 
  // Handle liking a blog
  const handleLike = async (blogId) => {
    try {
      const response = await fetch(
        `${Constant.BASE_URL}/api/blog/update-upvote/${blogId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const updatedBlog = await response.json();
        const updateState = (prev) =>
          prev.map((blog) => (blog.id === blogId ? updatedBlog : blog));
        if (activeTab === "my-blogs") {
          setMyBlogs(updateState);
        } else {
          setAllBlogs(updateState);
        }
      }
    } catch (error) {
      console.error("Failed to upvote blog:", error);
    }
  };
 
  // handel comment blog
  const handleComment = async (blogId) => {
    if (!comment.trim()) return;
 
    try {
      const response = await fetch(
        `${Constant.BASE_URL}/api/blog/${blogId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: email, text: comment }),
        }
      );
      if (response.ok) {
        const updatedBlog = await response.json();
        const updateState = (prev) =>
          prev.map((blog) => (blog.id === blogId ? updatedBlog : blog));
        if (activeTab === "my-blogs") {
          setMyBlogs(updateState);
        } else {
          setAllBlogs(updateState);
        }
        setComment("");
        setActiveBlogId(null);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };
 
  // handle delete blog
  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await fetch(
        `${Constant.BASE_URL}/api/blog/${blogId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        if (activeTab === "my-blogs") {
          setMyBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
        } else {
          setAllBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
        }
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };
 
  // Render sidebar
  const renderSidebar = () => (
    <div className="sidebar">
      <button
        className={`tab-button ${activeTab === "create" ? "active" : ""}`}
        onClick={() => setActiveTab("create")}
      >
        <PenSquare className="w-5 h-5" />
        Create Blog
      </button>
      <button
        className={`tab-button ${activeTab === "my-blogs" ? "active" : ""}`}
        onClick={() => setActiveTab("my-blogs")}
      >
        <User className="w-5 h-5" />
        My Blogs
      </button>
      <button
        className={`tab-button ${activeTab === "view" ? "active" : ""}`}
        onClick={() => setActiveTab("view")}
      >
        <BookOpen className="w-5 h-5" />
        All Blogs
      </button>
    </div>
  );
 
  // Render create blog form
 const renderCreateBlog = () => (
  <div className="create-blog">
    {/* Heading */}
    <h2 className="text-2xl font-bold mb-4">Create a New Blog Post</h2>
    <form onSubmit={handleCreateBlog}>
      {/* Title Input */}
      <input
        type="text"
        value={newBlog.title}
        onChange={(e) =>
          setNewBlog((prev) => ({ ...prev, title: e.target.value }))
        }
        placeholder="Title"
        className="textarea-field-title"
        required
      />
      {/* Content Textarea */}
      <textarea
        value={newBlog.content}
        onChange={(e) =>
          setNewBlog((prev) => ({ ...prev, content: e.target.value }))
        }
        placeholder="Write your blog post here..."
        className="textarea-field-content"
        required
      ></textarea>
      {/* Publish Button */}
      <button type="submit" className="button">
        Publish Blog
      </button>
    </form>
  </div>
);
 
  // render blog card
  const renderBlogCard = (blog) => (
    <article key={blog.id} className="blog-card">
      <div className="blog-card-content">
        <h2 className="blog-card-title">{blog.title}</h2>
        <p className="blog-card-excerpt">{blog.content}</p>
 
        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="blog-card-author-avatar">
              <User className="w-5 h-5" />
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
              {blog.upvote}
            </button>
            <button
              onClick={() =>
                setActiveBlogId(activeBlogId === blog.id ? null : blog.id)
              }
              className="blog-card-stat"
            >
              <MessageCircle className="w-4 h-4" />
              {blog.comments.length}
            </button>
            {activeTab === "my-blogs" && blog.email === email && (
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
            {blog.comments.map((comment) => (
              <div key={comment.id} className="blog-comment">
                <div className="blog-comment-header">
                  <span className="blog-comment-author">{comment.author}</span>
                  <span className="blog-comment-date">
                    {format(new Date(comment.createdAt), "MMM d, yyyy")}
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
 
  // Render a single blog card
  const renderBlogs = () => {
    const blogs = activeTab === "my-blogs" ? myBlogs : allBlogs;
 
    return (
      <div className="blog-list">
        <div className="blog-list-header">
          <h1 className="blog-list-title">
            {activeTab === "my-blogs" ? "My Blog Posts" : "Latest Blog Posts"}
          </h1>
          <p className="blog-list-description">
            {activeTab === "my-blogs"
              ? "Manage and view your published blog posts"
              : "Discover insightful articles from our community"}
          </p>
        </div>
        <div className="blog-card-list">
          {blogs.map(renderBlogCard)}
          {loading && <p>Loading...</p>}
          {blogs.length === 0 && !loading && <p>No blogs available.</p>}
        </div>
      </div>
    );
  };
 
  return (
    <div className="blog-ui">
      {renderSidebar()}
      <div className="content">
        {activeTab === "create" ? renderCreateBlog() : renderBlogs()}
      </div>
    </div>
  );
};
 
export default BlogUI;