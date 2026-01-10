import { TrashIcon } from "@heroicons/react/24/outline";

const UserRow = ({ user, handleRoleChange, handleDeleteUser }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{user.address}</td>

    <td className="px-6 py-4">
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold ${
          user.role === "ADMIN"
            ? "bg-purple-100 text-purple-800"
            : user.role === "STORE_OWNER"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100"
        }`}
      >
        {user.role}
      </span>
    </td>

    <td className="px-6 py-4 text-sm font-bold text-yellow-600">
      {user.role === "STORE_OWNER"
        ? user.storeRating?.toFixed(1) || "0.0"
        : "-"}
    </td>

    <td className="px-6 py-4 flex items-center gap-2">
      {user.role !== "ADMIN" && (
        <>
          <select
            className="text-xs border-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, e.target.value)}
          >
            <option value="USER">User</option>
            <option value="STORE_OWNER">Owner</option>
          </select>

          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 hover:bg-red-100 rounded transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </>
      )}
    </td>
  </tr>
);

export default UserRow;
