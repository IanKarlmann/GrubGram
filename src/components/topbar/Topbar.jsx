import React from "react";
import "./topbar.css";

export default function Topbar({ toggleForm }) {
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <span className="logo">GrubGram</span>
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
