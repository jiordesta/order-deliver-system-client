import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../axios_instance";

const initialState = {
    orders: [],
    pending:[],
    preparing:[],
    serving:[],
    delivering:[],
    loading_orders: false,
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    extraReducers: (builder) => {

    }
})

export default orderSlice.reducer