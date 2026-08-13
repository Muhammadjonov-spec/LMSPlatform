import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import { Input, Button, Card, CardBody, CardHeader } from "../../components/ui";

export default function CreateAdmin() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (data) => adminService.createAdmin(data)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await mutateAsync(formData);
      setMessage("Admin successfully created.");
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to create admin.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold">Super Admin Control Panel</h1>
      
      {message && <div className="p-4 bg-green-100 text-green-800 rounded-lg">{message}</div>}
      {error && <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Create New Admin</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            <Input 
              label="Email" 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input 
              label="Password" 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <Button type="submit" variant="primary" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Admin Account"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
