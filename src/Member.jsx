import React, { useState, useEffect } from "react";
import "./Member.css";
import { getMembers, createMember, updateMember, deleteMember } from "./api";

const Members = () => {
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    role: "member",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      const data = Array.isArray(res) ? res : res.data || [];
      setMembers(data.filter((m) => m && m._id));
    } catch (err) {
      console.error("Error fetching members:", err);
      setMembers([]);
    }
  };

  const handleAddOrUpdateMember = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingMember) {
        response = await updateMember(editingMember._id, newMember);
        const { data, removeOldUser, oldUserId } = response.data;

        let updatedList = members.filter((m) => m._id !== editingMember._id);
        if (removeOldUser && oldUserId) {
          updatedList = updatedList.filter((m) => m._id !== oldUserId);
        }
        setMembers([data, ...updatedList]);
      } else {
        response = await createMember(newMember);
        setMembers([response.data, ...members]);
      }

      setNewMember({ name: "", email: "", phone: "", designation: "", role: "member" });
      setEditingMember(null);
      setShowPopup(false);
    } catch (err) {
      console.error("Error saving member:", err);
      alert(err.response?.data?.message || "Failed to save member");
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setNewMember({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      designation: member.designation || "",
      role: member.role || "member",
    });
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await deleteMember(id);
      setMembers(members.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredMembers = members.filter((m) =>
    [m.name, m.email, m.role].some((v) => v && v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="members-container">
      <div className="members-header">
        <h1>Workspace Members</h1>

        <div className="header-actions">
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="add-member-btn" onClick={() => setShowPopup(true)}>
            + Add Member
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="table-wrapper">
        <table className="member-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((m) => (
              <tr key={m._id}>
                <td>
                  <div className="avatar-table">{m.name?.charAt(0).toUpperCase()}</div>
                </td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone || "-"}</td>
                <td>{m.designation || "-"}</td>
                <td>
                  <span className={`role-badge ${m.role === "admin" ? "role-admin" : "role-member"}`}>
                    {m.role}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(m)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(m._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-form" onClick={(e) => e.stopPropagation()}>
            <h2>{editingMember ? "Edit Member" : "Add Member"}</h2>
            <form onSubmit={handleAddOrUpdateMember}>
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Designation"
                value={newMember.designation}
                onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
              />
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <div className="form-actions">
                <button type="submit">{editingMember ? "Update" : "Add"}</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    setEditingMember(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;

