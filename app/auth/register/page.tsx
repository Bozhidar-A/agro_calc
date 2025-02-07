'use client';

import { AuthFailure, AuthStart, AuthSuccess } from "@/store/slices/authSLice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(6, "Password is too short")
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function Register() {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    });

    function HandleSubmit(data) {
        dispatch(AuthStart("register"));
        fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: data.email, password: data.password })
        }).then(async res => {
            const result = await res.json();
            if (!res.ok) {
                dispatch(AuthFailure(result.message));
                return;
            }
            dispatch(AuthSuccess(result.user));
            alert('User created');
            router.push('/');
        }).catch(() => dispatch(AuthFailure("Internal Server Error")));
    }

    return (
        <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-6 p-8">
                <h2 className="text-2xl font-bold text-center text-green-500">Register</h2>
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

                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    <Button type="submit" className="w-full">Submit</Button>

                    <Separator className="border-[0.5px] border-black dark:border-white" />

                    <div className="flex items-center justify-center space-x-2">
                        <h2>Dont have an account?</h2>
                        <Button asChild>
                            <Link href="/auth/login" className="hover:underline">Login</Link>
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}