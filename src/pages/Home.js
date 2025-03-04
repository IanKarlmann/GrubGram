import React, { useState } from "react";
import Topbar from "../components/topbar/Topbar";
import Sidebar from "../components/sidebar/Sidebar";
import CreatePostForm from "../components/forms/CreatePostForm";
import Feed from "../components/feed/Feed";
import axios from "axios";
import "./home.css"; // Add styles for centering

export default function Home() {
    const [showForm, setShowForm] = useState(false);

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleCreatePost = async (newPost) => {
        try {
            const response = await axios.post("/api/posts", newPost, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            console.log("Post created:", response.data);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <>
            <Topbar toggleForm={toggleForm} />
            <Sidebar />
            <div className="home">
                <Feed />

                {/* Show Form Centered on Screen */}
                {showForm && (
                    <div className="overlay" onClick={toggleForm}>
                        <div className="formContainer" onClick={(e) => e.stopPropagation()}>
                            <CreatePostForm onCreatePost={handleCreatePost} />
                            <button className="closeButton" onClick={toggleForm}>✖</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

