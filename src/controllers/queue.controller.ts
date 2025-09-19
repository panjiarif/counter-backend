import type { Request, Response, NextFunction } from "express";
import { SClaimQueue, SNextQueue } from "../services/queue.service.js";

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
}

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
}
