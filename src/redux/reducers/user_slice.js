import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosInstance } from "../axios_instance";

const initialState = {
    user: null,
    loading_login: false,
    loading_register: false,
    loading_user: false,
    loading_logout: false

}

export const login = createAsyncThunk('/login', async (inputs) => {
    try {
        const {username, password} = inputs
        await AxiosInstance.post('/user/login',{username, password})
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const logout = createAsyncThunk('/logout', async () => {
    try {
        await AxiosInstance.patch('/user/logout')
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const register = createAsyncThunk('/register', async (inputs) => {
    try {
        const data = new FormData()
        for (const [key, value] of Object.entries(inputs)) {
            data.append(`${key}`,value)
            
        }
        await AxiosInstance.post('/user/register',data)
        return
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

export const fetch_user = createAsyncThunk('/fetch_user', async () => {
    try {
        const res = await AxiosInstance.get('/user/fetch_user')
        return res.data
    } catch (error) {
        throw new Error(error.response.data.message)
    }
})

const userSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetch_user.pending, (state) => {
            state.loading_user = true
        })
        builder.addCase(fetch_user.rejected, (state) => {
            state.loading_user = false
        })
        builder.addCase(fetch_user.fulfilled, (state, action) => {
            state.loading_user = false
            state.user = action.payload.user
        })

        builder.addCase(login.pending, (state) => {
            state.loading_login = true
        })
        builder.addCase(login.rejected, (state) => {
            state.loading_login = false
        })
        builder.addCase(login.fulfilled, (state) => {
            state.loading_login = false
        })

        builder.addCase(register.pending, (state) => {
            state.loading_register = true
        })
        builder.addCase(register.rejected, (state) => {
            state.loading_register = false
        })
        builder.addCase(register.fulfilled, (state) => {
            state.loading_register = false
        })

        builder.addCase(logout.pending, (state) => {
            state.loading_logout = true
        })
        builder.addCase(logout.rejected, (state) => {
            state.loading_logout = false
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.loading_logout = false
            state.user = null
        })
    }
})

export default userSlice.reducer