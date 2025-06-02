"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { toast } from "sonner";
import { useAppSelector } from "@/state/redux";
import { useGetAllOrdersBySellerQuery } from "@/state/api";
import { Order } from "@/types/prismaTypes";
import Image from "next/image";

const Orders = () => {
  const currency = useAppSelector((state) => state.global.currency);
  const isSeller = useAppSelector((state) => state.global.isSeller);
  const [orders, setOrders] = useState<Order[]>([]);

  const { data: ordersData, isSuccess } = useGetAllOrdersBySellerQuery(
    undefined,
    { skip: !isSeller }
  );

  useEffect(() => {
    if (isSuccess && ordersData?.orders) {
      setOrders(ordersData.orders);
    }
  }, [isSuccess, ordersData]);

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300"
          >
            <div className="flex gap-5 max-w-80">
              <Image
                className="w-12 h-12 object-cover"
                src={assets.box_icon}
                alt="box_icon"
              />
              <div>
                {order.items.map((item: Order, index: number) => (
                  <div key={index} className="flex flex-col">
                    <p className="font-medium">
                      {item.product.name}{" "}
                      <span className="text-primary">x {item.quantity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm md:text-base text-black/60">
              <p className="text-black/80">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>
                {order.address.street}, {order.address.city}
              </p>
              <p>
                {order.address.state}, {order.address.zipcode},{" "}
                {order.address.country}
              </p>
              <p></p>
              <p>{order.address.phone}</p>
            </div>

            <p className="font-medium text-lg my-auto">
              {currency}
              {order.amount}
            </p>

            <div className="flex flex-col text-sm md:text-base text-black/60">
              <p>Method: {order.paymentType}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
