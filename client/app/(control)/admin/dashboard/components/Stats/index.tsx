"use client";
import { OrderUsableType, ProductType, UserType } from "@types";
import { ComponentProps, ReactNode, useMemo, useState } from "react";
import { Typography } from "@components";

function Button({
  active,
  children,
  ...rest
}: {
  active: boolean;
  children: ReactNode;
} & ComponentProps<"button">) {
  return (
    <button
      {...rest}
      className={`px-5 mx-1 py-2 ${
        active ? "bg-blue-500 text-white" : "border text-slate-900"
      } rounded-t-lg`}
    >
      {children}
    </button>
  );
}

function Stats({
  orders,
  products,
  users,
}: {
  orders: OrderUsableType[];
  products: ProductType[];
  users: UserType[];
}) {
  const [index, setIndex] = useState(0);
  const getStartTime = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    switch (index) {
      case 1:
        date.setDate(1);
        break;
      case 2:
        date.setMonth(0);
        break;
      case 3:
        date.setFullYear(2023);
        break;
    }
    return date;
  }, [index]);

  function filteredArr(arr: any[]) {}

  return (
    <div className="my-5 w-full">
      <Typography text="Statistika" />
      <nav className="border-b mt-3 w-full">
        {["Bugungi", "Shu oy", "Shu yil", "Umumiy"].map((title, i) => (
          <Button onClick={() => setIndex(i)} key={i} active={i === index}>
            {title}
          </Button>
        ))}
      </nav>
    </div>
  );
}

export default Stats;
