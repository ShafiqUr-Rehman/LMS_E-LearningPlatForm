import express from "express"
import {
    createOrder,getAllOrder
} from "../controllers/order.controller.js"
import {authorizeRoles, isAuthenticated } from "../middleWare/auth.js";
import { updateAccessToken } from "../controllers/user.controller.js";


const orderRouter = express.Router();
orderRouter.post("/create-order", isAuthenticated,createOrder);
orderRouter.get("/get-all-orders",isAuthenticated, authorizeRoles("admin"), getAllOrder);



export default orderRouter