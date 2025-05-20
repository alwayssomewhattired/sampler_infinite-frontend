import React from "react";
import "./../../styles/styles.css";

export default function CommentSection({
  comment,
  indent = 0,
  user,
  reaction,
  profileHandle,
  activeReplyId,
  setActiveReplyId,
  replyText,
  setReplyText,
  onReplySubmit,
  onLike,
  onDislike,
}) {
  const reaction1 = reaction[comment.id] || { like: 0, dislike: 0 };
  const isReplying = activeReplyId === comment.id;

  return (
    <div
      style={{ marginLeft: `${indent}px`, paddingTop: "10px" }}
      className="comment-card"
    >
      <ul key={comment.id} className="comment-display">
        <div
          className="comment-header"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            style={{
              display: "flex",
              maxWidth: "2em",
              maxHeight: "2em",
              marginRight: "0.5em",
              cursor: "pointer",
            }}
            onClick={() => profileHandle(comment.userID)}
            src={comment.user.photoId}
            alt="Profile"
          />
          {user ? (
            <h4
              style={{ cursor: "pointer" }}
              onClick={() => profileHandle(comment.userID)}
            >
              {user.username}
            </h4>
          ) : (
            "Unknown User"
          )}
        </div>
        <h5 className="text">{comment.commentText}</h5>

        {reaction && (
          <div className="comment-actions">
            <h5 className="text">Likes: {reaction1.like ?? 0}</h5>
            <h5 className="text">Dislikes: {reaction1.dislike ?? 0}</h5>
          </div>
        )}

        <div className="comment-actions">
          <button className="button" onClick={() => onLike(comment.id)}>
            Like
          </button>
          <button className="button" onClick={() => onDislike(comment.id)}>
            Dislike
          </button>
          <button
            className="button"
            onClick={() => setActiveReplyId(comment.id)}
          >
            Reply
          </button>
        </div>

        {isReplying && (
          <form onSubmit={onReplySubmit} className="comment-reply-form">
            <label className="text">
              Create Reply
              <input
                className="border"
                name="Your reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </label>
            <button className="button">Submit</button>
          </form>
        )}

        <div className="comment-meta">
          {new Date(comment.created_at).toLocaleString()}
        </div>
      </ul>

      {comment.childComments?.length > 0 &&
        comment.childComments.map((child) => (
          <CommentSection
            key={child.id}
            comment={child}
            indent={indent + 30}
            user={child.user}
            reaction={reaction}
            profileHandle={profileHandle}
            activeReplyId={activeReplyId}
            setActiveReplyId={setActiveReplyId}
            replyText={replyText}
            setReplyText={setReplyText}
            onReplySubmit={onReplySubmit}
            onLike={onLike}
            onDislike={onDislike}
          />
        ))}
    </div>
  );
}
