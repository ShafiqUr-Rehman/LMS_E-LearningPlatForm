import express from "express"
import {
    getAnalyticsCourses,
    getAnalyticsOrders,
    getAnalyticsUsers
} from "../controllers/anaylatics.controller.js"
import { authorizeRoles, isAuthenticated, } from "../middleWare/auth.js";


const analyticsRouter = express.Router();
analyticsRouter.get("/get-user-analytics", isAuthenticated, authorizeRoles("admin"), getAnalyticsUsers);
analyticsRouter.get("/get-course-analytics", isAuthenticated, authorizeRoles("admin"), getAnalyticsCourses);
analyticsRouter.get("/get-order-analytics",  isAuthenticated, authorizeRoles("admin"), getAnalyticsOrders);

export default analyticsRouter