import Node from "./Node";

export default function WorkflowCanvas({ workflow, updateWorkflow }) {
  const { nodes, rootId } = workflow;

  const renderNode = (nodeId) => {
    const node = nodes[nodeId];
    if (!node) return null;

    return (
      <div className="node-wrapper" key={nodeId}>
        <Node
          node={node}
          workflow={workflow}
          updateWorkflow={updateWorkflow}
        />

        <svg className="lines">
          {node.children?.map((child, index) => (
            <line
              key={index}
              x1="50%"
              y1="0"
              x2="50%"
              y2="40"
              stroke="black"
            />
          ))}
        </svg>

        <div className="children">
          {node.children?.map((child) =>
            typeof child === "string"
              ? renderNode(child)
              : renderNode(child.nodeId)
          )}
        </div>
      </div>
    );
  };

  return <div className="canvas">{renderNode(rootId)}</div>;
}
