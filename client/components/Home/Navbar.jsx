import { ArrowRightOnRectangleIcon, KeyIcon } from "@heroicons/react/24/solid";

const Navbar = ({ user, navigate }) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Store<span className="text-blue-600">Finder</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 text-sm">
                {user.role === "ADMIN" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100 hover:bg-purple-100 transition font-medium"
                  >
                    Admin Dashboard
                  </button>
                )}

                {user.role === "STORE_OWNER" && (
                  <button
                    onClick={() => navigate("/store-owner")}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 hover:bg-emerald-100 transition font-medium"
                  >
                    My Store Console
                  </button>
                )}
              </div>

              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block leading-tight">
                  <p className="text-xs text-gray-500 font-medium">
                    Welcome back,
                  </p>
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                </div>

                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={() => navigate("/change-password")}
                  className="text-gray-400 hover:text-blue-600 transition p-1.5 hover:bg-gray-100 rounded-full"
                >
                  <KeyIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="text-gray-400 hover:text-red-500 transition p-1.5 hover:bg-red-50 rounded-full"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
