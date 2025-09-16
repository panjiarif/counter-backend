import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import type { IGlobalResponse } from '../interfaces/global.interface.js';

export const MValidate = (
    schema: Joi.ObjectSchema
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const validationError = error.details.map((detail) => {
                message: detail.message;
                field: detail.path.join('.');
            })[0];
            
            return next(validationError);
        }

        next();
    };
};

// Skema untuk membuat user admin
const adminSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
});

// Skema untuk memperbarui user admin
const updateAdminSchema = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().optional(),
    email: Joi.string().email().optional(),
    name: Joi.string().optional(),
    id: Joi.number().required(),
});

// Skema untuk menghapus user admin
const deleteAdminSchema = Joi.object({
    id: Joi.number().required(),
});

// Middleware validasi untuk membuat user admin
export const VRegister = (req: Request, res: Response, next: NextFunction) => {
    const { error } = adminSchema.validate(req.body);
    if (error) {
        const response: IGlobalResponse = {
            status: false,
            message: error.details[0].message,
        };
        return res.status(400).json(response);
    }
    next();
};

// Middleware validasi untuk memperbarui user admin
export const VUpdateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { error } = updateAdminSchema.validate({ ...req.body, id: Number(id) });
    if (error) {
        const response: IGlobalResponse = {
            status: false,
            message: error.details[0].message,
        };
        return res.status(400).json(response);
    }
    next();
};

// Middleware validasi untuk menghapus user admin
export const VDeleteAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { error } = deleteAdminSchema.validate({ id: Number(id) });
    if (error) {
        const response: IGlobalResponse = {
            status: false,
            message: error.details[0].message,
        };
        return res.status(400).json(response);
    }
    next();
};
