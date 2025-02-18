export function register() {
    // On start up, run this function

    //check all ENVs are set
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not set");
        process.exit(1);
    }

    if (!process.env.NEXT_PUBLIC_HOST_URL) {
        console.error("NEXT_PUBLIC_HOST_URL not set");
        process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not set");
        process.exit(1);
    }

    if (!process.env.JWT_REFRESH_SECRET) {
        console.error("JWT_REFRESH_SECRET not set");
        process.exit(1);
    }

    if (!process.env.SALT_ROUNDS) {
        console.error("SALT_ROUNDS not set");
        process.exit(1);
    }

    if (!process.env.INTERNAL_API_REQUEST_SECRET) {
        console.error("INTERNAL_API_REQUEST_SECRET not set");
        process.exit(1);
    }
}