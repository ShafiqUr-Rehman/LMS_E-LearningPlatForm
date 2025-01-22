import ErrorHandler from "../utilis/ErrorHandler.js";
import User from "../models/user.model.js";
import { generateLast12MonthsData } from "../utilis/anaylatics.generator.js";
import Course from "../models/course.model.js";
import OrderModel from "../models/order.model.js";

// Get users -- admin
export const getAnalyticsUsers = async (req, res, next) => {
    try {
        const usersAnalytics = await generateLast12MonthsData(User);
        
        res.status(200).json({
            success: true,
            users: usersAnalytics,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}

// Get orders -- admin
export const getAnalyticsOrders = async (req, res, next) => {
    try {
        const ordersAnalytics = await generateLast12MonthsData(OrderModel);
        res.status(200).json({
            success: true,
            orders: ordersAnalytics,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}

// Get courses -- admin
export const getAnalyticsCourses = async (req, res, next) => {
    try {
        const coursesAnalytics = await generateLast12MonthsData(Course);

        console.log("Generated Courses Analytics Data:", coursesAnalytics);
        
        res.status(200).json({
            success: true,
            courses: coursesAnalytics,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}
