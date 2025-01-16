import layoutModel from "../models/layout.model.js";
import ErrorHandler from "../utilis/ErrorHandler.js";
import cloudinary from "cloudinary";

// Create Layout
export const createLayout = async (req, res, next) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const { img, title, subTitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(img, {
                folder: "layout",
            });
            const banner = {
                banner: {
                    img: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                }
            };
            await layoutModel.create({ type, banner });
        } else if (type === "FAQ") {

            const { faq } = req.body;
            if (!Array.isArray(faq)) {
                return next(new ErrorHandler("FAQ must be an array of objects", 400));
            }
            await layoutModel.create({ type, faq });

        } else if (type === "Categories") {

            const { categories } = req.body;
            if (!Array.isArray(categories)) {
                return next(new ErrorHandler("Categories must be an array of objects", 400));
            }
            await layoutModel.create({ type, categories });

        } else {
            return next(new ErrorHandler("Invalid layout type", 400));
        }

        res.status(201).json({
            success: true,
            message: "Layout created successfully!",
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};








// Edit layout
export const editLayout = async (req, res, next) => {
  try {
    const { type } = req.body;

    if (type === "Banner") {
      const { image, title, subtitle } = req.body;
      
      let bannerData = await layoutModel.findOne({ type: "Banner" });

      if (!bannerData) {
        bannerData = new layoutModel({ type: "Banner", banner: {} });
      }

      let imageData = bannerData.banner.img || {};

      if (image && !image.startsWith("https")) {
        // Upload new image to Cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(image, {
          folder: "layout",
        });
        imageData = {
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        };
      }

      bannerData.banner = {
        img: imageData,
        title: title || '',
        subTitle: subtitle || '',
      };

      await bannerData.save();

      res.status(200).json({
        success: true,
        message: "Banner updated successfully",
      });
    } 
    else if (type === "FAQ") {
      const { faq } = req.body;
      const faqData = await layoutModel.findOne({ type: "FAQ" });

      const faqItems = faq.map((item) => ({
        question: item.question,
        answer: item.answer,
      }));

      if (faqData) {
        await layoutModel.findByIdAndUpdate(faqData._id, {
          type: "FAQ",
          faq: faqItems,
        });
      } else {
        await layoutModel.create({
          type: "FAQ",
          faq: faqItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "FAQ updated successfully",
      });
    } 
    else if (type === "Categories") {
      const { categories } = req.body;
      const categoriesData = await layoutModel.findOne({
        type: "Categories",
      });

      const categoriesItems = categories.map((item) => ({
        title: item.title,
      }));

      if (categoriesData) {
        await layoutModel.findByIdAndUpdate(categoriesData._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      } else {
        await layoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({
        success: true,
        message: "Categories updated successfully",
      });
    } 
    else {
      return next(new ErrorHandler("Invalid layout type", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};
  











// get layout by type
export const getLayoutByType = async (req, res, next) => {
    try {
        const { type } = req.body;
        if (!type) {
            return next(new ErrorHandler("Type parameter is required", 400));
        }
        const layout = await layoutModel.findOne({ type });

        if (!layout) {
            return next(new ErrorHandler(`Layout of type ${type} not found`, 404));
        }

        res.status(200).json({
            success: true,
            data: layout,
        });
    } catch (error) {
        console.error('Error details:', error);
        return next(new ErrorHandler(error.message, 500));
    }
};

