export type OrderCreatedItemEvent = {
  id: number;
  menuId: number;
  price: number;
  quantity: number;
  /** 조인된 메뉴명이 있으면 포함 */
  menuName?: string;
};

export type OrderCreatedEvent = {
  orderId: number;
  storeId: number;
  tableId: number;
  totalPrice: number;
  customerName: string | null;
  phoneNumber: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderCreatedItemEvent[];
};
