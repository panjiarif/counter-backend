import { PrismaClient } from "@prisma/client";
import type { IGlobalResponse } from "../interfaces/global.interface.js";

const prisma = new PrismaClient();

export const SClaimQueue = async (): Promise<IGlobalResponse> => {
    try {
        const counter = await prisma.counter.findFirst({
            where: { isActive: true, deletedAt: null },
            orderBy: { createdAt: 'asc' }
        });

        if (!counter) {
            throw Error("No active counters available.");
        }

        let nextQueueNum = counter.currentQueue + 1;

        const queue = await prisma.queue.create({
            data: {
                number: nextQueueNum,
                status: 'claimed',
                counterId: counter.id,
            },
            include: {
                counter: true,
            }
        });

        await prisma.counter.update({
            where: { id: counter.id },
            data: { currentQueue: { increment: 1 } },
        });

        return {
            status: true,
            message: "Queue claimed successfully",
            data: queue,
        };

    } catch (error) {
        throw error;
    }
}

export const SNextQueue = async (counterId: number): Promise<IGlobalResponse> => {
    try {
        const counter = await prisma.counter.findUnique({
            where: { id: counterId, isActive: true, deletedAt: null }
        });

        if (!counter) {
            throw Error("Counter not found or inactive.");
        }

        const claimedQueue = await prisma.queue.findFirst({
            where: { counterId: counter.id, status: 'claimed' },
            orderBy: { createdAt: 'asc' },
        });

        if (!claimedQueue) {
            throw Error("No claimed queue found.");
        }

        await prisma.queue.update({
            where: { id: claimedQueue.id },
            data: { status: 'called' },
        })

        return {
            status: true,
            message: "Success get next queue number!",
        };
    } catch (error) {
        throw error;
    }
}