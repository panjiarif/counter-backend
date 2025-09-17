import type { NextFunction, Request, Response } from "express";
import { UVerifyToken } from "../utils/jwt.utils.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const MAuthValidate = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith("Bearer ")) {
            throw Error("Unauthorized");
        }

        const token = auth.split(" ")[1];

        const payload = await UVerifyToken(token);

        const admin = await prisma.admin.findUnique({
            where: { id: payload.id, isActive: true, deletedAt: null }
        })

        if (!admin) {
            throw Error("Unauthorized");
        }

        req.admin = payload;

        next();
    } catch (e) {
        next(e);
    }
}