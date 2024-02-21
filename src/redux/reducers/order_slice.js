import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../axios_instance";

const initialState = {
    orders: [],
    loading_orders: false,
    loading_create: false,
}

export const create_order = createAsyncThunk('/create_order', async (order) => {
    try {
        const data = new FormData()
        let items = []
        order.map((item) => {
            for (let i = 0; i < item.quantity; i++) {
                items.push(item._id)
              }
        })
        data.append('items',items)
        await AxiosInstance.post('/order/create_order',data)
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})


export const fetch_orders = createAsyncThunk('/fetch_orders', async () => {
    try {
        const res = await AxiosInstance.get('/order/fetch_orders')
        return res.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const fetch_my_orders = createAsyncThunk('/fetch_my_orders', async () => {
    try {
        const res = await AxiosInstance.get('/order/fetch_my_orders')
        return res.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const update_status = createAsyncThunk('/update_status/:id', async ({id, status}) => {
    try {
        await AxiosInstance.patch(`/order/update_status/${id}`, {status})
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

const orderSlice = createSlice({
    name: 'order',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(create_order.pending, (state) => {
            state.loading_create = true
        })
        builder.addCase(create_order.rejected, (state) => {
            state.loading_create = false
        })
        builder.addCase(create_order.fulfilled, (state) => {
            state.loading_create = false
        })

        builder.addCase(fetch_orders.pending, (state) => {
            state.loading_orders = true
        })
        builder.addCase(fetch_orders.rejected, (state) => {
            state.loading_orders = false
        })
        builder.addCase(fetch_orders.fulfilled, (state,action) => {
            state.loading_orders = false
            state.orders = action.payload.orders
        })

        builder.addCase(fetch_my_orders.pending, (state) => {
            state.loading_orders = true
        })
        builder.addCase(fetch_my_orders.rejected, (state) => {
            state.loading_orders = false
        })
        builder.addCase(fetch_my_orders.fulfilled, (state,action) => {
            state.loading_orders = false
            state.orders = action.payload.orders
        })
    }
})

export default orderSlice.reducer