import React from "react";

const AdminStoreTable = ({ stores }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-10">
      <table className="min-w-full">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Address</th>
            <th className="py-3 px-6 text-left">Rating</th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {stores.map((store) => (
            <tr key={store.id} className="border-b hover:bg-gray-50">
              <td className="py-4 px-6">{store.name}</td>
              <td className="py-4 px-6">{store.email}</td>
              <td className="py-4 px-6">{store.address}</td>
              <td className="py-4 px-6 font-bold text-blue-600">
                {store.averageRating?.toFixed(1) || "0.0"} ★
              </td>
            </tr>
          ))}

          {stores.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No stores found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStoreTable;
