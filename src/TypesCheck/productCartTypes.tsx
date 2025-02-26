export interface ProductListParams {
    _id: string;
    images: string[]; // Sửa lại thành string[] để hỗ trợ nhiều hình ảnh (tương thích với [string])
    name: string;
    price: number;
    oldPrice?: number;
    color?: string;
    size?: string;
    description?: string;
    quantity: number; // Số lượng tồn kho
    inStock?: boolean;
    isFeatured?: boolean;
    category?: string;
    cartQuantity?: number; // Thêm cartQuantity tùy chọn cho số lượng trong giỏ hàng
}

export interface CartItem {
    cart: ProductListParams[];
}

export interface CartState {
    cart: {
        cart: ProductListParams[]; // Mảng sản phẩm trong giỏ
        length: number; // Số lượng sản phẩm
    };
}