import React, { useState, useEffect } from "react";
import "./Member.css";
import { getMembers, createMember, updateMember, deleteMember } from "./api";

const Members = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("list");
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

  // Fetch members from backend on mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getMembers();
      setMembers(response.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch members");
    }
  };

  const filteredMembers = members.filter((member) =>
    [member?.name, member?.email, member?.role]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddOrUpdateMember = async (e) => {
    e.preventDefault();

    try {
      if (editingMember) {
        const response = await updateMember(editingMember._id, newMember);
        setMembers(
          members.map((m) => (m._id === editingMember._id ? response.data : m))
        );
        setEditingMember(null);
      } else {
        const response = await createMember(newMember);
        setMembers([response.data, ...members]);
      }

      setNewMember({
        name: "",
        email: "",
        phone: "",
        designation: "",
        role: "member",
      });
      setShowPopup(false);
    } catch (err) {
      console.error(err);
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
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(id);
      setMembers(members.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete member");
    }
  };

  return (
    <div className="members-container">
      {/* Header */}
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
            + Add New Member
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "list" ? "active-tab" : ""}
          onClick={() => setTab("list")}
        >
          List View
        </button>
        <button
          className={tab === "board" ? "active-tab" : ""}
          onClick={() => setTab("board")}
        >
          Board View
        </button>
      </div>

      {/* List View */}
      {tab === "list" && (
        <div className="list-view">
          {filteredMembers.map((member) => {
            const name = member?.name || "Unknown";
            return (
              <div key={member._id} className="member-card">
                <div className="member-info">
                  <div className="avatar">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="member-name">{name}</p>
                    <p className="member-email">{member?.email || "N/A"}</p>
                    <p className="member-phone">{member?.phone || "N/A"}</p>
                    <p className="member-designation">
                      {member?.designation || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="member-role">
                  <span
                    className={`role-badge ${
                      ["admin", "owner"].includes(member?.role)
                        ? "role-admin"
                        : "role-member"
                    }`}
                  >
                    {member?.role || "member"}
                  </span>
                  <div className="actions">
                    <button onClick={() => handleEdit(member)}>✏️</button>
                    <button onClick={() => handleDelete(member._id)}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Board View */}
      {tab === "board" && (
        <div className="board-view">
          {filteredMembers.map((member) => {
            const name = member?.name || "Unknown";
            return (
              <div key={member._id} className="board-card">
                <div className="avatar">
                  {name.substring(0, 2).toUpperCase()}
                </div>
                <h3>{name}</h3>
                <p>{member?.email || "N/A"}</p>
                <p>{member?.phone || "N/A"}</p>
                <p>{member?.designation || "N/A"}</p>
                <span
                  className={`role-badge ${
                    ["admin", "owner"].includes(member?.role)
                      ? "role-admin"
                      : "role-member"
                  }`}
                >
                  {member?.role || "member"}
                </span>
                <div className="actions">
                  <button onClick={() => handleEdit(member)}>✏️</button>
                  <button onClick={() => handleDelete(member._id)}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup Form */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-form" onClick={(e) => e.stopPropagation()}>
            <h2>{editingMember ? "Edit Member" : "Add New Member"}</h2>
            <form onSubmit={handleAddOrUpdateMember}>
              <input
                type="text"
                placeholder="Name"
                value={newMember.name || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newMember.phone || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Designation"
                value={newMember.designation || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, designation: e.target.value })
                }
              />
              <select
                value={newMember.role || "member"}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <div className="form-actions">
                <button type="submit">
                  {editingMember ? "Update Member" : "Add Member"}
                </button>
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
