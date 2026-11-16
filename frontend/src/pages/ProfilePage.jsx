import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateAvatar } from "../services/auth.service";
import { getMyPosts } from "../services/post.service";
import PostCard from "../components/PostCard";

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const imageUrl = user?.avatar ? `http://localhost:5001${user.avatar}` : null;

  const fetchMyPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!avatarFile) {
      setMessage("Zgjedh një foto");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const data = await updateAvatar(formData);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Profile photo u ndryshua me sukses");
    } catch (error) {
      setMessage(error.response?.data?.message || "Gabim gjatë upload-it");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
              {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}
            </h1>
            <p className="text-gray-600">@{user?.username || "username"}</p>
            <p className="text-gray-600">{user?.email || "No email"}</p>
            <p className="text-sm text-gray-500 mt-1">Posts: {posts.length}</p>
          </div>
        </div>

        <form onSubmit={handleAvatarUpload} className="mt-6 space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="block"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Upload Profile Photo
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">My Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">Nuk ke postime ende.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onRefresh={fetchMyPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;