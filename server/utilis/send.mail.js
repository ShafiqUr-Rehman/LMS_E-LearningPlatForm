import ejs from "ejs";
import ErrorHandler from "./ErrorHandler.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';   // Gets the file path for ES module.
import { dirname, join } from 'path';  // Handles directory and file paths.

dotenv.config();
// These lines are used to manage file paths in ES Modules (since __dirname is not available by default).

const __filename = fileURLToPath(import.meta.url);   // Current file's path.
const __dirname = dirname(__filename);              // Directory of the current file.

const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || '587',   // 587 = default port
            service: process.env.SMTP_SERVICE,
            secure: process.env.SMTP_PORT === '465', // true for port 465, false for other ports
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const { email, subject, template, data, html: directHtml } = options;
        let html;

        if (template) {
            // Get the path to the email template file 
            const templatePath = join(__dirname, "..", "mails", template); 
            // Render the email template
            html = await ejs.renderFile(templatePath, data);
        } else if (directHtml) {
            html = directHtml;
        } else {
            throw new Error("Either template or html must be provided");
        }

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,   // simple template (.ejs file)
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error in sendMail:", error);
        throw new ErrorHandler(error.message, 500);
    }
};

export default sendMail;