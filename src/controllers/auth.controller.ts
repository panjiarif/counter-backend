import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { SCreateAdmin, SGetAllAdmins, SLogin, SUpdateAdmin } from "../services/auth.service.js";
import { PrismaClient } from "@prisma/client";
import type { IGlobalResponse } from "../interfaces/global.interface.js";

const prisma = new PrismaClient();

// Fungsi untuk login admin
export const CLoginAdmin = async (
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
export const CCreateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password, email, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await SCreateAdmin(username, hashedPassword, email, name);

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// Fungsi untuk memperbarui user admin
export const CUpdateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { username, password, email, name } = req.body;

    const result = await SUpdateAdmin(id, username, email, name, password);

    res.status(200).json(result);
  } catch (error) {
    next(error);
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

// Fungsi untuk mendapatkan semua user admin
export const CGetAllAdmins = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await SGetAllAdmins();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};