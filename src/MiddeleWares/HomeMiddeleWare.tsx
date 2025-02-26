import axios from "axios";
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

export const fetchCategories = async ({ setGetCategory }: ICatProps) => {
    try {
        const response = await axios.get("http://10.106.3.107:9000/category/getAllCategories");
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
            const fixedData = response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://10.106.3.107")
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
        const response: FetchProductsParam = await axios.get(`http://10.106.3.107:9000/product/getProductByCatID/${catID}`);
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
            const fixedData = response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://10.106.3.107")
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
        const response: FetchProductsParam = await axios.get(`http://10.106.3.107:9000/product/getAllProductsIsFeature`);
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
            const fixedData = response.data.map(item => ({
                ...item,
                images: item.images.map((img: string) =>
                    img.replace("http://localhost", "http://10.106.3.107")
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

