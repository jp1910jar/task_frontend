import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkgroupById, createWorkspace } from "./api";
import { PlusCircle, Users } from "lucide-react";
import "./Workspace.css";

/* ---------------- Create Workspace Modal ---------------- */
const CreateWorkspace = ({ isOpen, setIsOpen, members, onCreate }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const toggleMember = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return alert("Workspace name is required");
    setLoading(true);
    try {
      await onCreate({ name, description: desc, members: selected });
      setName("");
      setDesc("");
      setSelected([]);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content beautiful-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2>Create Workspace</h2>

            <input
              placeholder="Workspace Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              placeholder="Description (optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            {/* MEMBERS DROPDOWN */}
            <div className="dropdown-container">
              <div
                className="dropdown-header"
                onClick={() => setShowMembers(!showMembers)}
              >
                <span>
                  {selected.length > 0
                    ? `${selected.length} Members Selected`
                    : "Select Members"}
                </span>
                <span className="arrow">{showMembers ? "▲" : "▼"}</span>
              </div>

              {showMembers && (
                <div className="dropdown-list">
                  {members.length > 0 ? (
                    members.map((m) => (
                      <div
                        key={m._id}
                        className={`dropdown-item ${
                          selected.includes(m._id) ? "selected" : ""
                        }`}
                        onClick={() => toggleMember(m._id)}
                      >
                        <span>{m.name}</span>

                        {selected.includes(m._id) && (
                          <span className="check">✔</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-members-text">No members found.</p>
                  )}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="modal-buttons">
              <button onClick={handleCreate}>
                {loading ? "Creating..." : "Create"}
              </button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Workspace Card ---------------- */
const WorkspaceCard = ({ workspace, navigate }) => (
  <motion.div
    className="workgroup-card"
    whileHover={{ scale: 1.05 }}
    onClick={() => navigate(`/projecttask/${workspace._id}`)}
  >
    <h3>{workspace.name}</h3>
    <p>{workspace.description || "No description"}</p>

    <div className="card-footer">
      <Users size={18} />
      <span>{workspace.members?.length || 0} Members</span>
    </div>
  </motion.div>
);

/* ---------------- Main Workspace Page ---------------- */
const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workgroup, setWorkgroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchWorkgroup();
  }, []);

  const fetchWorkgroup = async () => {
    setLoading(true);
    try {
      const res = await getWorkgroupById(id);
      setWorkgroup(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (workspace) => {
    try {
      const res = await createWorkspace(id, workspace);
      setWorkgroup(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="workgroup-container">
      <div className="header">
        <h2>{workgroup?.name} – Workspaces</h2>
        <button onClick={() => setIsCreating(true)}>
          <PlusCircle size={18} /> Create Workspace
        </button>
      </div>

      {loading ? (
        <p>Loading workspaces...</p>
      ) : workgroup?.workspaces?.length > 0 ? (
        <motion.div layout className="workgroup-grid">
          {workgroup.workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} navigate={navigate} />
          ))}
        </motion.div>
      ) : (
        <p>No workspaces found.</p>
      )}

      <CreateWorkspace
        isOpen={isCreating}
        setIsOpen={setIsCreating}
        members={workgroup?.members || []}
        onCreate={handleCreateWorkspace}
      />
    </div>
  );
};

export default WorkspacePage;
