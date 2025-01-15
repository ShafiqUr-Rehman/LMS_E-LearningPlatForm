import express from "express"
import {
    getCourseAnalytics,
    getOrderAnalytics,
    getUserAnalytics
} from "../controllers/anaylatics.controller.js"
import { authorizeRoles, isAuthenticated, } from "../middleWare/auth.js";
import { updateAccessToken } from "../controllers/user.controller.js";

const analyticsRouter = express.Router();
analyticsRouter.get("/get-user-analytics",updateAccessToken, isAuthenticated, authorizeRoles("admin"), getUserAnalytics);
analyticsRouter.get("/get-course-analytics", updateAccessToken , isAuthenticated, authorizeRoles("admin"), getCourseAnalytics);
analyticsRouter.get("/get-order-analytics", updateAccessToken , isAuthenticated, authorizeRoles("admin"), getOrderAnalytics);

export default analyticsRouter