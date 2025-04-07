import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../components/topbar/Topbar";
import DashboardLayoutBasic from "../components/sidebar/Sidebar"; 
import Feed from "../components/feed/Feed";
import CreatePostForm from "../components/forms/CreatePostForm";
import "./home.css";
import io from "socket.io-client";

const API_BASE_URL = "http://localhost:5001/api/posts"; // backend URL

export default function Home() {
    const [posts, setPosts] = useState([]);  
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPosts(); // load posts on mount

        const socket = io("http://localhost:5001");

        socket.on("newPost", (post) =>{
            setPosts((prevPosts) => [post, ...prevPosts]);
        });

        return () => {
            socket.disconnect();
        };

    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required
                },
            });
            
            // Handle different API response structures
            const postsData = Array.isArray(response.data) ? response.data : (response.data.posts || []);
                
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const handleCreatePost = async (newPost) => {
        const token = localStorage.getItem("token");
  
        console.log("Full Authorization Header:", {
            original: `Bearer ${token}`,
            tokenLength: token ? token.length : 'No Token'
        });

        try {
            const response = await axios.post(API_BASE_URL, newPost, {
            headers: {
                Authorization: `Bearer ${token}`, // Explicitly construct Bearer token
                'Content-Type': 'multipart/form-data', // Set content type for file upload
            },
        });
    
        console.log("Post created successfully:", response.data);
        setPosts((prevPosts) => [response.data, ...prevPosts]); 
        setShowForm(false);
        } catch (error) {
            console.error("Error creating post:", error);

            if (error.response) {
                console.error("Error Response Data:", error.response.data);
                console.error("Status Code:", error.response.status);
            }

            alert("Failed to create post. Please try again.");
        }
    };

    const handleCancelPost = () => {
        setShowForm(false);
    };

    return (
        <>
            <Topbar toggleForm={toggleForm} />
            <div className="home-container">
                {/* Keep the original dashboard layout */}
                <DashboardLayoutBasic />
                
                {/* Add our feed overlay that sits on top */}
                <div className="feed-overlay">
                    {showForm && (
                        <CreatePostForm 
                            onCreatePost={handleCreatePost} 
                            onCancel={handleCancelPost} 
                        />
                    )}
                    <Feed posts={posts} />
                </div>
            </div>
        </>
    );
}
