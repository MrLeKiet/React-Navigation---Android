import axios, { AxiosError } from "axios";
import React from "react";
import { FetchProductsParam, ProductListParams } from "../TypesCheck/HomeProps";

interface ICatProps {
    setGetCategory: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

interface IProdByCatProps {
    catID: string;
    setGetProductsByCatID: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

interface IProdByFeatureProps {
    setGetProductsByFeature: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

interface ISearchProps {
    searchQuery: string;
    setSearchResults: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

interface ICreateProductProps {
    productData: Omit<ProductListParams, "images" | "_id"> & { images: string[] }; // Updated to handle multiple images
    onSuccess: (message: string) => void;
    onError: (error: string) => void;
}

// New interface for CreateCategory, independent of ICatProps
interface CreateCategoryData {
    name: string;
    images: [string]; // Single image as an array with one element
}

interface ICreateCategoryProps {
    categoryData: Omit<CreateCategoryData, "_id">; // No _id needed for creation
    onSuccess: (message: string) => void;
    onError: (error: string) => void;
}

interface IFetchAllProductsProps {
    setProducts: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
}

export const fetchAllProducts = async ({ setProducts }: IFetchAllProductsProps) => {
    try {
        const response = await axios.get("http://192.168.68.107:9000/product/getAllProducts");
        console.log("API Response for All Products:", response.data);

        if (Array.isArray(response.data)) {
            const fixedData = response.data.map((item: any) => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://192.168.68.107")
                ),
                _id: item._id,
                name: item.name,
                price: item.price,
                oldPrice: item.oldPrice,
                inStock: item.inStock,
                color: item.color,
                size: item.size,
                description: item.description,
                quantity: item.quantity,
                categoryName: item.categoryName,
                isFeatured: item.isFeatured,
                category: item.category,
            }));

            setProducts(fixedData as ProductListParams[]);
        } else {
            console.warn("fetchAllProducts: API data is not an array", response.data);
            setProducts([]);
        }
    } catch (error) {
        console.log("axios get error for all products:", error);
        setProducts([]);
    }
};

export const fetchCategories = async ({ setGetCategory }: ICatProps) => {
    try {
        const response = await axios.get("http://192.168.68.107:9000/category/getAllCategories");
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
            const fixedData = response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://192.168.68.107")
                )
            }));

            setGetCategory(fixedData);
        } else {
            console.warn("fetchCategories: Dữ liệu API không phải là mảng", response.data);
            setGetCategory([]);
        }
    } catch (error) {
        console.log("axios get error ", error);
        setGetCategory([]);
    }
};

export const fetchProductsByCatID = async ({ setGetProductsByCatID, catID }: IProdByCatProps) => {
    try {
        const response: FetchProductsParam = await axios.get(`http://192.168.68.107:9000/product/getProductByCatID/${catID}`);
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
            const fixedData = response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://192.168.68.107")
                )
            }));

            setGetProductsByCatID(fixedData);
        } else {
            console.warn("fetchProductsByCatID: Dữ liệu API không phải là mảng", response.data);
            setGetProductsByCatID([]);
        }
    } catch (error) {
        console.log("axios get error tomatoes", error);
        setGetProductsByCatID([]);
    }
};

export const fetchProductByFeature = async ({ setGetProductsByFeature }: IProdByFeatureProps) => {
    try {
        const response: FetchProductsParam = await axios.get(`http://192.168.68.107:9000/product/getAllProductsIsFeature`);
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
            const fixedData = response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://192.168.68.107")
                )
            }));

            setGetProductsByFeature(fixedData);
        } else {
            console.warn("fetchProductByFeature: Dữ liệu API không phải là mảng", response.data);
            setGetProductsByFeature([]);
        }
    } catch (error) {
        console.log("axios get error potatoes", error);
        setGetProductsByFeature([]);
    }
};

export const searchProductsByName = async ({ searchQuery, setSearchResults }: ISearchProps) => {
    try {
        const response: FetchProductsParam = await axios.get(`http://192.168.68.107:9000/product/searchProduct?name=${searchQuery}`);
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
            const fixedData = response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://192.168.68.107")
                )
            }));

            setSearchResults(fixedData);
        } else {
            console.warn("searchProductsByName: API data is not an array", response.data);
            setSearchResults([]);
        }
    } catch (error) {
        console.log("axios get error", error);
        setSearchResults([]);
    }
};

declare module "react-native" {
    interface FormData {
        entries(): IterableIterator<[string, any]>;
    }
}

export const createProduct = async ({ productData, onSuccess, onError }: ICreateProductProps) => {
    try {
        if (!productData.name || productData.images.length === 0) {
            onError("Tên sản phẩm và ít nhất một ảnh là bắt buộc.");
            return;
        }

        const price = parseFloat(String(productData.price));
        const quantity = parseInt(String(productData.quantity), 10);

        if (isNaN(price) || isNaN(quantity)) {
            onError("Giá và số lượng phải là số hợp lệ.");
            return;
        }

        const formData = new FormData();

        formData.append("name", productData.name);
        formData.append("price", String(price));
        formData.append("quantity", String(quantity));

        if (productData.oldPrice !== undefined) {
            const oldPrice = parseFloat(String(productData.oldPrice));
            if (!isNaN(oldPrice)) {
                formData.append("oldPrice", String(oldPrice));
            }
        }
        if (productData.inStock !== undefined) {
            formData.append("inStock", String(productData.inStock));
        }
        if (productData.description) {
            formData.append("description", productData.description);
        }
        if (productData.isFeatured !== undefined) {
            formData.append("isFeatured", String(productData.isFeatured));
        }
        if (productData.category) {
            formData.append("category", productData.category);
            console.log("Sending category to backend:", productData.category);
        } else {
            console.log("No category provided");
        }

        // Append multiple images
        productData.images.forEach((imageUri, index) => {
            formData.append("images", {
                uri: imageUri,
                type: "image/jpeg",
                name: `${productData.name}-${Date.now()}-${index}.jpg`,
            } as any);
        });

        // Log FormData fields manually without entries()
        console.log("FormData fields:", {
            name: formData.get("name")?.toString() || "Not set",
            price: formData.get("price")?.toString() || "Not set",
            quantity: formData.get("quantity")?.toString() || "Not set",
            oldPrice: formData.get("oldPrice")?.toString() || "Not set",
            inStock: formData.get("inStock")?.toString() || "Not set",
            description: formData.get("description")?.toString() || "Not set",
            isFeatured: formData.get("isFeatured")?.toString() || "Not set",
            category: formData.get("category")?.toString() || "Not set",
            images: productData.images, // Log the images from productData since FormData.get() doesn't handle arrays well
        });

        // Send request to server
        const response = await axios.post(
            "http://192.168.68.107:9000/product/createProduct",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        onSuccess(response.data?.message || "Sản phẩm đã được tạo thành công!");
    } catch (error: AxiosError | unknown) {
        let errorMessage = "Lỗi khi tạo sản phẩm";
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Server response error:", error.response.status, error.response.data);
                errorMessage += `: ${error.response.data.message || "Lỗi máy chủ"}`;
            } else {
                console.log("Network error:", error.message);
                errorMessage += ": Kiểm tra kết nối mạng.";
            }
        } else {
            console.log("Unknown error:", error);
            errorMessage += ": Lỗi không xác định.";
        }
        onError(errorMessage);
    }
};

export const createCategory = async ({ categoryData, onSuccess, onError }: ICreateCategoryProps) => {
    try {
        if (!categoryData.name || !categoryData.images[0]) {
            onError("Category name and image are required.");
            return;
        }

        const formData = new FormData();
        formData.append("name", categoryData.name);
        formData.append("images", { // Match backend expectation for images array
            uri: categoryData.images[0], // Use the first (and only) image in the array
            type: "image/jpeg",
            name: `${categoryData.name}-${Date.now()}.jpg`,
        } as any);

        const response = await axios.post(
            "http://192.168.68.107:9000/category/createCategory",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        onSuccess(response.data.message || "Category created successfully!");
    } catch (error: AxiosError | unknown) {
        let errorMessage = "Failed to create category";
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Server response error:", error.response.status, error.response.data);
                errorMessage += `: ${error.response.data.message || "Server error"}`;
            } else {
                console.log("Network error:", error.message);
                errorMessage += ": Check your network connection.";
            }
        } else {
            console.log("Unknown error:", error);
            errorMessage += ": An unexpected error occurred.";
        }
        onError(errorMessage);
    }
};