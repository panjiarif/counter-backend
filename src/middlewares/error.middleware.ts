import type { Request, Response, NextFunction } from "express";
import type { IGlobalResponse } from "../interfaces/global.interface.js";

// Kelas kustom untuk menangani error HTTP
export class HttpException extends Error {
    status: number;
    data?: any;

    constructor(message: string, status: number, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

// Middleware penanganan error yang dikustomisasi
export const MErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    console.error("Error:", err);

    const isDevelopment = process.env.NODE_ENV === 'development';
    let statusCode: number = 500;
    let errorMessage: string = "An unknown error occurred";
    let errorDetail: any | null = null;
    let errorData: any | null = null;

    if (err instanceof HttpException) {
        // Jika error adalah instance dari HttpException, gunakan properti kustomnya
        statusCode = err.status;
        errorMessage = err.message;
        errorData = err.data;
        if (isDevelopment && err.stack) {
            errorDetail = err.stack;
        }
    } else if (err instanceof Error) {
        // Jika error adalah error bawaan, tangani sebagai error server
        statusCode = 500;
        errorMessage = "Internal Server Error";
        if (isDevelopment && err.stack) {
            errorDetail = err.stack;
        }
    }

    const response: IGlobalResponse = {
        status: false,
        message: errorMessage,
        data: errorData,
        error: {
            message: errorMessage,
            ...(isDevelopment && { detail: errorDetail }),
        },
    };

    res.status(statusCode).json(response);
};