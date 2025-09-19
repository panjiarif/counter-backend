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
};

// service untuk menndapatkan semua queue
export const SGetAllQueues = async (): Promise<IGlobalResponse> => {
    const queues = await prisma.queue.findMany({
        include: { counter: true },
        orderBy: { createdAt: 'asc' },
    });

    return {
        status: true,
        message: "Success get all queues!",
        data: queues,
    };
};

// service untuk mendapatkan queue berdasarkan ID
export const SGetQueueById = async (id: number): Promise<IGlobalResponse> => {
    const queue = await prisma.queue.findUnique({
        where: { id },
        include: { counter: true },
    });

    if (!queue) {
        throw Error("Queue not found.");
    }

    return {
        status: true,
        message: "Success get queue by ID!",
        data: queue,
    };
};

// service untuk update status queue
export const SUpdateQueueStatus = async (id: number, status: string): Promise<IGlobalResponse> => {
    const validStatuses = ['claimed', 'called', 'completed', 'skipped'];
    if (!validStatuses.includes(status)) {
        throw Error("Invalid status value.");
    }

    const queue = await prisma.queue.findUnique({
        where: { id },
    });

    if (!queue) {
        throw Error("Queue not found.");
    }

    const updatedQueue = await prisma.queue.update({
        where: { id },
        data: { status },
        include: { counter: true },
    });

    return {
        status: true,
        message: "Queue status updated successfully",
        data: updatedQueue,
    };
};

// service untuk menghapus queue
export const SDeleteQueue = async (id: number): Promise<IGlobalResponse> => {
    const queue = await prisma.queue.findUnique({
        where: { id },
    });

    if (!queue) {
        throw Error("Queue not found.");
    }

    await prisma.queue.delete({
        where: { id },
    });

    return {
        status: true,
        message: "Queue deleted successfully.",
    };
};