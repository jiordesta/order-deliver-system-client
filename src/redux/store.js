import { configureStore } from "@reduxjs/toolkit";
import user_slice from "./reducers/user_slice";
import order_slice from "./reducers/order_slice";
import product_slice from "./reducers/product_slice";
import notif_slice from "./reducers/notification_slice";

export const store = configureStore({
    reducer: {
        user: user_slice,
        order: order_slice,
        product: product_slice,
        notif: notif_slice
    }
})