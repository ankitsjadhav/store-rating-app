import { StarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

const StoreCard = ({ store, sortedRatings, sortConfig, handleSort }) => (
  <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
    <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-gray-50 to-white">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          {store.name}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            ID: {store.id}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-3 pr-5 rounded-xl shadow-sm border border-gray-100 ring-1 ring-black/5">
        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-500">
          <StarIcon className="w-8 h-8" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            Average Rating
          </p>
          <p className="text-3xl font-black text-gray-900 leading-none">
            {store.averageRating.toFixed(1)}
          </p>
        </div>
      </div>
    </div>

    <div className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-1.5 bg-blue-600 rounded-full"></div>
        <h3 className="text-lg font-bold text-gray-800">
          Customer Feedback History
        </h3>
      </div>

      {sortedRatings.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th
                  onClick={() => handleSort("user")}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                >
                  Customer Name{" "}
                  {sortConfig.key === "user"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </th>

                <th
                  onClick={() => handleSort("value")}
                  className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none group"
                >
                  Rating Score{" "}
                  {sortConfig.key === "value"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {sortedRatings.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs border border-white shadow-sm">
                        {(r.user?.name || "A").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {r.user?.name || "Anonymous User"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${
                        r.value >= 4
                          ? "bg-green-50 text-green-700 border-green-100"
                          : r.value >= 3
                          ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      {r.value}
                      <StarIcon className="w-3 h-3 mb-0.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="p-3 bg-gray-100 rounded-full mb-3">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No ratings received yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Feedback will appear here once customers rate this store.
          </p>
        </div>
      )}
    </div>
  </div>
);

export default StoreCard;
