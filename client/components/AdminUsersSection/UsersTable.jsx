import UserRow from "./UserRow";

const UsersTable = ({
  thClass,
  tableColumns,
  users,
  handleSort,
  renderSortArrow,
  handleDeleteUser,
  handleRoleChange,
}) => (
  <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {tableColumns.map((col, index) => (
            <th
              key={index}
              onClick={() => handleSort(col.key)}
              className={thClass}
            >
              {col.label} {col.key && renderSortArrow(col.key)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            handleRoleChange={handleRoleChange}
            handleDeleteUser={handleDeleteUser}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default UsersTable;
