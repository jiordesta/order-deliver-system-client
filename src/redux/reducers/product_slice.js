import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../axios_instance";

const initialState = {
    products: [],
    loading_products: false,
    loading_create: false,
}

export const create_product = createAsyncThunk('/create_product', async (inputs) => {
    try {
        const data = new FormData()
        for (const [key, value] of Object.entries(inputs)) {
            data.append(`${key}`,value)
        }
        await AxiosInstance.post('/product/create_product',data)
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const fetch_products = createAsyncThunk('/fetch_products', async () => {
    try {
        const res = await AxiosInstance.get('/product/fetch_products')
        return res.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const delete_product = createAsyncThunk('/delete_product', async (id) => {
    try {
        await AxiosInstance.delete(`/product/delete_product/${id}`)
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const update_product = createAsyncThunk('/update_product', async (id) => {
    try {
        await AxiosInstance.patch(`/product/update_product/${id}`)
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

const productSlice = createSlice({
    name: 'item',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetch_products.pending, (state) => {
            state.loading_products = true
        })
        builder.addCase(fetch_products.rejected, (state) => {
            state.loading_products = false
        })
        builder.addCase(fetch_products.fulfilled, (state, action) => {
            state.loading_products = false
            state.products = action.payload.products
        })

        builder.addCase(create_product.pending, (state) => {
            state.loading_create = true
        })
        builder.addCase(create_product.rejected, (state) => {
            state.loading_create = false
        })
        builder.addCase(create_product.fulfilled, (state) => {
            state.loading_create = false
        })
    }
})

export default productSlice.reducer