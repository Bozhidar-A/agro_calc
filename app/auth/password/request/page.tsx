'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useTranslate } from '@/app/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Separator } from '@/components/ui/separator';

const schema = z.object({
    email: z.string().email(SELECTABLE_STRINGS.INVALID_EMAIL),
});

export default function RequestResetPassword() {
    const router = useRouter();
    const translator = useTranslate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        mode: 'onChange',
    });

    async function HandleSubmit(data) {
        const backendWork = await APICaller(['auth', 'passwordReset', 'request'], '/api/auth/passwordReset/request', 'POST', data);

        if (backendWork.success) {
            toast.success(translator(SELECTABLE_STRINGS.TOAST_PASSWORD_RESET_REQUEST_SENT));
            router.push('/');
            return;
        }

        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_PASSWORD_RESET_REQUEST_FAILED));
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
            <div className="w-full max-w-md space-y-6 p-8">
                <h2 className="text-2xl font-bold text-center">{translator(SELECTABLE_STRINGS.LOGIN)}</h2>
                <form onSubmit={handleSubmit(HandleSubmit)} className="space-y-4" noValidate>
                    <div>
                        <Label htmlFor="email">{translator(SELECTABLE_STRINGS.EMAIL)}</Label>
                        <Input id="email" type="email" {...register('email')} />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{translator(errors.email.message)}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full text-black dark:text-white font-bold">
                        {translator(SELECTABLE_STRINGS.REQUEST_PASSWORD_RESET)}
                    </Button>
                </form>

                <div className="flex flex-col gap-2 items-center justify-center space-x-2">
                    <h2>{translator(SELECTABLE_STRINGS.NO_ACC_Q)}</h2>
                    <Button asChild className="text-black dark:text-white font-bold">
                        <Link href="/auth/register" className="hover:underline">
                            {translator(SELECTABLE_STRINGS.REGISTER)}
                        </Link>
                    </Button>
                    <Separator className="border-[0.5px] border-black dark:border-white" />
                    <h2>{translator(SELECTABLE_STRINGS.HAVE_ACC_Q)}</h2>
                    <Button asChild className="text-black dark:text-white font-bold">
                        <Link href="/auth/login" className="hover:underline">
                            {translator(SELECTABLE_STRINGS.LOGIN)}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
