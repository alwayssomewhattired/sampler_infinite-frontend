import { useEffect, useState } from "react";
import {
  useGetSingleAudioQuery,
  useGetCommentsQuery,
  useGetReactionQuery,
  useGetUsersQuery,
} from "../components/SingleAudio/SingleAudioSlice";
import { organizeComments } from "../utils/commentUtils";

export const useSingleAudio = (audioId) => {
  const [comments, setComments] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [commentIDs, setCommentIDs] = useState([]);
  const [userNameIds, setUserNameIds] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [song, setSong] = useState(null);

  const {
    data: audioData,
    isSuccess: audioLoaded,
    refetch: refetchAudio,
  } = useGetSingleAudioQuery(audioId);
  const {
    data: commentData,
    isSuccess: commentLoaded,
    refetch: refetchComments,
  } = useGetCommentsQuery(audioId);
  const {
    data: reactData,
    isSuccess: reactLoaded,
    refetch: refetchReactions,
  } = useGetReactionQuery(commentIDs);
  const {
    data: userData,
    isSuccess: userLoaded,
    refetch: refetchUsers,
  } = useGetUsersQuery(
    { id: userIds },
    {
      skip: !userIds.length,
    }
  );

  useEffect(() => {
    if (audioLoaded) setSong(audioData);
  }, [audioData]);

  useEffect(() => {
    if (commentLoaded) {
      const structured = organizeComments(commentData);
      setComments(structured);
      setUserIds(commentData.map((c) => c.userID));
      setCommentIDs(commentData.map((c) => c.id));
    }
  }, [commentData]);

  useEffect(() => {
    if (reactLoaded) setReactions(reactData);
  }, [reactData]);

  useEffect(() => {
    if (userLoaded) setUserNameIds(userData);
  }, [userData]);

  return {
    song,
    comments,
    userNameIds,
    reactions,
    userIds,
    commentIDs,
    refetchAll: async () => {
      await Promise.all([
        refetchAudio(),
        refetchComments(),
        refetchReactions(),
        refetchUsers(),
      ]);
    },
  };
};
