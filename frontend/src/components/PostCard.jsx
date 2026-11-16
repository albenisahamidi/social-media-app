import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { deletePost, toggleLike, updatePost } from "../services/post.service";
import {
  getComments,
  createComment,
  deleteComment,
} from "../services/comment.service";

function PostCard({ post, onRefresh }) {
  const { user } = useAuth();

  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState(post.content);
  const [showMenu, setShowMenu] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const menuRef = useRef(null);

  const isOwner = user?.id === post.user?._id;

  const fetchComments = useCallback(async () => {
    try {
      const data = await getComments(post._id);
      setComments(data.comments || []);
    } catch (error) {
      console.log(error);
    }
  }, [post._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLike = async () => {
    try {
      await toggleLike(post._id);
      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      setShowMenu(false);
      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      await updatePost(post._id, { content: editContent });
      setEditingPostId(null);
      setShowMenu(false);
      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment(post._id, commentText);
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {post.user?.avatar ? (
            <img
              src={`http://localhost:5001${post.user.avatar}`}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {post.user?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <h3 className="font-bold">
              {post.user?.firstName
                ? `${post.user.firstName} ${post.user.lastName}`
                : post.user?.username || "User"}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl"
            >
              ⋯
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-xl shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setEditingPostId(post._id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {editingPostId === post._id ? (
        <div className="space-y-3 mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full min-h-[100px] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdatePost}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditingPostId(null);
                setEditContent(post.content);
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-4">{post.content}</p>
      )}

      {post.image && (
        <img
          src={`http://localhost:5001${post.image}`}
          alt="post"
          className="w-full max-h-[400px] object-cover rounded-xl mb-4"
        />
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleLike}
          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
        >
          Like ({post.likesCount || 0})
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleComment}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Comment
          </button>
        </div>

        {comments.length > 0 && (
          <div className="space-y-2">
            {comments.map((comment) => {
              const isCommentOwner = user?.id === comment.user?._id;

              return (
                <div
                  key={comment._id}
                  className="bg-gray-50 rounded-lg px-3 py-2 text-sm flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold mr-2">
                      {comment.user?.firstName
                        ? `${comment.user.firstName} ${comment.user.lastName}`
                        : comment.user?.username || "User"}
                    </span>
                    <span>{comment.content}</span>
                  </div>

                  {isCommentOwner && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 text-xs hover:underline ml-3"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;