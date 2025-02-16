'use client';

import { AuthFailure, AuthLogout, AuthStart, AuthSuccess } from "@/store/slices/authSLice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(6, "Password is too short")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
});

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const updateAuthState = searchParams.get('updateAuthState');
        if (updateAuthState === 'refreshTokenExpired') {
            dispatch(AuthLogout());
        }
    }, [searchParams]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    });

    function HandleSubmit(data) {
        dispatch(AuthStart("login"));
        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: data.email, password: data.password })
        }).then(async res => {
            const result = await res.json();
            if (!res.ok) {
                dispatch(AuthFailure(result.message));
                alert(result.message);
                return;
            }
            alert('User logged in');
            dispatch(AuthSuccess(result.user));
            router.push('/');
        }).catch(() => {
            dispatch(AuthFailure("Internal Server Error"));
            alert('Internal Server Error');
        });
    }

    return (
        <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6 p-8">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit(HandleSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" className="w-full">Submit</Button>
                </form>
            </div>
        </div>
    );
}
