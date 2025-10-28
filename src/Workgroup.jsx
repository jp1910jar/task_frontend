import React, { useState, useEffect } from "react";
import { getMembers, createWorkgroup, getWorkgroups } from "./api";
import { PlusCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Workgroup.css";

const CreateWorkgroup = ({ isOpen, setIsOpen, onCreate }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data?.users || res.data || []);
    } catch (err) {
      console.error("❌ Error fetching members:", err.response?.data || err.message);
      setMembers([]); // prevent crash
    }
  };

  const toggleMember = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return alert("Workgroup name is required");

    setLoading(true);
    try {
      const res = await createWorkgroup({
        name,
        description: desc,
        members: selected,
      });
      if (res.data) onCreate(res.data);
      setName("");
      setDesc("");
      setSelected([]);
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
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="modal-content" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
            <h2>Create Workgroup</h2>
            <input placeholder="Workgroup Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />

            <div className="member-select">
              <h4>Select Members</h4>
              <div className="member-list">
                {members.length > 0 ? (
                  members.map((m) => (
                    <label key={m._id}>
                      <input
                        type="checkbox"
                        checked={selected.includes(m._id)}
                        onChange={() => toggleMember(m._id)}
                      />
                      {m.name}
                    </label>
                  ))
                ) : (
                  <p>No members found.</p>
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

const WorkgroupCard = ({ workgroup }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="workgroup-card"
      whileHover={{ scale: 1.03 }}
      onClick={() => navigate(`/workgroup/${workgroup._id}/workspaces`)}
    >
      <h3>{workgroup.name}</h3>
      <p>{workgroup.description || "No description"}</p>
      <p><Users size={16} /> Members: {workgroup.members?.length || 0}</p>
      <p>Workspaces: {workgroup.workspaces?.length || 0}</p>
    </motion.div>
  );
};

const Workgroups = () => {
  const [workgroups, setWorkgroups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkgroups();
  }, []);

  const fetchWorkgroups = async () => {
    try {
      const res = await getWorkgroups();
      setWorkgroups(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching workgroups:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (wg) => setWorkgroups((prev) => [...prev, wg]);

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

      <CreateWorkgroup isOpen={isCreating} setIsOpen={setIsCreating} onCreate={handleCreate} />
    </div>
  );
};

export default Workgroups;
