import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { SLogin } from "../services/auth.service.js";
import { PrismaClient } from "@prisma/client";
import type { IGlobalResponse } from "../interfaces/global.interface.js";

const prisma = new PrismaClient();

export const CLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, password } = req.body;
        const result = await SLogin(username, password);
        
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

// Fungsi untuk membuat user admin baru
export const CRegister = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { username, password, email, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAdmin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword,
                email,
                name,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        });

        const response: IGlobalResponse = {
            status: true,
            message: "User admin created successfully",
            data: newAdmin,
        };

        res.status(201).json(response);
    } catch (err: any) {
        if (err.code === 'P2002') {
            // Error jika username atau email sudah ada
            const response: IGlobalResponse = {
                status: false,
                message: "Username or email already exists.",
            };
            return res.status(409).json(response);
        }
        _next(err);
    }
};

// Fungsi untuk memperbarui user admin
export const CUpdateAdmin = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { id } = req.params;
        const { username, password, email, name } = req.body;

        const dataToUpdate: any = { username, email, name, updatedAt: new Date() };
        
        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedAdmin = await prisma.admin.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
        });

        const response: IGlobalResponse = {
            status: true,
            message: "User admin updated successfully",
            data: updatedAdmin,
        };

        res.status(200).json(response);
    } catch (err: any) {
        if (err.code === 'P2025') {
            // Error jika id tidak ditemukan
            const response: IGlobalResponse = {
                status: false,
                message: "User admin not found.",
            };
            return res.status(404).json(response);
        }
        _next(err);
    }
};

// Fungsi untuk menghapus user admin
export const CDeleteAdmin = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.admin.delete({
            where: { id: parseInt(id) },
        });

        const response: IGlobalResponse = {
            status: true,
            message: "User admin deleted successfully",
            data: null,
        };

        res.status(200).json(response);
    } catch (err: any) {
        if (err.code === 'P2025') {
            // Error jika id tidak ditemukan
            const response: IGlobalResponse = {
                status: false,
                message: "User admin not found.",
            };
            return res.status(404).json(response);
        }
        _next(err);
    }
};