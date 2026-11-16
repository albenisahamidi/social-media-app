import { useEffect, useState } from "react";
import { createPost, getPosts } from "../services/post.service";
import PostCard from "../components/PostCard";

function HomePage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      await createPost(formData);
      setContent("");
      setImage(null);
      setMessage("Post u krijua me sukses");
      fetchPosts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Gabim gjatë postimit");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-xl font-bold mb-4">Create Post</h2>

        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            placeholder="What is on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[120px] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </form>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </div>

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onRefresh={fetchPosts} />
      ))}
    </div>
  );
}

export default HomePage;