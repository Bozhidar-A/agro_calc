import { jwtVerify } from "jose";

export async function VerifyTokenServer(secret: string, token: string, type: string) {
    if (!token) {
        return [false, null];
    }

    // Verify refresh token
    console.log("VerifyTokenServer -> token", token)
    console.log("VerifyTokenServer -> secret", secret)
    const decoded = await jwtVerify(token, new TextEncoder().encode(secret));

    console.log("VerifyTokenServer -> decoded", decoded)


    console.log("VerifyTokenServer -> type", type)
    if (decoded?.payload?.type !== type) {
        console.log("Invalid token type")
        return [false, null];
    }

    // Check if refresh token exists in database
    // const storedToken = await prisma.refreshToken.findFirst({
    //     where: {
    //         // id: decoded.payload,
    //         token
    //     }
    // });

    // console.log("VerifyTokenServer -> storedToken", storedToken)
    // if (!storedToken) {
    //     return [false, null];
    // }

    return [true, decoded];
}