const Navbar = ({ navigate }) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            System <span className="text-purple-600">Administrator</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/change-password")}
            className="text-sm font-medium text-gray-600 hover:text-purple-600 transition"
          >
            Change Password
          </button>

          <div className="h-6 w-px bg-gray-200"></div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="text-sm font-medium text-red-500 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
