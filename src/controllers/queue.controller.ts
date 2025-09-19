import type { Request, Response, NextFunction } from "express";
import { 
    SClaimQueue,
    SDeleteQueue,
    SGetAllQueues,
    SGetQueueById,
    SNextQueue, 
    SUpdateQueueStatus} from "../services/queue.service.js";

export const CClaimQueue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await SClaimQueue();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const CNextQueue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await SNextQueue(Number(req.params.counterId));

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// controller untuk mendapatkan semua counter
export const CGetAllQueues = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await SGetAllQueues();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// controller untuk mendapatkan detail counter berdasarkan ID
export const CGetQueueById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await SGetQueueById(Number(req.params.id));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// controller untuk memperbarui status queue berdasarkan ID
export const CUpdateQueueStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await SUpdateQueueStatus(Number(req.params.id), req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// controller untuk menghapus counter berdasarkan ID
export const CDeleteQueue = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await SDeleteQueue(Number(req.params.id));
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};