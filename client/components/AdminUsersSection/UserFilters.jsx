const UserFilters = ({
  inputClass,
  filters,
  handleInputChange,
  setFilters,
}) => (
  <div className="bg-white p-4 rounded-t-xl border border-gray-200 flex flex-col md:flex-row gap-4">
    {["name", "email"].map((f) => (
      <input
        key={f}
        name={f}
        placeholder={`Filter by ${f}`}
        className={inputClass}
        value={filters[f]}
        onChange={handleInputChange(setFilters)}
      />
    ))}

    <select
      className={inputClass}
      name="role"
      value={filters.role}
      onChange={handleInputChange(setFilters)}
    >
      <option value="">All Roles</option>
      <option value="USER">User</option>
      <option value="STORE_OWNER">Store Owner</option>
      <option value="ADMIN">Admin</option>
    </select>
  </div>
);

export default UserFilters;
