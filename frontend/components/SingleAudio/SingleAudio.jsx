import {
  usePostRepliesMutation,
  usePostCommentMutation,
  useReactionCommentMutation,
  useReactionItemMutation,
} from "./SingleAudioSlice";
import CustomAudioPlayer from "../Layout/CustomAudioPlayer";
import { useState } from "react";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";
import useEnrichedItem from "../../utils/useEnrichedItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

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

  console.log("song", song);

  const [createCommentMutation, { isLoading, error }] =
    usePostCommentMutation();
  const [commentText, setCommentText] = useState("");

  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  const [unauthorize, setUnauthorize] = useState("");

  const [createReactionMutation] = useReactionCommentMutation();

  const [createItemReactionMutation] = useReactionCommentMutation();

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

  const dislikeItem = async (id) => {
    try {
      const itemID = id;
      const response = await createItemReactionMutation({
        itemID,
        reaction: "like",
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const likeItem = async (itemID) => {
    try {
      const response = await createItemReactionMutation({
        itemID,
        reaction: "dislike",
      }).unwrap();
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
  // start of ugly mess
  const userMap = {};
  userNameIds.forEach((user) => {
    userMap[user.id] = user;
  });

  const reactionMap = {};
  reactions.forEach((reaction) => {
    const { commentID, reactionType, _count } = reaction;
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
    const reaction = reactionMap;
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

  // end of ugly mess

  const enrichedItem = useEnrichedItem(song);
  console.log(enrichedItem);

  return (
    <>
      <div className="logo">
        <h1 className="logo-text">SAMPLERINFINITE</h1>
      </div>
      <div className="three-column-layout">
        {<Sidebar me={me} />}

        {/* Center: Audio/Comments */}
        <main className="center-content">
          {enrichedItem && (
            <>
              <div className="center">
                <h2 className="text">Name: </h2>
                <h2 className="text">{enrichedItem.name}</h2>
                <h2 className="text">User: </h2>
                <h2 className="text">{enrichedItem.User.username}</h2>
                <CustomAudioPlayer
                  src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${enrichedItem.id}`}
                />
                <div className="row-container" style={{ width: "100%" }}>
                  <div
                    className="row-container"
                    style={{
                      marginBottom: "3.5em",
                      marginLeft: "4em",
                      gap: "em",
                    }}
                  >
                    <div className="row-container">
                      <h1 className="text" style={{ fontSize: "1em" }}>
                        {enrichedItem.itemReactionSum[0].like}
                      </h1>
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        style={{ color: "white" }}
                      />
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        style={{ color: "white" }}
                      />
                      <h1 className="error" style={{ fontSize: "1em" }}>
                        {enrichedItem.itemReactionSum[0].dislike}
                      </h1>
                      <button
                        className="button"
                        onClick={() => likeItem(enrichedItem.id)}
                      >
                        Like
                      </button>
                      <button
                        className="button"
                        onClick={() => dislikeItem(enrichedItem.id)}
                      >
                        Dislike
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text">Description:</h3>
                    <h3 className="text">{enrichedItem.description}</h3>
                  </div>
                </div>
              </div>
            </>
          )}
          <form onSubmit={commentInfo} className="comment-form">
            <label className="text">
              Create comment
              <input
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

          {/* //////////////////////////////////// This is comment stuff below////////////////////////////////////////////////////////////////               */}
          {/*****/}
          {/**/}

          {comments && comments.map((comment) => renderComment(comment))}
        </main>

        {<Account />}
      </div>
    </>
  );
}
