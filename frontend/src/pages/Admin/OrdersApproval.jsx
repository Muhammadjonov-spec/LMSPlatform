import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { Button, Card, CardBody, CardHeader } from "../../components/ui";
import { getImageUrl } from "../../utils/helpers";

export default function OrdersApproval() {
  const { data: ordersData, refetch, isLoading } = useQuery({
    queryKey: ["allOrders"],
    queryFn: () => orderService.getAllOrders()
  });

  const { mutateAsync: approveMutate, isPending: isApproving } = useMutation({
    mutationFn: (id) => orderService.approveOrder(id)
  });

  const [message, setMessage] = useState("");

  const handleApprove = async (id) => {
    try {
      await approveMutate(id);
      setMessage("Chek muvaffaqiyatli tasdiqlandi.");
      refetch();
    } catch (e) {
      console.error(e);
      setMessage("Chekni tasdiqlashda xatolik yuz berdi.");
    }
  };

  const orders = ordersData?.data || [];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Buyurtmalarni Tasdiqlash (Orders)</h1>
      </div>
      
      {message && <div className="p-4 bg-green-100 text-green-800 rounded-lg">{message}</div>}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Barcha tushumlar va cheklar</h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div>Yuklanmoqda...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Hozircha buyurtmalar yo'q.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">O'quvchi</th>
                    <th className="p-4">Kurs</th>
                    <th className="p-4">Chek (Receipt)</th>
                    <th className="p-4">Holati</th>
                    <th className="p-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="p-4">{order.student?.firstName} {order.student?.lastName} <br/><span className="text-sm text-gray-400">{order.student?.email}</span></td>
                      <td className="p-4">{order.course?.title}</td>
<<<<<<< HEAD
                      <td className="p-4 text-blue-500 underline cursor-pointer">
                        <a href={getImageUrl(order.receiptImage)} target="_blank" rel="noreferrer">View Receipt</a>
=======
                      <td className="p-4">
                        {order.receiptUrl ? (
                          <a href={order.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline cursor-pointer">
                            Chekni ko'rish
                          </a>
                        ) : "Chek yo'q"}
                      </td>
                      <td className="p-4">
                        {order.status === "approved" ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold">Tasdiqlangan</span>
                        ) : order.status === "rejected" ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Rad etilgan</span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold">Kutilmoqda</span>
                        )}
>>>>>>> ce5b19a (added test frontend feature)
                      </td>
                      <td className="p-4 text-right">
                        {order.status === "pending" || !order.status ? (
                          <Button 
                            className="bg-indigo-600 text-white" 
                            onClick={() => handleApprove(order._id)} 
                            disabled={isApproving}
                          >
                            Tasdiqlash
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">Bajarilgan</span>
                        )}
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
