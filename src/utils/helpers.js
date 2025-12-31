export const findParent = (nodes, childId) => {
  return Object.values(nodes).find((n) =>
    n.children?.some((c) => c.nodeId === childId || c === childId)
  );
};
