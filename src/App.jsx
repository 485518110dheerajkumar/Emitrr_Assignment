import { useState } from "react";
import WorkflowCanvas from "./components/WorkflowCanvas";

export default function App() {
  const initialState = {
    rootId: "start",
    nodes: {
      start: {
        id: "start",
        type: "start",
        label: "Start",
        children: []
      }
    }
  };

  const [workflow, setWorkflow] = useState(initialState);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const updateWorkflow = (newState) => {
    setHistory((h) => [...h, workflow]);
    setFuture([]);
    setWorkflow(newState);
  };

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setFuture((f) => [workflow, ...f]);
    setWorkflow(prev);
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setFuture(future.slice(1));
    setHistory((h) => [...h, workflow]);
    setWorkflow(next);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Workflow Builder</h2>

      <div className="top-actions">
  <button onClick={() => console.log(workflow)}>Save</button>
  <button onClick={undo} disabled={!history.length}>Undo</button>
  <button onClick={redo} disabled={!future.length}>Redo</button>
</div>


      <WorkflowCanvas workflow={workflow} updateWorkflow={updateWorkflow} />
    </div>
  );
}
