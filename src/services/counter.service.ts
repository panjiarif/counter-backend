import { PrismaClient } from "@prisma/client";
import type { IGlobalResponse } from "../interfaces/global.interface.js";

const prisma = new PrismaClient();

// service untuk membuat counter baru
export const SCreateCounter = async (name: string): Promise<IGlobalResponse> => {
    const existingCounter = await prisma.counter.findFirst({
        where: { name, deletedAt: null },
    });

    if (existingCounter) {
        throw Error("Counter with this name already exists.");
    }

    const counter = await prisma.counter.create({
        data: { name },
    });

    return {
        status: true,
        message: "Counter created successfully",
        data: counter,
    };
};

// service untuk mendapatkan semua counter
export const SGetAllCounters = async (): Promise<IGlobalResponse> => {
    const counters = await prisma.counter.findMany({
        where: { deletedAt: null },
    });

    if (counters.length === 0) {
        throw Error("No counters found.");
    }

    return {
        status: true,
        message: "Counters retrieved successfully",
        data: counters,
    };
};

// service untuk mengambil detail counter berdasarkan ID
export const SGetCounterById = async (id: number): Promise<IGlobalResponse> => {
    const counter = await prisma.counter.findFirst({
        where: { id, deletedAt: null },
    });

    if (!counter) {
        throw Error("Counter not found.");
    }

    return {
        status: true,
        message: "Counter retrieved successfully",
        data: counter,
    };
};

// service untuk mengupdate counter
export const SUpdateCounter = async (id: number, name: string): Promise<IGlobalResponse> => {
    const counter = await prisma.counter.findFirst({
        where: { id, deletedAt: null },
    });

    if (!counter) {
        throw Error("Counter not found.");
    }

    const updatedCounter = await prisma.counter.update({
        where: { id },
        data: { name },
    });

    return {
        status: true,
        message: "Counter updated successfully",
        data: updatedCounter,
    };
};

// service untuk menghapus counter
export const SDeleteCounter = async (id: number): Promise<IGlobalResponse> => {
    const counter = await prisma.counter.findFirst({
        where: { id, deletedAt: null },
    });

    if (!counter) {
        throw Error("Counter not found.");
    }

    await prisma.counter.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    return {
        status: true,
        message: "Counter deleted successfully",
        data: counter,
    };
};

// service untuk mengaktifkan atau menonaktifkan counter
export const SUpdateStatusCounter = async (id: number, isActive: boolean): Promise<IGlobalResponse> => {
    const counter = await prisma.counter.findFirst({
        where: { id, deletedAt: null },
    });

    if (!counter) {
        throw Error("Counter not found.");
    }

    const updatedCounter = await prisma.counter.update({
        where: { id },
        data: { isActive },
    });

    return {
        status: true,
        message: "Counter status updated successfully",
        data: updatedCounter,
    };
};
