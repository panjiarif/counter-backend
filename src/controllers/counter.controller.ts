import type { NextFunction, Request, Response } from "express";
import { 
    SCreateCounter,
    SDeleteCounter,
    SGetAllCounters,
    SGetCounterById,
    SUpdateCounter
} from "../services/counter.service.js";

// controller untuk membuat counter baru
export const CCreateCounter = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name } = req.body;
        const response = await SCreateCounter(name);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

// controller untuk mendapatkan semua counter
export const CGetAllCounters = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const response = await SGetAllCounters();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

// controller untuk mendapatkan detail counter berdasarkan ID
export const CGetCounterById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const response = await SGetCounterById(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

// controller untuk memperbarui counter berdasarkan ID
export const CUpdateCounterById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { name } = req.body;
        const response = await SUpdateCounter(id, name);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

// controller untuk menghapus counter berdasarkan ID
export const CDeleteCounter = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const response = await SDeleteCounter(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

// controller untuk mengubah status counter
export const CUpdateCounterStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const response = await SUpdateCounter(id, status);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

