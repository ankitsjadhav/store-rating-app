import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";

const StoreCard = ({
  store,
  user,
  ratingInput,
  setRatingInput,
  handleRate,
}) => (
  <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {store.name}
          </h2>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700 border border-yellow-100">
            <StarIcon className="w-3 h-3 text-yellow-500" />
            {store.averageRating.toFixed(1)}
          </div>
        </div>

        <p className="text-gray-500 flex items-center gap-2 text-sm">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          {store.address}
        </p>

        {user && store.userRating && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            <span>✓ You rated this:</span>
            <span className="font-bold">{store.userRating} Stars</span>
          </div>
        )}
      </div>

      {user && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
          <select
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto"
            value={ratingInput[store.id] || ""}
            onChange={(e) =>
              setRatingInput({
                ...ratingInput,
                [store.id]: e.target.value,
              })
            }
          >
            <option value="">Select Rating</option>
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} Stars
              </option>
            ))}
          </select>

          <button
            onClick={() => handleRate(store.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors shadow-sm whitespace-nowrap"
          >
            Submit Rating
          </button>
        </div>
      )}
    </div>
  </div>
);

export default StoreCard;
