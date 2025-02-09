

import React, { useState } from "react";
import '../../style/navbar/Blog.css';

const BlogUI = () => {
  const [blogs, setBlogs] = useState([
    { user: "Alice", content: "My first blog post!", replies: [], likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] },
    { user: "Bob", content: "Exploring React components.", replies: [], likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] },
    { user: "Charlie", content: "Understanding state management.", replies: [], likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] }
  ]);
  const [newBlog, setNewBlog] = useState("");
  const [user, setUser] = useState("akash");
  const [activeTab, setActiveTab] = useState("create");
  const [replyContent, setReplyContent] = useState("");
  const [selectedBlogIndex, setSelectedBlogIndex] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [dislikedBlogs, setDislikedBlogs] = useState([]);

  const addBlog = () => {
    if (newBlog.trim()) {
      const newEntry = { user, content: newBlog, replies: [], likes: 0, dislikes: 0, likedBy: [], dislikedBy: [] };
      setBlogs((prevBlogs) => [newEntry, ...prevBlogs]);
      setNewBlog("");
    }
  };

  const deleteBlog = (index) => {
    setBlogs(blogs.filter((_, i) => i !== index));
  };

  const addReply = (index) => {
    if (replyContent.trim()) {
      const updatedBlogs = [...blogs];
      updatedBlogs[index].replies.push({ user: "Guest", content: replyContent });
      setBlogs(updatedBlogs);
      setReplyContent("");
      setSelectedBlogIndex(null);
    }
  };
  const handleResize = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const likeBlog = (index) => {
    if (!likedBlogs.includes(index)) {
      if (dislikedBlogs.includes(index)) {
        const updatedBlogs = [...blogs];
        updatedBlogs[index].dislikes -= 1;
        setBlogs(updatedBlogs);
        setDislikedBlogs(prev => prev.filter(i => i !== index));
      }
      const updatedBlogs = [...blogs];
      updatedBlogs[index].likes += 1;
      setBlogs(updatedBlogs);
      setLikedBlogs((prev) => [...prev, index]);
    }
  };

  const dislikeBlog = (index) => {
    if (!dislikedBlogs.includes(index)) {
      if (likedBlogs.includes(index)) {
        const updatedBlogs = [...blogs];
        updatedBlogs[index].likes -= 1;
        setBlogs(updatedBlogs);
        setLikedBlogs(prev => prev.filter(i => i !== index));
      }
      const updatedBlogs = [...blogs];
      updatedBlogs[index].dislikes += 1;
      setBlogs(updatedBlogs);
      setDislikedBlogs((prev) => [...prev, index]);
    }
  };

  return (
    <div className="blog-ui" id="blog">
      <div className="sidebar">
        <button className={`tab-button ${activeTab === "create" ? "active" : ""}`} onClick={() => setActiveTab("create")}>
          Create Blog
        </button>
        <button className={`tab-button ${activeTab === "myblogs" ? "active" : ""}`} onClick={() => setActiveTab("myblogs")}>
          My Blogs
        </button>
        <button className={`tab-button ${activeTab === "view" ? "active" : ""}`} onClick={() => setActiveTab("view")}>
          View Blogs
        </button>
      </div>

      <div className="content">
        {activeTab === "create" ? (
          <div className="create-blog">
            <textarea
              value={newBlog}
              onChange={(e) => setNewBlog(e.target.value)}
              placeholder="Write your blog content here..."
              className="textarea-field"
              onInput={handleResize}
            />
            <button className="button" onClick={addBlog}>
              Create & Post Blog
            </button>
          </div>
        ) : activeTab === "myblogs" ? (
          <div className="view-blogs">
            {blogs.filter(blog => blog.user === user).map((blog, index) => (
              <div key={index} className="blog-post">
                <p className="blog-user">{blog.user}</p>
                <p className="blog-content">{blog.content}</p>
                <button className="delete-button" onClick={() => deleteBlog(index)}>Delete</button>
                <div className="replies">
                  {blog.replies.map((reply, replyIndex) => (
                    <div key={replyIndex} className="reply">
                      <p className="reply-user">{reply.user}</p>
                      <p className="reply-content">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="view-blogs">
            {blogs.map((blog, index) => (
              <div key={index} className="blog-post">
                <p className="blog-user">{blog.user}</p>
                <p className="blog-content">{blog.content}</p>
                <button onClick={() => likeBlog(index)} className={`like-button ${likedBlogs.includes(index) ? "liked" : ""}`}>
                  Like ({blog.likes})
                </button>
                <button onClick={() => dislikeBlog(index)} className={`dislike-button ${dislikedBlogs.includes(index) ? "disliked" : ""}`}>
                  Dislike ({blog.dislikes})
                </button>
                <button onClick={() => setSelectedBlogIndex(index)} className="reply-button">
                  Reply
                </button>
                {selectedBlogIndex === index && (
                  <div className="reply-form">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply..."
                      className="textarea-field"
                      onInput={handleResize}
                    />
                    <button className="button" onClick={() => addReply(index)}>
                      Post Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogUI;
