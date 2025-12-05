import React, { useState, useEffect } from "react";
import {
  getMembers,
  createWorkgroup,
  getWorkgroups,
  deleteWorkgroup,
  updateWorkgroup,
  updateWorkgroupMembers
} from "./api";

import { PlusCircle, Users, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Workgroup.css";

/* ------------------------------------------------------
   Create / Edit Modal Component
------------------------------------------------------ */
const CreateWorkgroupModal = ({ isOpen, setIsOpen, onSaved, editData }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
      setName(editData?.name || "");
      setDesc(editData?.description || "");
      setSelected(editData?.members?.map(m => m._id) || []);
    }
  }, [isOpen, editData]);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setAllMembers(res.data || []);
    } catch (err) {
      console.error("Error fetching members:", err);
      setAllMembers([]);
    }
  };

  const toggleMember = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("Workgroup name is required");
    setLoading(true);

    try {
      if (editData) {
        await updateWorkgroup(editData._id, { name, description: desc });

        const prevIds = editData.members.map(m => m._id.toString());
        const changed = JSON.stringify(prevIds.sort()) !== JSON.stringify(selected.sort());

        if (changed) {
          await updateWorkgroupMembers({ id: editData._id, members: selected });
        }
      } else {
        await createWorkgroup({ name, description: desc, members: selected });
      }

      onSaved();
      setIsOpen(false);
      setName("");
      setDesc("");
      setSelected([]);
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save workgroup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="modal-content" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
            <h2>{editData ? "Edit Workgroup" : "Create Workgroup"}</h2>

            <input placeholder="Workgroup Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />

            {/* Member Selector */}
            <div className="member-select">
              <h4>Select Members</h4>
              <div className="dropdown-container">
                <div className="dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {selected.length === 0
                    ? "Select members..."
                    : selected.map(id => allMembers.find(m => m._id === id)?.name || "Unknown").join(", ")}
                  <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
                </div>

                {dropdownOpen && (
                  <div className="dropdown-list">
                    {allMembers.length === 0 ? (
                      <div className="no-members">No members found</div>
                    ) : (
                      allMembers.map(m => (
                        <div key={m._id} className={`dropdown-item ${selected.includes(m._id) ? "selected" : ""}`} onClick={() => toggleMember(m._id)}>
                          {m.name} ({m.email})
                          {selected.includes(m._id) && <span className="check">✔</span>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={handleSave} disabled={loading}>
                {loading ? editData ? "Updating..." : "Creating..." : editData ? "Update" : "Create"}
              </button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ------------------------------------------------------
   Workgroup Card Component
------------------------------------------------------ */
const WorkgroupCard = ({ wg, onEdit, onDelete, isUser }) => {
  const navigate = useNavigate();

  return (
    <motion.div className="workgroup-card" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <div
        onClick={() => {
          const path = isUser
            ? `/user/workgroup/${wg._id}/workspaces`   // User route
            : `/workgroup/${wg._id}/workspaces`;      // Admin route
          navigate(path);
        }}
        style={{ cursor: "pointer" }}
      >
        <h3>{wg.name}</h3>
        <p>{wg.description || "No description"}</p>
        <div className="card-stats">
          <span><Users size={16} /> {wg.members?.length || 0} Members</span>
          <span>{wg.workspaces?.length || 0} Workspaces</span>
        </div>
      </div>

      {wg.isAdmin && (
        <div className="card-actions">
          <button onClick={() => onEdit(wg)} className="btn-icon"><Edit2 size={16} /> Edit</button>
          <button onClick={() => onDelete(wg._id)} className="btn-icon danger"><Trash2 size={16} /> Delete</button>
        </div>
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------
   Main Workgroups Page
------------------------------------------------------ */
const Workgroups = ({ isUser }) => {   // ✅ pass isUser from parent or determine per account
  const [workgroups, setWorkgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => { fetchList(); }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getWorkgroups();
      setWorkgroups(res.data || []);
    } catch (err) {
      console.error(err);
      setWorkgroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this workgroup?")) return;
    try {
      await deleteWorkgroup(id);
      setWorkgroups(prev => prev.filter(w => w._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete workgroup");
    }
  };

  return (
    <div className="workgroup-container">
      <div className="header">
        <h2>Workgroups</h2>
        <button onClick={() => { setEditData(null); setModalOpen(true); }} className="btn-primary">
          <PlusCircle size={18} /> Create Workgroup
        </button>
      </div>

      {loading ? (
        <p>Loading workgroups...</p>
      ) : workgroups.length === 0 ? (
        <p>No workgroups found.</p>
      ) : (
        <motion.div layout className="workgroup-grid">
          {workgroups.map(wg => (
            <WorkgroupCard
              key={wg._id}
              wg={wg}
              onEdit={(wg) => { setEditData(wg); setModalOpen(true); }}
              onDelete={handleDelete}
              isUser={isUser}   // ✅ pass flag here
            />
          ))}
        </motion.div>
      )}

      <CreateWorkgroupModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        onSaved={fetchList}
        editData={editData}
      />
    </div>
  );
};

export default Workgroups;
