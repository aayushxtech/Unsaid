import React, { useState, useEffect } from "react";
import SideNav from "../../SideNav";
import Navbar from "../../Navbar";
import { supabase } from "../../../../supabaseClient";

const UsersBan = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [banningUser, setBanningUser] = useState(null);
  const [unbanningUser, setUnbanningUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, first_name, last_name, email, avatar_url, is_banned, banned_at, banned_reason"
        )
        .order("first_name", { ascending: true });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!banningUser) return;

    try {
      setActionLoading(true);

      const banReason =
        banningUser.banReason || "Violating community guidelines";

      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: true,
          banned_at: new Date().toISOString(),
          banned_reason: banReason,
        })
        .eq("id", banningUser.id);

      if (error) {
        throw error;
      }

      setUsers(
        users.map((user) =>
          user.id === banningUser.id
            ? {
                ...user,
                is_banned: true,
                banned_at: new Date().toISOString(),
                banned_reason: banReason,
              }
            : user
        )
      );

      setBanningUser(null);
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Failed to ban user. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!unbanningUser) return;

    try {
      setActionLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          is_banned: false,
          banned_at: null,
          banned_reason: null,
        })
        .eq("id", unbanningUser.id);

      if (error) {
        throw error;
      }

      setUsers(
        users.map((user) =>
          user.id === unbanningUser.id
            ? {
                ...user,
                is_banned: false,
                banned_at: null,
                banned_reason: null,
              }
            : user
        )
      );

      setUnbanningUser(null);
    } catch (error) {
      console.error("Error unbanning user:", error);
      alert("Failed to unban user. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ""} ${user.last_name || ""}`
      .trim()
      .toLowerCase();
    const email = (user.email || "").toLowerCase();

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav section="posts" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Manage Users
                </h1>
                <button
                  onClick={fetchUsers}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Refresh
                </button>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : error ? (
                <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 text-gray-500 rounded-lg">
                  No users found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={user.is_banned ? "bg-red-50" : ""}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 mr-3">
                                {user.avatar_url ? (
                                  <img
                                    src={user.avatar_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                                    {(user.first_name || "")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {`${user.first_name || ""} ${
                                    user.last_name || ""
                                  }`.trim() || "Unknown Name"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.id.substring(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email || "No email"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.is_banned ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Banned
                              </span>
                            ) : (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.is_banned ? (
                              <button
                                onClick={() => setUnbanningUser(user)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Unban
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setBanningUser({ ...user, banReason: "" })
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Ban
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {banningUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Ban User</h2>
            <p className="mb-4">
              Are you sure you want to ban{" "}
              {`${banningUser.first_name || ""} ${
                banningUser.last_name || ""
              }`.trim()}
              ? This will prevent them from posting or commenting.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for ban:
              </label>
              <textarea
                value={banningUser.banReason || ""}
                onChange={(e) =>
                  setBanningUser({ ...banningUser, banReason: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                placeholder="Explain why this user is being banned..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setBanningUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}

      {unbanningUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Unban User</h2>
            <p className="mb-4">
              Are you sure you want to unban{" "}
              {`${unbanningUser.first_name || ""} ${
                unbanningUser.last_name || ""
              }`.trim()}
              ? This will restore their posting and commenting privileges.
            </p>
            {unbanningUser.banned_reason && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-700">Ban reason:</p>
                <p className="text-sm text-gray-600">
                  {unbanningUser.banned_reason}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Banned on:{" "}
                  {new Date(unbanningUser.banned_at).toLocaleString()}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUnbanningUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUnbanUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm Unban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersBan;
