import { createAsyncThunk } from "@reduxjs/toolkit";


export const getProducts = createAsyncThunk(
    'getProducts',
    ()=>{
        const productData = fetch("http://localhost:5000/product/getProducts")
        .then((res)=>res.json());
        return productData;
    }
)