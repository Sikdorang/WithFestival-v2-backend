export type OrderCreatedItemEvent = {
  id: number;
  menuId: number;
  price: number;
  quantity: number;
};

export type OrderCreatedEvent = {
  orderId: number;
  storeId: number;
  tableId: number;
  totalPrice: number;
  customerName: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderCreatedItemEvent[];
};
