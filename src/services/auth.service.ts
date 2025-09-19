import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { IGlobalResponse } from "../interfaces/global.interface.js";
import type { ILoginResponse } from "../interfaces/auth.interface.js";

const prisma = new PrismaClient();

export const SLogin = async (
    usernameOrEmail: string,
    password: string
): Promise<IGlobalResponse<ILoginResponse>> => {
    const admin = await prisma.admin.findFirst({
        where: {
            OR: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ],
            isActive: true,
            deletedAt: null
        },
    });

    if (!admin) {
        throw Error("Invalid credentials!");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        throw Error("Invalid credentials!");
    }

    return {
        status: true,
        message: "Login successful",
        data: {
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                name: admin.name,
            },
        },
    };
};

// Fungsi untuk membuat user admin baru
export const SRegisterAdmin = async (
    username: string,
    password: string,
    email: string,
    name: string
): Promise<IGlobalResponse> => {
    const existingAdmin = await prisma.admin.findFirst({
        where: {
            username,
            deletedAt: null,
        },
    });

    if (existingAdmin) {
        throw Error("Username already exists.");
    }

    const existingEmail = await prisma.admin.findFirst({
        where: {
            email,
            deletedAt: null,
        },
    });

    if (existingEmail) {
        throw Error("Email already exists.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw Error("Invalid email format");
    }

    if (password.length < 8) {
        throw Error("Password must be at least 8 characters long");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
        data: {
            username,
            email,
            name,
            password: hashedPassword,
            isActive: true,
        },
    });

    return {
        status: true,
        message: "Admin user created successfully",
        data: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            name: admin.name,
            isActive: admin.isActive,
        },
    };
};

export const SUpdateAdmin = async (
    id: number,
    username?: string,
    password?: string,
    email?: string,
    name?: string,
    isActive?: boolean,
): Promise<IGlobalResponse> => {
    const admin = await prisma.admin.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!admin) {
        throw Error("Admin user not found.");
    }

    if (username && username !== admin.username) {
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                username,
                deletedAt: null,
                NOT: { id },
            },
        });

        if (existingAdmin) {
            throw Error("Username already exists.");
        }
    }

    if (email && email !== admin.email) {
        const existingEmail = await prisma.admin.findFirst({
            where: {
                email,
                deletedAt: null,
                NOT: { id },
            },
        });

        if (existingEmail) {
            throw Error("Email already exists.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw Error("Invalid email format.");
        }
    }

    if (password && password.length < 8) {
        throw Error("Password must be at least 8 characters long.");
    }

    const updateData: any = {
        updatedAt: new Date(),
    };

    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
        where: { id },
        data: updateData,
    });

    return {
        status: true,
        message: "Admin updated successfully",
        data: {
            id: updatedAdmin.id,
            username: updatedAdmin.username,
            email: updatedAdmin.email,
            name: updatedAdmin.name,
            isActive: updatedAdmin.isActive,
        },
    };
};

// Fungsi untuk menghapus user admin
export const SDeleteAdmin = async (id: number): Promise<IGlobalResponse> => {
    const admin = await prisma.admin.findFirst({
        where: {
            id,
            deletedAt: null,
        }
    });

    if (!admin) {
        throw Error("Admin user not found.");
    }

    await prisma.admin.update({
        where: { id },
        data: { 
            deletedAt: new Date(),
            isActive: false,
            updatedAt: new Date(),
        },
    });

    return {
        status: true,
        message: "Admin user deleted successfully.",
        data: null,
    };
}

// Fungsi untuk mendapatkan semua user admin
export const SGetAllAdmins = async (): Promise<IGlobalResponse> => {
    const admins = await prisma.admin.findMany({
        where: {
            deletedAt: null,
        },
        select: {
            id: true,
            username: true,
            email: true,
            name: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    return {
        status: true,
        message: "Get all admins successfully",
        data: admins,
    };
}