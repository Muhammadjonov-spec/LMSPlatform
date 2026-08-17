import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { Button, Card, CardBody, CardHeader } from "../../components/ui";

export default function OrdersApproval() {
  const { data: ordersData, refetch, isLoading } = useQuery({
    queryKey: ["pendingOrders"],
    queryFn: () => orderService.getPendingOrders()
  });

  const { mutateAsync: approveMutate, isPending: isApproving } = useMutation({
    mutationFn: (id) => orderService.approveOrder(id)
  });

  const [message, setMessage] = useState("");

  const handleApprove = async (id) => {
    try {
      await approveMutate(id);
      setMessage("Order successfully approved.");
      refetch();
    } catch (e) {
      console.error(e);
      setMessage("Error approving order.");
    }
  };

  const orders = ordersData?.data || [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pending Orders</h1>
      </div>
      
      {message && <div className="p-4 bg-green-100 text-green-800 rounded-lg">{message}</div>}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Review Receipts</h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No pending orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Receipt</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="p-4">{order.student?.firstName} {order.student?.lastName} <br/><span className="text-sm text-gray-400">{order.student?.email}</span></td>
                      <td className="p-4">{order.course?.title}</td>
                      <td className="p-4 text-blue-500 underline cursor-pointer">
                        <a href={`http://localhost:5000/${order.receiptImage}`} target="_blank" rel="noreferrer">View Receipt</a>
                      </td>
                      <td className="p-4 text-right">
                        <Button 
                          variant="primary" 
                          onClick={() => handleApprove(order._id)} 
                          disabled={isApproving}
                        >
                          Approve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
