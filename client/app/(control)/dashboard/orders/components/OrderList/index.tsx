"use client";
import { Table, TableBody, TableHead } from "@components/dashboard";
import "./OrderList.css";
import { MenuButton } from "@components";
import { setOrderState, useAppSelector } from "@/store/store";
import { VendorWithOrders } from "@types";
import { useCallback, useMemo } from "react";
import { Filter } from "@/app/utils/filter";
import { Checkbox } from "@/app/(customer)/(shop)/products/components";

function OrderList({ data: { orders } }: { data: VendorWithOrders }) {
  const state = useAppSelector((state) => state.controlOrderFilter);
  const filter = useMemo(() => new Filter(setOrderState), []);

  const allAreChecked = useMemo(
    () => state.length === orders.length,
    [orders, state.length]
  );
  const handleCheck = useCallback(() => {
    filter.selectAll(orders);
    console.log(filter.state);
  }, [orders, filter]);
  console.log(state);
  return (
    <Table>
      <TableHead
        data={[
          <Checkbox key={1} checked={allAreChecked} onChange={handleCheck} />,
          "ID",
          "Nomi",
          "Holati",
          "Qiymati",
          "Xaridor",
          "Sanasi",
          "To'lov turi",
          <MenuButton key={1}>
            <p className="p-2 hover:bg-gray-300 text-red-600 rounded-md  z-20 bg-white">
              <i className="fa-solid  fa-trash mr-2"></i>O'chirish
            </p>
          </MenuButton>,
        ]}
      />
      <tbody>
        {orders.map((e, i) => (
          <TableBody
            key={i}
            data={[
              <Checkbox
                key={i}
                checked={state.findIndex((el) => el.slug === e.slug) !== -1}
                onChange={() => filter.select(e, "order")}
              />,
              e.slug,
              e.productId.name,
              e.status,
              e.totalPrice,
              e.clientId.username,
              new Date(e.date).toLocaleString(),
              e.paymentMethod,
              <MenuButton key={i}>
                <p className="p-2 hover:bg-gray-300 text-red-600 rounded-md  z-20 bg-white">
                  <i className="fa-solid  fa-trash mr-2"></i>O'chirish
                </p>
              </MenuButton>,
            ]}
          />
        ))}
      </tbody>
    </Table>
  );
}

export default OrderList;
