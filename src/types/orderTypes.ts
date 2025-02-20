export interface Order {
    id: number;
    userId: number;
    status: string;
    createdAt: Date;
}

export interface OrderProduct {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
} 