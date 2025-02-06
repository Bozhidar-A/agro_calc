'use client';

import Link from "next/link";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AuthLogout } from "@/store/slices/authSLice";

export default function Header() {
    const authObj = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);

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
        <header className="w-full py-4 shadow-md shadow-green-500/50 h-max-20vh">
            <div className="container mx-auto flex justify-between items-center px-6">
                <Link href="/"><h1 className="text-2xl font-bold text-green-500">Agro-Calc</h1></Link>

                <div className="flex items-center space-x-4">
                    <ThemeSwitcher />

                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent>
                            {authObj.isAuthenticated ? <SheetTitle>Welcome, {authObj.user.email}</SheetTitle> : <SheetTitle>Menu</SheetTitle>}

                            <div className="flex flex-col space-y-6 mt-6">
                                {
                                    authObj.isAuthenticated ? (
                                        <Button asChild onClick={() => {
                                            handleLogout();
                                            setOpen(false);
                                        }}>
                                            <Link href="#" className="hover:underline">Logout</Link>
                                        </Button>
                                    ) : (
                                        <div className="flex flex-row space-x-4">
                                            <Link href="/auth/login" className="hover:underline" onClick={() => setOpen(false)}>login</Link>
                                            <Link href="/auth/register" className="hover:underline" onClick={() => setOpen(false)}>register</Link>
                                        </div>
                                    )
                                }
                                <Link href="/" className="hover:underline" onClick={() => setOpen(false)}>Home</Link>
                                <Link href="/idk" className="hover:underline" onClick={() => setOpen(false)}>NOT prot</Link>
                                <Link href="/prot" className="hover:underline" onClick={() => setOpen(false)}>prot</Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
