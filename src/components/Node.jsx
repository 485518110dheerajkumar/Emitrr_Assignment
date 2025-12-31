import { useState } from "react";
import { findParent } from "../utils/helpers";

export default function Node({ node, workflow, updateWorkflow }) {
  const { nodes } = workflow;
  const [menuOpen, setMenuOpen] = useState(false);

  const addNode = (type, branchLabel) => {
    const newId = Date.now().toString();

    const newNode = {
      id: newId,
      type,
      label: type.toUpperCase(),
      children: []
    };

    const updatedNodes = { ...nodes, [newId]: newNode };

    if (node.type === "branch") {
      updatedNodes[node.id].children.push({
        label: branchLabel,
        nodeId: newId
      });
    } else {
      updatedNodes[node.id].children = [newId];
    }

    updateWorkflow({ ...workflow, nodes: updatedNodes });
    setMenuOpen(false);
  };

  const deleteNode = () => {
    const updatedNodes = { ...nodes };
    const parent = findParent(updatedNodes, node.id);

    if (parent) {
      parent.children = parent.children.filter(
        (c) => (c.nodeId || c) !== node.id
      );

      // reconnect only for non-branch nodes
      if (node.type !== "branch") {
        parent.children.push(...(node.children || []));
      }
    }

    delete updatedNodes[node.id];
    updateWorkflow({ ...workflow, nodes: updatedNodes });
    setMenuOpen(false);
  };

  const editLabel = () => {
    const newLabel = prompt("Edit label", node.label);
    if (!newLabel) return;

    updateWorkflow({
      ...workflow,
      nodes: {
        ...nodes,
        [node.id]: { ...node, label: newLabel }
      }
    });
    setMenuOpen(false);
  };

  return (
    <div className="node-container">
      {/* NODE BOX */}
      <div
        className={`node ${node.type}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <strong>{node.label}</strong>
      </div>

      {/* SMALL MENU */}
      {menuOpen && (
        <div className="node-menu">
          {node.type !== "end" && node.type !== "branch" && (
            <>
              <button onClick={() => addNode("action")}>Add Action</button>
              <button onClick={() => addNode("branch")}>Add Branch</button>
              <button onClick={() => addNode("end")}>Add End</button>
            </>
          )}

          {node.type === "branch" && (
            <>
              <button onClick={() => addNode("action", "True")}>
                Add True
              </button>
              <button onClick={() => addNode("action", "False")}>
                Add False
              </button>
            </>
          )}

          <button onClick={editLabel}>Edit</button>

          {node.type !== "start" && (
            <button onClick={deleteNode}>Delete</button>
          )}

          <button onClick={() => setMenuOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
