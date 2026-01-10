const UserForm = ({
  formFields,
  inputClass,
  userData,
  handleInputChange,
  handleSubmit,
  setUserData,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 mb-8">
    <h3 className="font-bold text-lg text-purple-700 mb-4">Create New User</h3>

    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {formFields.map((field) => (
        <div key={field.name}>
          <label className="text-sm font-medium text-gray-600">
            {field.label}
          </label>

          <input
            className={inputClass}
            name={field.name}
            {...field}
            value={userData[field.name]}
            onChange={handleInputChange(setUserData)}
          />
        </div>
      ))}

      <div className="md:col-span-2">
        <label className="text-sm font-medium text-gray-600">Role</label>
        <select
          className={inputClass}
          name="role"
          value={userData.role}
          onChange={handleInputChange(setUserData)}
        >
          <option value="USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button className="md:col-span-2 bg-purple-600 text-white py-2 rounded-lg mt-2 font-medium hover:bg-purple-700 transition">
        Create User
      </button>
    </form>
  </div>
);

export default UserForm;
