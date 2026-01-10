import { KeyIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

const OwnerNavbar = ({ navigate }) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-90">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-200">
          O
        </div>
        <span className="text-lg font-bold tracking-tight text-gray-800">
          Store<span className="text-blue-600">Owner</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/change-password")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
        >
          <KeyIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Password</span>
        </button>

        <div className="h-6 w-px bg-gray-200"></div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  </nav>
);

export default OwnerNavbar;
