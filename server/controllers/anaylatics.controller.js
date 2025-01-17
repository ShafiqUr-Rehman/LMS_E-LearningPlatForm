import ErrorHandler from "../utilis/ErrorHandler.js";
import User from "../models/user.model.js";
import { generateLast12MonthsData } from "../utilis/anaylatics.generator.js";
import Course from "../models/course.model.js";
import OrderModel from "../models/order.model.js";

// Get User Analytics -- Admins Only
export const getUserAnalytics = async (req, res, next) => {
    try {
        const users = await generateLast12MonthsData(User);
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Get Course Analytics -- Admins Only
export const getCourseAnalytics = async (req, res, next) => {
    try {
        const courses = await generateLast12MonthsData(Course); // Corrected `coures` to `courses`
        res.status(200).json({
            success: true,
            courses, // Corrected `coures` to `courses`
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// Get Orders Analytics -- Admins Only
export const getOrderAnalytics = async (req, res, next) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel);
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
