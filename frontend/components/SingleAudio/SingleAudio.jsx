import {
  useGetSingleAudioQuery,
  useGetCommentsQuery,
  usePostRepliesMutation,
  usePostCommentMutation,
  useGetReactionQuery,
  useReactionCommentMutation,
  useGetUsersQuery,
  // useGetReviewsQuery,
  // useCreateReviewMutation,
} from "./SingleAudioSlice";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";

export default function SingleItem({ audioId, me }) {
  const { data: myData, isSuccess } = useGetSingleAudioQuery(audioId);

  const { data: commentData, isSuccess: loaded } = useGetCommentsQuery(audioId);
  const [comments, setComments] = useState([]);

  const [createCommentMutation, { isLoading, error }] =
    usePostCommentMutation();
  const [commentText, setCommentText] = useState("");

  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const [song, setSong] = useState("");

  let [userIds, setUserIds] = useState([]);
  const [userNameIds, setUserNameIds] = useState([]);

  const [unauthorize, setUnauthorize] = useState("");

  const [createReactionMutation] = useReactionCommentMutation();

  const [reactions, setReactions] = useState([]);
  const [commentIDs, setCommentIDs] = useState([]);

  const userID = me;
  const itemId = audioId;

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setSong(myData);
    }
  }, [myData]);

  useEffect(() => {
    if (loaded) {
      // setComments(commentData);
      // organizeComments(commentData);
      const structured = organizeComments(commentData);
      setComments(structured);

      const ids = commentData.map((a) => a.userID);
      setUserIds(ids);
      const commentIds = commentData.map((a) => a.id);
      setCommentIDs(commentIds);
    }
  }, [loaded, commentData]);

  const { data: userData, isSuccess: userSuccess } = useGetUsersQuery(
    { ids: userIds },
    {
      skip: !userIds || userIds.length === 0,
    }
  );

  const organizeComments = (comments) => {
    const commentMap = new Map();

    // all comments map by id
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, childComments: [] });
    });

    const roots = [];

    // all children are linked to parents
    comments.forEach((comment) => {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.childComments.push(commentMap.get(comment.id));
        }
      } else {
        roots.push(commentMap.get(comment.id));
      }
    });

    const sortComments = (commentList) => {
      commentList.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      commentList.forEach((comment) => {
        if (comment.childComments.length > 0) {
          sortComments(comment.childComments);
        }
      });
    };

    sortComments(roots);

    return roots;
  };

  const {
    data: reactData,
    isSuccess: reactSucc,
    error: reactError,
  } = useGetReactionQuery(commentIDs);

  useEffect(() => {
    if (reactSucc) {
      setReactions(reactData);
    }
  }, [reactData, reactSucc]);

  useEffect(() => {
    if (userSuccess) {
      setUserNameIds(userData);
    }
  }, [userSuccess, userData]);

  const likeComment = async (commentID) => {
    try {
      window.location.reload();
      const response = await createReactionMutation({
        commentID,
        reaction: "like",
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const dislikeComment = async (commentID) => {
    try {
      window.location.reload();
      const response = await createReactionMutation({
        commentID,
        reaction: "dislike",
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const commentInfo = async (e) => {
    e.preventDefault();
    try {
      window.location.reload();
      const response = await createCommentMutation({
        userID,
        itemId,
        // reviewId,
        commentText,
      }).unwrap();
      navigate("/singleAudio");
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
      // window.location.reload();
      const parentCommentId = activeReplyId;
      const itemID = audioId;
      const response = await createRepliesMutation({
        replyText,
        parentCommentId,
        itemID,
      }).unwrap();
      navigate("/singleAudio");
    } catch (error) {
      if (error.originalStatus === 401) {
        setUnauthorize("Please log in to comment.");
      } else {
        console.error("Something else went wrong", error);
      }
    }
  };

  const replyBox = (id) => {
    setActiveReplyId(id);
  };

  let arr = [];

  if (userNameIds.length != 0 && userIds.length != 0 && reactions.length != 0) {
    for (let i = 0; i < userIds.length; i++) {
      const id = userIds[i];
      const comment_id = commentIDs[i];

      const userObj = userNameIds.find((user) => user.id === id);
      const reactionObj = reactions.find((r) => r.commentID === comment_id);

      let likeObj = {};
      let dislikeObj = {};

      if (reactionObj) {
        if (reactionObj.reactionType === "like") {
          likeObj = reactionObj; // this contains all the data for "like"
        }
        if (reactionObj.reactionType === "dislike") {
          dislikeObj = reactionObj; // this contains all the data for "dislike"
        }
      }

      if (userObj) {
        arr.push({
          id,
          comment_id,
          username: userObj.username,
          reactionsLike:
            likeObj && likeObj._count ? likeObj._count.reactionType : 0,
          reactionsDislike:
            dislikeObj && dislikeObj._count
              ? dislikeObj._count.reactionType
              : 0,
        });
      }
      console.log(arr);
    }
  }

  const CommentSection = ({ comment, indent = 0 }) => {
    const user = arr.find((u) => u.id === comment.userID);
    const reaction = arr.find((r) => r.comment_id === comment.id);

    return (
      <div style={{ marginLeft: `${indent}px`, paddingTop: "10px" }}>
        <ul key={comment.id} style={{ listStyle: "none", paddingLeft: 0 }}>
          <h5 className="text">
            {user ? `User: ${user.username}` : "Unknown User"}
          </h5>
          <h5 className="text">{`Comment: ${comment.commentText}`}</h5>

          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h5 className="text">
              {`Likes: ${reaction ? reaction.reactionsLike : -0}`}
            </h5>
            <h5 className="text">
              {`Dislikes: ${reaction ? reaction.reactionsDislike : 0}`}
            </h5>
          </div>

          <button className="button" onClick={() => likeComment(comment.id)}>
            Like
          </button>
          <button className="button" onClick={() => dislikeComment(comment.id)}>
            Dislike
          </button>
          <button className="button" onClick={() => replyBox(comment.id)}>
            Reply
          </button>

          {activeReplyId === comment.id && (
            <form onSubmit={replyInfo}>
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
      </div>
    );
  };

  const renderComment = (comment, indent = 0) => {
    return (
      <div key={comment.id}>
        <CommentSection comment={comment} indent={indent} />
        {comment.childComments?.length > 0 &&
          comment.childComments.map(
            (child) => renderComment(child, indent + 30) // increment indent
          )}
      </div>
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
          <ul key={song.id}>
            <h2 className="text">{song.name}</h2>
          </ul>
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
