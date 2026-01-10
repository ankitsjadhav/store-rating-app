import { TrashIcon } from "@heroicons/react/24/outline";

const StoreTable = ({
  tableColumns,
  thClass,
  sortedStores,
  handleSort,
  renderSortArrow,
  handleDeleteStore,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
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
        {sortedStores.map((store) => (
          <tr key={store.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
              {store.name}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{store.email}</td>
            <td className="px-6 py-4 text-sm text-gray-500">{store.address}</td>
            <td className="px-6 py-4 text-sm text-blue-600 font-medium">
              {store.owner?.name || "Unassigned"}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900 font-bold text-yellow-600">
              {store.averageRating?.toFixed(1) || "0.0"} ★
            </td>

            <td className="px-6 py-4">
              <button
                onClick={() => handleDeleteStore(store.id)}
                className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 hover:bg-red-100 rounded transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}

        {sortedStores.length === 0 && (
          <tr>
            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
              No stores found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default StoreTable;
