export const organizeComments = (comments) => {
  const commentMap = new Map();
  comments.forEach((c) => commentMap.set(c.id, { ...c, childComments: [] }));

  const roots = [];
  comments.forEach((c) => {
    if (c.parentCommentId) {
      commentMap
        .get(c.parentCommentId)
        ?.childComments.push(commentMap.get(c.id));
    } else {
      roots.push(commentMap.get(c.id));
    }
  });

  const sortComments = (list) => {
    list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    list.forEach((c) => sortComments(c.childComments));
  };

  sortComments(roots);
  return roots;
};
