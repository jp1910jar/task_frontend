import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Users } from "lucide-react";
import "./Workgroup.css";

// Loader Component
const Loader = () => <div className="loader">Loading...</div>;

// No Data Component
const NoDataFound = ({ title, description }) => (
  <div className="no-data">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

// Create Workspace Modal
const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  if (!isCreatingWorkspace) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({
      id: Date.now(),
      name,
      description: desc,
      createdAt: new Date(),
      color: "#4f46e5",
      members: [],
    });
    setName("");
    setDesc("");
    setIsCreatingWorkspace(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create Workspace</h2>
        <input
          type="text"
          placeholder="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleCreate}>Create</button>
          <button onClick={() => setIsCreatingWorkspace(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Dynamic Workspace Card
const WorkspaceCard = ({ workspace }) => (
  <Link to={`/workspaces/${workspace.id}`} className="workspace-card">
    <div className="card-header">
      <div className="workspace-info">
        <div
          className="avatar"
          style={{ backgroundColor: workspace.color }}
        >
          {workspace.name[0].toUpperCase()}
        </div>
        <div>
          <h3>{workspace.name}</h3>
          <span className="created-at">
            Created on {new Date(workspace.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="members-count">
        <Users size={16} />
        <span>{workspace.members.length}</span>
      </div>
    </div>
    <div className="card-description">
      {workspace.description || "No description"}
    </div>
    <div className="card-footer">View workspace details & projects</div>
  </Link>
);

// Main Workspaces Component
const Workspaces = ({ fetchWorkspaces }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await (fetchWorkspaces
          ? fetchWorkspaces()
          : Promise.resolve([])); // fallback
        setWorkspaces(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchWorkspaces]);

  const handleCreate = (workspace) => {
    setWorkspaces((prev) => [...prev, workspace]);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        <h2>Workspaces</h2>
        <button
          className="create-workspace-btn"
          onClick={() => setIsCreatingWorkspace(true)}
        >
          <PlusCircle size={18} /> Create Workspace
        </button>
      </div>

      {workspaces.length === 0 ? (
        <NoDataFound
          title="No workspaces found"
          description="Create a new workspace to get started"
        />
      ) : (
        <div className="workspace-grid">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws.id} workspace={ws} />
          ))}
        </div>
      )}

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default Workspaces;