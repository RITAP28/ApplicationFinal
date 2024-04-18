import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { instance } from "../server.js";
import Plan from "../models/planModel.js";
import sendEmail from "../utils/sendEmail.js";

export const createPlan = catchAsyncErrors(async (req, res, next) => {
    const razorPlan = await instance.plans.create({
        period: req.body.period,
        interval: req.body.interval,
        item: {
            name: req.body.name,
            amount: Number(req.body.amount) * 100,
            currency: "INR",
            description: req.body.description
        },
    });

    if (!razorPlan) {
        return next(new ErrorHandler("Failed to create plan", 500));
    }

    console.log(req.body)

    const plan = await Plan.create({
        name: req.body.name,
        amount: Number(req.body.amount),
        description: req.body.description,
        cards: Number(req.body.cards),
        planType: req.body.planType,
        period: req.body.period,
        interval: Number(req.body.interval),
        razorPlanId: razorPlan.id,
    });

    res.status(200).json({
        success: true,
        plan
    });
});

export const deletePlan = catchAsyncErrors( async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404));
    };

    await Plan.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: `Plan deleted`,
    });
});

export const getAllPlans = catchAsyncErrors( async (req, res, next) => {
    const plans = await Plan.find();
    const planCount = await Plan.countDocuments();

    res.status(200).json({
        success: true,
        count: planCount,
        plans
    });
});

export const getPlan = catchAsyncErrors( async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        return next(new ErrorHandler(`No Plan By Id ${req.params.id}`, 404))
    };

    res.status(200).json({
        success: true,
        plan
    });
});

export const getEmail = catchAsyncErrors( async (req, res) => {

    for (let i = 0; i < 10; i++) {
        sendEmail({
            email: req.body.email,
            subject: `Email ${req.body.email}`,
            message: `Part 2 of message ${req.body.email} ${i}`,
        });
    }

    res.status(200).json({
        success: true,
        message: `Email sent to ${req.body.email} successfully`,
    });
});