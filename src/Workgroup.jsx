import React, { useState, useEffect } from "react";
import { getMembers, createWorkgroup, getWorkgroups } from "./api";
import { PlusCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Workgroup.css";

// ---------------- Create Workgroup Modal ----------------
const CreateWorkgroup = ({ isOpen, setIsOpen, onCreate }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState([]); // all available members added
  const [selected, setSelected] = useState([]); // only selected members
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching members:", err);
      setMembers([]);
    }
  };

  // Toggle selected member
  const toggleMember = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Create workgroup
  const handleCreate = async () => {
    if (!name.trim()) return alert("Workgroup name is required");

    setLoading(true);
    try {
      // Send selected members as _id array
      const res = await createWorkgroup({
        name,
        description: desc,
        members: selected,
      });

      if (res.data) onCreate(res.data);

      // Reset form
      setName("");
      setDesc("");
      setSelected([]);
      setDropdownOpen(false);
      setIsOpen(false);
    } catch (err) {
      console.error("❌ Error creating workgroup:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create workgroup");
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
            className="modal-content"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h2>Create Workgroup</h2>
            <input
              placeholder="Workgroup Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            {/* ===== Member Dropdown ===== */}
            <div className="member-select">
              <h4>Select Members</h4>
              <div className="dropdown-container">
                <div
                  className="dropdown-header"
                  onClick={() => setDropdownOpen(prev => !prev)}
                >
                  {selected.length === 0
                    ? "Select members..."
                    : selected
                        .map(id => {
                          const member = members.find(m => m._id === id);
                          return member ? member.name : "Unknown";
                        })
                        .join(", ")}
                  <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
                </div>

                {dropdownOpen && (
                  <div className="dropdown-list">
                    {members.map(m => (
                      <div
                        key={m._id}
                        className={`dropdown-item ${selected.includes(m._id) ? "selected" : ""}`}
                        onClick={() => toggleMember(m._id)}
                      >
                        {m.name} ({m.email})
                        {selected.includes(m._id) && <span className="check">✔</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={handleCreate} disabled={loading}>
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

// ---------------- Workgroup Card ----------------
const WorkgroupCard = ({ workgroup }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="workgroup-card"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/workgroup/${workgroup._id}/workspaces`)}
    >
      <h3>{workgroup.name}</h3>
      <p>{workgroup.description || "No description"}</p>
      <div className="card-stats">
        <span><Users size={16} /> {workgroup.members?.length || 0} Members</span>
        <span>{workgroup.workspaces?.length || 0} Workspaces</span>
      </div>
    </motion.div>
  );
};

// ---------------- Main Workgroups Component ----------------
const Workgroups = () => {
  const [workgroups, setWorkgroups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkgroups();
  }, []);

  const fetchWorkgroups = async () => {
    setLoading(true);
    try {
      const res = await getWorkgroups();
      setWorkgroups(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching workgroups:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (wg) => setWorkgroups(prev => [...prev, wg]);

  return (
    <div className="workgroup-container">
      <div className="header">
        <h2>Workgroups</h2>
        <button onClick={() => setIsCreating(true)}>
          <PlusCircle size={18} /> Create Workgroup
        </button>
      </div>

      {loading ? (
        <p>Loading workgroups...</p>
      ) : workgroups.length === 0 ? (
        <p>No workgroups found.</p>
      ) : (
        <motion.div layout className="workgroup-grid">
          {workgroups.map((wg) => (
            <WorkgroupCard key={wg._id} workgroup={wg} />
          ))}
        </motion.div>
      )}

      <CreateWorkgroup
        isOpen={isCreating}
        setIsOpen={setIsCreating}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default Workgroups;
