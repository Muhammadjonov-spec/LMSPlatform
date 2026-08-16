import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import { Input, Button, Card, CardBody, CardHeader } from "../../components/ui";

export default function UserManagement() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editUserId, setEditUserId] = useState(null);

  const { data: usersData, refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => adminService.getUsers()
  });

  const { mutateAsync: createMutate, isPending: isCreating } = useMutation({
    mutationFn: (data) => adminService.createUser(data)
  });

  const { mutateAsync: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: (data) => adminService.updateUser(editUserId, data)
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id) => adminService.deleteUser(id)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      if (editUserId) {
        await updateMutate({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role
        });
        setMessage("User successfully updated.");
      } else {
        await createMutate(formData);
        setMessage("User successfully created. Verification email sent.");
      }
      setFormData({ firstName: "", lastName: "", email: "", password: "", role: "student" });
      setEditUserId(null);
      refetch();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Operation failed.");
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "student",
      password: "" // password not required on edit
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setMessage("");
    setError("");
    try {
      await deleteMutate(id);
      setMessage("User successfully deleted.");
      if (editUserId === id) {
        setEditUserId(null);
        setFormData({ firstName: "", lastName: "", email: "", password: "", role: "student" });
      }
      refetch();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Failed to delete user.");
    }
  };

  const users = usersData?.data || [];

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto mt-6">
      <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      
      {message && <div className="p-4 bg-green-100 text-green-800 rounded-xl font-medium border border-green-200">{message}</div>}
      {error && <div className="p-4 bg-red-100 text-red-800 rounded-xl font-medium border border-red-200">{error}</div>}

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200 py-4 px-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{editUserId ? "Edit User" : "Create New User"}</h2>
          {editUserId && (
            <button 
              onClick={() => {
                setEditUserId(null);
                setFormData({ firstName: "", lastName: "", email: "", password: "", role: "student" });
              }} 
              className="text-sm font-semibold text-blue-600 hover:underline">
              Cancel Edit
            </button>
          )}
        </CardHeader>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input 
                label="First Name" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <Input 
                label="Last Name" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <Input 
                  label="Email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Role</label>
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            {!editUserId && (
              <Input 
                label="Password" 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            )}
            
            <Button type="submit" variant="primary" className="w-full md:w-auto md:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold mt-2" disabled={isCreating || isUpdating}>
              {editUserId 
                ? (isUpdating ? "Updating..." : "Update User") 
                : (isCreating ? "Creating..." : "Create User")}
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card className="shadow-sm border-gray-200 mt-4">
        <CardHeader className="bg-gray-50 border-b border-gray-200 py-4 px-6 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                  <th className="py-4 px-6 font-semibold">Name</th>
                  <th className="py-4 px-6 font-semibold">Email</th>
                  <th className="py-4 px-6 font-semibold">Role</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 
                          'bg-green-100 text-green-700'}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 mr-2"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-800 font-semibold px-3 py-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
