import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { 
    SDeleteAdmin,
    SGetAllAdmins,
    SLogin,
    SRegisterAdmin,
    SUpdateAdmin
} from "../services/auth.service.js";

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
export const CRegisterAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, password, email, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await SRegisterAdmin(username, hashedPassword, email, name);

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
export const CDeleteAdmin = async (
    req: Request,
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const result = await SDeleteAdmin(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
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