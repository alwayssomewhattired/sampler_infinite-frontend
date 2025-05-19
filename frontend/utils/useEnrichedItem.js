import { useMemo } from "react";

export default function useEnrichedItem(item) {
  return useMemo(() => {
    if (!item) return null;
    const itemReactionSum = item.reactions.reduce((acc, reaction) => {
      const { itemID, reactionType } = reaction;
      if (!acc[itemID]) acc[itemID] = { like: 0, dislike: 0 };
      acc[itemID][reactionType] = (acc[itemID][reactionType] || 0) + 1;
      const arr = Object.values(acc)
      return arr;
    }, {});

    return {
      ...item,
      itemReactionSum,
    };
  }, [item]);
}
