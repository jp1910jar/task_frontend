import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkgroupById, createWorkspace } from "./api"; // centralized API functions
import "./Workgroup.css";

const WorkspacePage = () => {
  const { id } = useParams(); // workgroup ID
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
      setMembers(res.data.members);
    } catch (err) {
      console.error("Error fetching workgroup:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (workspace) => {
    try {
      const res = await createWorkspace(id, workspace);
      setWorkgroup(res.data); // update with new workspace added
    } catch (err) {
      console.error("Error creating workspace:", err.response?.data || err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="workspace-container">
      <div className="header">
        <h2>{workgroup?.name} – Workspaces</h2>
        <button onClick={() => setIsCreating(true)}>+ Create Workspace</button>
      </div>

      <div className="workspace-grid">
        {workgroup?.workspaces?.length > 0 ? (
          workgroup.workspaces.map((ws) => (
            <motion.div
              key={ws._id}
              className="workspace-card"
              whileHover={{ scale: 1.02 }}
            >
              <h4>{ws.name}</h4>
              <p>{ws.description}</p>
              <p>
                Members:{" "}
                {ws.members?.length > 0
                  ? ws.members.map((m) => m.name).join(", ")
                  : "None"}
              </p>
            </motion.div>
          ))
        ) : (
          <p>No workspaces found.</p>
        )}
      </div>

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
    if (!name.trim()) {
      alert("Workspace name is required");
      return;
    }
    onCreate({ name, description: desc, members: selected });
    setIsOpen(false);
    setName("");
    setDesc("");
    setSelected([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <h2>Create Workspace</h2>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="member-select">
              <h4>Select Members</h4>
              {members.map((m) => (
                <label key={m._id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(m._id)}
                    onChange={() => toggleMember(m._id)}
                  />
                  {m.name}
                </label>
              ))}
            </div>
            <div className="modal-buttons">
              <button onClick={handleSubmit}>Create</button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkspacePage;
