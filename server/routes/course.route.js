import express from "express"
import {
    uploadCourse,editCourse,getSingleCourse, getAllCourse,getCourseByUser,addQuestions,
    AddAnswer, addReview, addReplyToReview,getAllCourses , deleteCourse,videoUrlGenerator
} from "../controllers/course.controller.js"
import { authorizeRoles, isAuthenticated, } from "../middleWare/auth.js";
import { updateAccessToken } from "../controllers/user.controller.js";


const courseRouter = express.Router();
courseRouter.post("/create-course", updateAccessToken,isAuthenticated, authorizeRoles("admin"), uploadCourse);
courseRouter.put("/edit-course/:id", updateAccessToken , isAuthenticated, authorizeRoles("admin"), editCourse);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);
courseRouter.get("/get-course-content/:id",updateAccessToken ,isAuthenticated ,getCourseByUser);
courseRouter.put("/add-question",updateAccessToken ,isAuthenticated ,addQuestions);
courseRouter.put("/add-answer", updateAccessToken ,isAuthenticated ,AddAnswer);
courseRouter.put("/add-review/:id", updateAccessToken , isAuthenticated ,addReview);
courseRouter.put("/add-reply",updateAccessToken ,isAuthenticated , authorizeRoles("admin"), addReplyToReview);
courseRouter.get("/get-all-courses", updateAccessToken ,isAuthenticated , authorizeRoles("admin"), getAllCourses);
courseRouter.post("/getVdoCipherOTP", videoUrlGenerator);
courseRouter.delete("/delete-course/:id", updateAccessToken, isAuthenticated , authorizeRoles("admin"), deleteCourse);


export default courseRouter