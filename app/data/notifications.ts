export interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    createdAt: string; // ISO string
}

export const notifications: Notification[] = [
    {
        id: 1,
        title: "Welcome!",
        message: "Thanks for joining our store. Enjoy shopping!",
        read: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        title: "Order Shipped",
        message: "Your order #1234 has been shipped.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        id: 3,
        title: "Discount Available",
        message: "Get 10% off on all items this weekend.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
];

export const unreadCount = notifications.filter((n) => !n.read).length;
