import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkgroupById, createWorkspace } from "./api";
import "./Workspace.css";

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workgroup, setWorkgroup] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkgroup();
  }, []);

  const fetchWorkgroup = async () => {
    try {
      const res = await getWorkgroupById(id);
      setWorkgroup(res.data);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Error fetching workgroup:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (workspace) => {
    try {
      const res = await createWorkspace(id, workspace);
      setWorkgroup((prev) => ({
        ...prev,
        workspaces: [...(prev.workspaces || []), res.data],
      }));
    } catch (err) {
      console.error("Error creating workspace:", err.response?.data || err.message);
    }
  };

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/projecttask/${workspaceId}`);
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="workspace-page">
      <div className="workspace-header">
        <h2>{workgroup?.name} – Workspaces</h2>
        <motion.button
          className="create-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
        >
          + Create Workspace
        </motion.button>
      </div>

      <motion.div
        className="workspace-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {workgroup?.workspaces?.length > 0 ? (
          workgroup.workspaces.map((ws) => (
            <motion.div
              key={ws._id}
              className="workspace-card"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleWorkspaceClick(ws._id)}
            >
              <h3>{ws.name}</h3>
              <p className="desc">{ws.description || "No description provided."}</p>
              <div className="members-list">
                <h4>Members</h4>
                <div className="avatar-group">
                  {ws.members?.length > 0 ? (
                    ws.members.map((m) => (
                      <div key={m._id} className="avatar">
                        {m.name?.charAt(0).toUpperCase()}
                      </div>
                    ))
                  ) : (
                    <p className="no-members">No members assigned</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="no-workspaces">No workspaces found.</p>
        )}
      </motion.div>

      <CreateWorkspaceModal
        isOpen={isCreating}
        setIsOpen={setIsCreating}
        members={members}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
};

const CreateWorkspaceModal = ({ isOpen, setIsOpen, members, onCreate }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState([]);

  const toggleMember = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert("Workspace name is required");
    onCreate({ name, description: desc, members: selected });
    setIsOpen(false);
    setName("");
    setDesc("");
    setSelected([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
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
            <div className="member-selection">
              <h4>Select Members</h4>
              <div className="member-list">
                {members.map((m) => (
                  <label key={m._id} className="member-option">
                    <input
                      type="checkbox"
                      checked={selected.includes(m._id)}
                      onChange={() => toggleMember(m._id)}
                    />
                    {m.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleSubmit}>Create</button>
              <button className="cancel-btn" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkspacePage;
