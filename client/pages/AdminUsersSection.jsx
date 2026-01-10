import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

import UserForm from "../components/AdminUsersSection/UserForm";
import UserFilters from "../components/AdminUsersSection/UserFilters";
import UsersTable from "../components/AdminUsersSection/UsersTable";

const AdminUsersSection = ({ refresh }) => {
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [filters, setFilters] = useState({ name: "", email: "", role: "" });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const inputClass =
    "w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";

  const thClass =
    "px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none";

  const formFields = [
    {
      name: "name",
      label: "Name (Min 20)",
      type: "text",
      minLength: 20,
      maxLength: 60,
      required: true,
    },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "password",
      label: "Password (8-16, 1 Uppercase, 1 Special)",
      type: "password",
      minLength: 8,
      maxLength: 16,
      pattern: "(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}",
      required: true,
    },
    {
      name: "address",
      label: "Address (Max 400)",
      type: "text",
      maxLength: 400,
      required: true,
    },
  ];

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "role", label: "Role" },
    { key: "storeRating", label: "Rating" },
    { key: null, label: "Manage" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await customFetch.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await customFetch.post("/users", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User created successfully");
      setShowUserForm(false);
      setUserData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to create user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await customFetch.patch(
        `/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      !window.confirm("Are you sure? This will unassign any stores they own.")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      await customFetch.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleSort = (key) => {
    if (!key) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedUsers = useMemo(() => {
    let result = users.filter((user) => {
      const matchName = user.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchEmail = user.email
        .toLowerCase()
        .includes(filters.email.toLowerCase());
      const matchRole = filters.role ? user.role === filters.role : true;

      return matchName && matchEmail && matchRole;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA =
          sortConfig.key === "storeRating"
            ? a.storeRating || 0
            : a[sortConfig.key];
        let valB =
          sortConfig.key === "storeRating"
            ? b.storeRating || 0
            : b[sortConfig.key];

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, filters, sortConfig]);

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key)
      return <span className="text-gray-300 ml-1">↕</span>;
    return (
      <span className="text-purple-600 ml-1">
        {sortConfig.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={() => setShowUserForm(!showUserForm)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            showUserForm ? "bg-gray-200" : "bg-purple-600 text-white"
          }`}
        >
          {showUserForm ? "Cancel Form" : "+ Add User"}
        </button>
      </div>

      {showUserForm && (
        <UserForm
          inputClass={inputClass}
          formFields={formFields}
          userData={userData}
          setUserData={setUserData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}

      <UserFilters
        inputClass={inputClass}
        filters={filters}
        handleInputChange={handleInputChange}
      />

      <UsersTable
        thClass={thClass}
        tableColumns={tableColumns}
        users={processedUsers}
        handleSort={handleSort}
        renderSortArrow={renderSortArrow}
        handleDeleteUser={handleDeleteUser}
        handleRoleChange={handleRoleChange}
      />
    </div>
  );
};

export default AdminUsersSection;
