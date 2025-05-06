import {
  usePostRepliesMutation,
  usePostCommentMutation,
  useReactionCommentMutation,
  // useGetReviewsQuery,
  // useCreateReviewMutation,
} from "./SingleAudioSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./../../styles/styles.css";

import { useSingleAudio } from "../../hooks/useSingleAudio";
import CommentSection from "./CommentSection";

export default function SingleItem({ audioId, me }) {
  const userID = me;
  const itemId = audioId;

  const {
    song,
    comments,
    userNameIds,
    reactions,
    userIds,
    commentIDs,
    refetchAll,
  } = useSingleAudio(audioId);

  const [createCommentMutation, { isLoading, error }] =
    usePostCommentMutation();
  const [commentText, setCommentText] = useState("");

  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const [unauthorize, setUnauthorize] = useState("");

  const [createReactionMutation] = useReactionCommentMutation();

  const likeComment = async (commentID) => {
    try {
      const response = await createReactionMutation({
        commentID,
        reaction: "like",
      }).unwrap();
      await refetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const dislikeComment = async (commentID) => {
    try {
      const response = await createReactionMutation({
        commentID,
        reaction: "dislike",
      }).unwrap();
      await refetchAll();
    } catch (error) {
      console.error(error);
    }
  };

  const commentInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createCommentMutation({
        userID,
        itemId,
        // reviewId,
        commentText,
      }).unwrap();
      await refetchAll();
    } catch (error) {
      if (error.originalStatus === 401) {
        setUnauthorize("Please log in to comment.");
      } else {
        console.error("Something else went wrong", error);
      }
    }
  };

  const [createRepliesMutation] = usePostRepliesMutation();

  const replyInfo = async (e) => {
    e.preventDefault();
    try {
      const parentCommentId = activeReplyId;
      const itemID = audioId;
      const response = await createRepliesMutation({
        replyText,
        parentCommentId,
        itemID,
      }).unwrap();
      await refetchAll();
    } catch (error) {
      if (error.originalStatus === 401) {
        setUnauthorize("Please log in to comment.");
      } else {
        console.error("Something else went wrong", error);
      }
    }
  };

  const userMap = {};
  userNameIds.forEach((user) => {
    userMap[user.id] = user;
  });

  const reactionMap = {};
  reactions.forEach((reaction) => {
    const { commentID, reactionType, _count } = reaction;
    console.log(reaction);
    if (!reactionMap[commentID]) {
      reactionMap[commentID] = { like: 0, dislike: 0 };
    }
    if (reactionType === "like") {
      reactionMap[commentID].like = _count?.reactionType || 0;
    } else if (reactionType === "dislike") {
      reactionMap[commentID].dislike = _count?.reactionType || 0;
    }
  });

  const arr = [];

  if (
    userNameIds.length !== 0 &&
    userIds.length != 0 &&
    commentIDs.length !== 0
  ) {
    for (let i = 0; i < userIds.length; i++) {
      const id = userIds[i];
      const comment_id = commentIDs[i];

      const userObj = userNameIds.find((user) => user.id === id);
      const reactionData = reactionMap[comment_id] || { like: 0, dislike: 0 };

      if (userObj) {
        arr.push({
          id,
          comment_id,
          username: userObj.username,
          reactionsLike: reactionData.like,
          reactionsDislike: reactionData.dislike,
        });
      }
    }
  }

  const renderComment = (comment, indent = 0) => {
    const user = userMap[comment.userID];
    // const user = userMap;
    // console.log("reaction map", reactionMap);
    // const reaction = reactionMap[comment.id] || { like: 0, dislike: 0 };
    const reaction = reactionMap;
    console.log("reaction", reaction);
    return (
      <CommentSection
        key={comment.id}
        comment={comment}
        indent={indent}
        user={user}
        reaction={reaction}
        activeReplyId={activeReplyId}
        setActiveReplyId={setActiveReplyId}
        replyText={replyText}
        setReplyText={setReplyText}
        onReplySubmit={replyInfo}
        onLike={likeComment}
        onDislike={dislikeComment}
      />
    );
  };

  return (
    <>
      <div className="top-bar">
        {me ? (
          <div
            className="menu neu"
            style={{ transform: "translateX(+1040%)", marginBottom: "110px" }}
          >
            <h2 className="li-header">Account</h2>
            <ul>
              <li>
                <Link className="neu" to="/singleUser">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="menu neu">
            <h2 className="li-header">Account</h2>
            <ul>
              <li>
                <Link className="neu" to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link className="neu" to="/register">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="top-bar">
        <div className="menu-l neu">
          <h2 className="li-header">Menu</h2>
          <ul>
            <li>
              <Link className="neu" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="neu" to="/audioCreator">
                samplerinfinite
              </Link>
            </li>
            <li>
              <Link className="neu" to="/audio">
                Published Audio
              </Link>
            </li>
            <li>
              <Link className="neu" to="/granularInfinite">
                granularinfinite
              </Link>
            </li>
            <li>
              <Link className="neu" to="/granularSynth">
                Granular Synth
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        style={{ textAlign: "center", padding: "20px", marginTop: "-350px" }}
      >
        <h1 className="text">Single Audio</h1>
        <div>
          {song && (
            <ul key={song.id}>
              <h2 className="text">{song.name}</h2>
            </ul>
          )}
          <form onSubmit={commentInfo}>
            <label className="text">
              Create comment
              <input
                className="border"
                name="Your comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </label>
            <button className="button">Submit your comment</button>
            {isLoading && <output className="text">Creating comment</output>}
            {error && (
              <output className="error">
                Error creating comment! {error.message}
              </output>
            )}
            {unauthorize && <output className="error">{unauthorize}</output>}
          </form>
          {comments && comments.map((comment) => renderComment(comment))}
        </div>
      </div>
    </>
  );
}

//////////////////////////////////////////////////////////        R E V I E W  S H I T     ///////////////////////////////////////////////////////////////////////

// const { data: reviewData, isSuccess: finished } = useGetReviewsQuery(audioId);
// const [createReviewMutation, isLoading, error] = useCreateReviewMutation();
// const [reviews, setReviews] = useState([]);
// const [reviewText, setReviewText] = useState("");

// useEffect(() => {
//   if (finished) {
//     setReviews(reviewData);
//   }
// }, [reviewData]);

// const reviewInfo = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await createReviewMutation({ itemId, reviewText });
//     navigate("/singleAudio");
//   } catch (error) {
//     console.error(error);
//   }
// };

/* <form onSubmit={reviewInfo}>
            <label className="text">
              Create review
              <input
                className="border"
                name="Your review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </label>
            <button className="button">Submit your review</button>
            {error && (
              <output className="text">
                Error creating review {error.message}
              </output>
            )}
          </form> */

/* {reviews.map((review) => (
            <ul key={review.id}>
              <h4 className="text">{review.userID}</h4>
              <h3 className="text">{review.reviewText}</h3>
              <button
                className="button"
                onClick={() => {
                  setReviewId(review.id), navigate("/singleReview");
                }}
              >
                View review
              </button>
            </ul>
          ))} */

//
//
//
//
//
//
//
//
//
// const CommentSection = ({ comment, indent = 0 }) => {
//   const user = arr.find((u) => u.id === comment.userID);
//   const reaction = arr.find((r) => r.comment_id === comment.id);

//   return (
//     <div style={{ marginLeft: `${indent}px`, paddingTop: "10px" }}>
//       <ul key={comment.id} style={{ listStyle: "none", paddingLeft: 0 }}>
//         <h5 className="text">
//           {user ? `User: ${user.username}` : "Unknown User"}
//         </h5>
//         <h5 className="text">{`Comment: ${comment.commentText}`}</h5>

//         <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             width: "100%",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <h5 className="text">
//             {`Likes: ${reaction ? reaction.reactionsLike : -0}`}
//           </h5>
//           <h5 className="text">
//             {`Dislikes: ${reaction ? reaction.reactionsDislike : 0}`}
//           </h5>
//         </div>

//         <button className="button" onClick={() => likeComment(comment.id)}>
//           Like
//         </button>
//         <button className="button" onClick={() => dislikeComment(comment.id)}>
//           Dislike
//         </button>
//         <button className="button" onClick={() => replyBox(comment.id)}>
//           Reply
//         </button>

//         {activeReplyId === comment.id && (
//           <form onSubmit={replyInfo}>
//             <label className="text">
//               Create Reply
//               <input
//                 className="border"
//                 name="Your reply"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//               />
//             </label>
//             <button className="button">Submit</button>
//           </form>
//         )}

//         <h6 className="text">{`Created At: ${comment.created_at}`}</h6>
//       </ul>
//     </div>
//   );
// };

// const renderComment = (comment, indent = 0) => {
//   return (
//     <div key={comment.id}>
//       <CommentSection comment={comment} indent={indent} />
//       {comment.childComments?.length > 0 &&
//         comment.childComments.map(
//           (child) => renderComment(child, indent + 30) // increment indent
//         )}
//     </div>
//   );
// };
