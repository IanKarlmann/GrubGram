import React from "react";
import "./topbar.css";
import { Search } from "@mui/icons-material";

export default function Topbar({ toggleForm }) {
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <span className="logo">GrubGram</span>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <Search className="searchIcon" />
                    <input placeholder="Search for posts" className="searchInput" />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink">Homepage</span>
                </div>
                <button onClick={toggleForm} className="createPostButton">
                    Create Post
                </button>
            </div>
        </div>
    );
}
