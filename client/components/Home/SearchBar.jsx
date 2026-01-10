import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-gray-200 pb-6">
    <div>
      <h2 className="text-3xl font-bold text-gray-900">Explore Stores</h2>
      <p className="text-gray-500 mt-1">
        Discover the best rated local businesses around you.
      </p>
    </div>

    <div className="w-full md:w-96 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      </div>

      <input
        type="text"
        placeholder="Search stores or addresses..."
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  </div>
);

export default SearchBar;
