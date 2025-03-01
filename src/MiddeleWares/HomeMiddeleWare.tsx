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
    productData: Omit<ProductListParams, "images" | "_id"> & { imageUri: string }; // Keep imageUri for single image
    onSuccess: (message: string) => void;
    onError: (error: string) => void;
}

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

export const createProduct = async ({ productData, onSuccess, onError }: ICreateProductProps) => {
    try {
        if (!productData.name || !productData.imageUri) {
            onError("Tên sản phẩm và ảnh là bắt buộc.");
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
        }

        // Gửi ảnh lên server
        formData.append("images", {
            uri: productData.imageUri,
            type: "image/jpeg",
            name: `${productData.name}-${Date.now()}.jpg`,
        } as any);

        // Gửi request lên server
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
                errorMessage += `: ${error.response.data.message || "Lỗi máy chủ"}`;
            } else {
                errorMessage += ": Kiểm tra kết nối mạng.";
            }
        } else {
            errorMessage += ": Lỗi không xác định.";
        }
        onError(errorMessage);
    }
};
