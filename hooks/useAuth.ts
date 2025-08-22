import { AuthState } from "@/lib/interfaces";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function useAuth() {
    const authObj: AuthState = useSelector((state: RootState) => state.auth);

    const isAuthenticated = !!authObj?.isAuthenticated && !!authObj?.user;
    const user = isAuthenticated ? authObj.user : null;
    const userId = user?.id ?? "";
    const email = user?.email ?? "";

    return { isAuthenticated, user, userId, email, rawObj: authObj };
}