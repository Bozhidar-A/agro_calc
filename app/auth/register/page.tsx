'use client';

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
import { Separator } from '@/components/ui/separator';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

const schema = z
  .object({
    email: z.string().email(SELECTABLE_STRINGS.INVALID_EMAIL),
    password: z
      .string()
      .min(6, SELECTABLE_STRINGS.PASSWORD_MIN)
      .regex(/[a-z]/, SELECTABLE_STRINGS.PASSWORD_HAS_LOWER)
      .regex(/[A-Z]/, SELECTABLE_STRINGS.PASSWORD_HAS_UPPER)
      .regex(/[0-9]/, SELECTABLE_STRINGS.PASSWORD_HAS_NUMBER)
      .regex(/[$-/:-?{-~!"^_`\[\]]/, SELECTABLE_STRINGS.PASSWORD_HAS_SYMBOL),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: SELECTABLE_STRINGS.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const router = useRouter();
  const translator = useTranslate();

  async function HandleSubmit(data) {
    const backendWork = await APICaller(['auth', 'register'], '/api/auth/register', 'POST', data);

    if (!backendWork.success) {
      toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
        description: backendWork.message,
      });
      return;
    }

    toast.success(translator(SELECTABLE_STRINGS.TOAST_REGISTER_SUCCESS));
    router.push('/auth/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h2 className="text-2xl font-bold text-center text-green-500">
          {translator(SELECTABLE_STRINGS.REGISTER)}
        </h2>
        <form onSubmit={handleSubmit(HandleSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email">{translator(SELECTABLE_STRINGS.EMAIL)}</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-red-500 text-sm">{translator(errors.email.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">{translator(SELECTABLE_STRINGS.PASSWORD)}</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-red-500 text-sm">{translator(errors.password.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{translator(errors.confirmPassword.message)}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-black dark:text-white font-bold">
            {translator(SELECTABLE_STRINGS.SUBMIT)}
          </Button>

          <Separator className="border-[0.5px] border-black dark:border-white" />

          <div className="flex items-center justify-center space-x-2">
            <h2>{translator(SELECTABLE_STRINGS.NO_ACC_Q)}</h2>
            <Button asChild className="text-black dark:text-white font-bold">
              <Link href="/auth/login" className="hover:underline">
                {translator(SELECTABLE_STRINGS.LOGIN)}
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button asChild className="text-black dark:text-white font-bold">
              <Link href="/auth/password/request" className="hover:underline">
                {translator(SELECTABLE_STRINGS.FORGOT_PASSWORD)}
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
