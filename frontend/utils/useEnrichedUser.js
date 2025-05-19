import { useMemo } from "react";

export default function useEnrichedUser(user) {
  const enrichedUser = useMemo(() => {
    // 1. COMMENT REACTIONS
    const commentReactions = user.comments?.flatMap(
      (comment) => comment.reactions
    );
    const commentReactionSum = commentReactions?.reduce((acc, reaction) => {
      const { commentID, reactionType } = reaction;
      if (!acc[commentID]) acc[commentID] = { like: 0, dislike: 0 };
      acc[commentID][reactionType] = (acc[commentID][reactionType] || 0) + 1;
      return acc;
    }, {});

    // 2. ITEM REACTIONS
    const itemReactions = user.items?.flatMap((item) => item.reactions);
    const itemReactionSum = itemReactions?.reduce((acc, reaction) => {
      const { itemID, reactionType } = reaction;
      if (!acc[itemID]) acc[itemID] = { like: 0, dislike: 0 };
      acc[itemID][reactionType] = (acc[itemID][reactionType] || 0) + 1;
      return acc;
    }, {});

    // 3. ENRICH COMMENTS
    const commentsWithExtras = user.comments?.map((comment) => {
      const reactionCounts = commentReactionSum?.[comment.id] ?? {
        like: 0,
        dislike: 0,
      };
      const matchingItem = user.items?.find(
        (item) => item.id === comment.itemID
      );
      return {
        ...comment,
        reactionCounts,
        item: matchingItem || null,
      };
    });

    // 4. ENRICH ITEMS
    const itemsWithExtras = user.items?.map((item) => {
      const reactionCounts = itemReactionSum?.[item.id] ?? {
        like: 0,
        dislike: 0,
      };
      return {
        ...item,
        reactionCounts,
      };
    });

    return {
      ...user,
      comments: commentsWithExtras,
      items: itemsWithExtras,
      commentReactionSum,
      itemReactionSum,
    };
  }, [user]);

  return enrichedUser;
}
