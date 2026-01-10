import StoreCard from "./StoreCard";

const StoreList = ({
  filteredStores,
  user,
  ratingInput,
  setRatingInput,
  handleRate,
  searchQuery,
}) => (
  <div className="grid gap-6">
    {filteredStores.map((store) => (
      <StoreCard
        key={store.id}
        store={store}
        user={user}
        ratingInput={ratingInput}
        setRatingInput={setRatingInput}
        handleRate={handleRate}
      />
    ))}

    {filteredStores.length === 0 && (
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-400 text-lg">
          No stores found matching "{searchQuery}"
        </p>

        <button
          onClick={() => setSearchQuery("")}
          className="text-blue-600 text-sm mt-2 hover:underline"
        >
          Clear Search
        </button>
      </div>
    )}
  </div>
);

export default StoreList;
