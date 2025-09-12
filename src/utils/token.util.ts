import jwt from "jsonwebtoken";

export const UGenerateToken = (payload: object): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });
};