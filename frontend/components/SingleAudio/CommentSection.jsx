import React from "react";
import "./../../styles/styles.css";

export default function CommentSection({
  comment,
  indent = 0,
  user,
  reaction,
  activeReplyId,
  setActiveReplyId,
  replyText,
  setReplyText,
  onReplySubmit,
  onLike,
  onDislike,
}) {
  console.log(comment);
  // const user = userMap?.[comment.userID];
  console.log("inside commentSection", reaction);
  const reaction1 = reaction[comment.id] || { like: 0, dislike: 0 };
  const isReplying = activeReplyId === comment.id;

  return (
    <div style={{ marginLeft: `${indent}px`, paddingTop: "10px" }}>
      <ul key={comment.id} style={{ listStyle: "none", paddingLeft: 0 }}>
        <h5 className="text">
          {/* {userMap[comment.userID]
            ? `User: ${userMap[comment.userID].username}`
            : "Unknown User"} */}
          {user ? `User: ${user.username}` : "Unknown User"}
        </h5>
        <h5 className="text">{`Comment: ${comment.commentText}`}</h5>

        {reaction && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h5 className="text">Likes: {reaction1.like ?? 0}</h5>
            <h5 className="text">Dislikes: {reaction1.dislike ?? 0}</h5>
          </div>
        )}

        <button className="button" onClick={() => onLike(comment.id)}>
          Like
        </button>
        <button className="button" onClick={() => onDislike(comment.id)}>
          Dislike
        </button>
        <button className="button" onClick={() => setActiveReplyId(comment.id)}>
          Reply
        </button>

        {isReplying && (
          <form onSubmit={onReplySubmit}>
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

        <h6 className="text">{`Created At: ${comment.created_at}`}</h6>
      </ul>

      {comment.childComments?.length > 0 &&
        comment.childComments.map((child) => (
          <CommentSection
            key={child.id}
            comment={child}
            indent={indent + 30}
            user={child.user}
            reaction={reaction}
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
