'use client';

import { AuthLogout } from "@/store/slices/authSLice";
import { Button } from "@mantine/core";
import { useDispatch } from "react-redux";

export default function LogoutButton() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        fetch('/api/auth/logout').then(async res => {
            const data = await res.json();

            if (res.status === 401) {
                alert('Unauthorized');
            }
            console.log(data);
            dispatch(AuthLogout());
        }).catch((error) => {
            alert('Logout failed');
            console.log(error);
        });

    };

    return (
        <Button onClick={handleLogout}>Logout</Button>
    );
}