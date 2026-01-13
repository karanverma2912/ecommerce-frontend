export interface Product {
    id: number;
    name: string;
    description: string;
    price: string | number;
    discount_percentage: number | null;
    discount_price: number | null;
    sku: string;
    quantity_in_stock: number;
    in_stock: boolean;
    images_urls: string[];
    created_at: string;
}
