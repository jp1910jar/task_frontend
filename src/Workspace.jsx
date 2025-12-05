import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getWorkgroupById, createWorkspace, deleteWorkspace } from "./api";
import { PlusCircle, Users, Edit2, Trash2 } from "lucide-react";
import "./Workspace.css";

/* ---------------- Create Workspace Modal ---------------- */
const CreateWorkspace = ({ isOpen, setIsOpen, members, onCreate }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDesc("");
      setSelected([]);
    }
  }, [isOpen]);

  const toggleMember = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const handleCreate = async () => {
    if (!name.trim()) return alert("Workspace name is required");
    setLoading(true);
    try {
      await onCreate({ name, description: desc, members: selected });
      setIsOpen(false);
    } catch {
      alert("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="modal-content beautiful-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2>Create Workspace</h2>
            <input placeholder="Workspace Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />

            <div className="dropdown-container">
              <div className="dropdown-header" onClick={() => setShowMembers(!showMembers)}>
                {selected.length > 0 ? `${selected.length} Members Selected` : "Select Members"}
                <span className="arrow">{showMembers ? "▲" : "▼"}</span>
              </div>

              {showMembers && (
                <div className="dropdown-list">
                  {members.length > 0 ? (
                    members.map((m) => (
                      <div
                        key={m._id}
                        className={`dropdown-item ${selected.includes(m._id) ? "selected" : ""}`}
                        onClick={() => toggleMember(m._id)}
                      >
                        {m.name}
                        {selected.includes(m._id) && <span className="check">✔</span>}
                      </div>
                    ))
                  ) : (
                    <div className="no-members-text">No members found.</div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button onClick={handleCreate}>{loading ? "Creating..." : "Create"}</button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Edit Workspace Modal ---------------- */
const EditWorkspaceModal = ({ isOpen, setIsOpen, workspace, members, onSaved }) => {
  const [name, setName] = useState(workspace?.name || "");
  const [desc, setDesc] = useState(workspace?.description || "");
  const [selected, setSelected] = useState(workspace?.members?.map((m) => m._id) || []);
  const [loading, setLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(workspace?.name || "");
      setDesc(workspace?.description || "");
      setSelected(workspace?.members?.map((m) => m._id) || []);
    }
  }, [isOpen, workspace]);

  const toggleMember = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const handleUpdate = async () => {
    if (!name.trim()) return alert("Workspace name is required");
    setLoading(true);
    try {
      const wgId = workspace._parentWorkgroupId;
      await axios.put(
        `http://localhost:5000/api/workgroups/${wgId}/workspaces/${workspace._id}`,
        { name, description: desc, members: selected },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      onSaved && onSaved();
      setIsOpen(false);
    } catch {
      alert("Failed to update workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="modal-content beautiful-modal"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h2>Edit Workspace</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Workspace Name" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" />

            <div className="dropdown-container">
              <div className="dropdown-header" onClick={() => setShowMembers(!showMembers)}>
                {selected.length > 0 ? `${selected.length} Members Selected` : "Select Members"}
                <span className="arrow">{showMembers ? "▲" : "▼"}</span>
              </div>

              {showMembers && (
                <div className="dropdown-list">
                  {members.length > 0 ? (
                    members.map((m) => (
                      <div
                        key={m._id}
                        className={`dropdown-item ${selected.includes(m._id) ? "selected" : ""}`}
                        onClick={() => toggleMember(m._id)}
                      >
                        {m.name}
                        {selected.includes(m._id) && <span className="check">✔</span>}
                      </div>
                    ))
                  ) : (
                    <div className="no-members-text">No members found.</div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button onClick={handleUpdate}>{loading ? "Updating..." : "Update"}</button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ---------------- Workspace Card ---------------- */
const WorkspaceCard = ({ workspace, workgroup, onDelete, onEdit, navigate, isUser }) => {
  const canModify = workgroup.isAdmin; // Admin-only actions

  return (
    <motion.div
      className="workspace-card hover-card"
      whileHover={{ scale: 1.03 }}
      onClick={() =>
        navigate(
          isUser
            ? `/user/projecttask/${workspace._id}` // user route
            : `/projecttask/${workspace._id}`      // admin route
        )
      }
    >
      <div className="card-content">
        <h3>{workspace.name}</h3>
        <p>{workspace.description || "No description"}</p>

        <div className="workspace-footer">
          <Users size={18} />
          <span>{workspace.members?.length || 0} Members</span>
        </div>

        {canModify && (
          <div className="workspace-actions" onClick={(e) => e.stopPropagation()}>
            <button className="edit-btn" onClick={() => onEdit(workspace)}>
              <Edit2 size={16} /> Edit
            </button>
            <button className="delete-btn" onClick={() => onDelete(workspace._id)}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ---------------- Main Workspace Page ---------------- */
const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workgroup, setWorkgroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWs, setEditingWs] = useState(null);

  useEffect(() => { fetchWorkgroup(); }, []);

  const fetchWorkgroup = async () => {
    setLoading(true);
    try {
      const res = await getWorkgroupById(id);
      const currentUser = res.data.members.find((m) => m.isCurrent);
      const wg = { ...res.data, currentUserId: currentUser?.memberId };

      wg.workspaces = (wg.workspaces || []).map((ws) => ({ ...ws, _parentWorkgroupId: id }));
      setWorkgroup(wg);
    } catch {
      alert("Failed to fetch workgroup");
    } finally { setLoading(false); }
  };

  const handleCreate = async (data) => {
    await createWorkspace(id, data);
    fetchWorkgroup();
  };

  const handleDelete = async (wsId) => {
    if (!window.confirm("Are you sure you want to delete this workspace?")) return;
    await deleteWorkspace(id, wsId);
    fetchWorkgroup();
  };

  const handleEdit = (workspace) => {
    setEditingWs(workspace);
    setEditModalOpen(true);
  };

  if (loading) return <p>Loading workgroup...</p>;
  if (!workgroup) return <p>Workgroup not found</p>;

  // Determine if current user is non-admin (to use user routes)
  const isUser = !workgroup.isAdmin;

  return (
    <div className="workspace-page">
      <div className="workspace-header">
        <h2>{workgroup.name} - Workspaces</h2>
        {workgroup.isAdmin && (
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            <PlusCircle size={18} /> Create Workspace
          </button>
        )}
      </div>

      <div className="workspace-grid">
        {workgroup.workspaces?.length > 0 ? (
          workgroup.workspaces.map((ws) => (
            <WorkspaceCard
              key={ws._id}
              workspace={ws}
              workgroup={workgroup}
              onDelete={handleDelete}
              onEdit={handleEdit}
              navigate={navigate}
              isUser={isUser} // ✅ Pass flag to use correct route
            />
          ))
        ) : (
          <p>No workspaces found.</p>
        )}
      </div>

      <CreateWorkspace
        isOpen={isCreating}
        setIsOpen={setIsCreating}
        members={workgroup.members}
        onCreate={handleCreate}
      />

      {editingWs && (
        <EditWorkspaceModal
          isOpen={editModalOpen}
          setIsOpen={setEditModalOpen}
          workspace={editingWs}
          members={workgroup.members}
          onSaved={fetchWorkgroup}
        />
      )}
    </div>
  );
};

export default WorkspacePage;
