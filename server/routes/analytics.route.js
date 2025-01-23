import express from "express"
import {
    getAnalyticsCourses,
    getAnalyticsOrders,
    getAnalyticsUsers
} from "../controllers/anaylatics.controller.js"
import { authorizeRoles, isAuthenticated, } from "../middleWare/auth.js";
import { updateAccessToken } from "../controllers/user.controller.js";


const analyticsRouter = express.Router();
analyticsRouter.get("/get-user-analytics",updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAnalyticsUsers);
analyticsRouter.get("/get-course-analytics",updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAnalyticsCourses);
analyticsRouter.get("/get-order-analytics",updateAccessToken,  isAuthenticated, authorizeRoles("admin"), getAnalyticsOrders);

export default analyticsRouter