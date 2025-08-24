'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';
import OAuthButtonsGrid from '@/components/OAuthButtonsGrid/OAuthButtonsGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTranslate } from '@/hooks/useTranslate';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { AuthFailure, AuthLogout, AuthStart, AuthSuccess } from '@/store/slices/authSlice';

const schema = z.object({
  email: z.string().email(SELECTABLE_STRINGS.INVALID_EMAIL),
  password: z
    .string()
    .min(6, SELECTABLE_STRINGS.PASSWORD_MIN)
    .regex(/[a-z]/, SELECTABLE_STRINGS.PASSWORD_HAS_LOWER)
    .regex(/[A-Z]/, SELECTABLE_STRINGS.PASSWORD_HAS_UPPER)
    .regex(/[0-9]/, SELECTABLE_STRINGS.PASSWORD_HAS_NUMBER)
    .regex(/[$-/:-?{-~!"^_`\[\]]/, SELECTABLE_STRINGS.PASSWORD_HAS_SYMBOL),
});

export default function Login() {
  const dispatch = useDispatch();
  const translator = useTranslate();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updateAuthState = searchParams.get('updateAuthState');
    switch (updateAuthState) {
      case 'refreshTokenExpired':
        toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_SESSION_EXPIRED));
        dispatch(AuthLogout());
        break;
      case 'resetPasswordWhileAuth':
        toast.info(translator(SELECTABLE_STRINGS.TOAST_INFO_RESET_PASSWORD_WHILE_AUTH));
        dispatch(AuthLogout());
        break;
      case 'forceLogout':
        toast.info(translator(SELECTABLE_STRINGS.TOAST_INFO_FORCE_LOGOUT));
        dispatch(AuthLogout());
        break;
      default:
        break;
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  async function HandleSubmit(data) {
    dispatch(AuthStart('credentials'));

    const backendWork = await APICaller(['auth', 'login'], '/api/auth/login', 'POST', data);

    if (!backendWork.success) {
      dispatch(AuthFailure(backendWork.message));
      toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR), {
        description: backendWork.message,
      });
      return;
    }

    dispatch(AuthSuccess({ user: backendWork.user, authType: 'credentials' }));
    // toast.success(translator(SELECTABLE_STRINGS.TOAST_LOGIN_SUCCESS));
    router.push('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h2 className="text-2xl font-bold text-center">{translator(SELECTABLE_STRINGS.LOGIN)}</h2>
        <form onSubmit={handleSubmit(HandleSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email" className="text-left font-semibold">
              {translator(SELECTABLE_STRINGS.EMAIL)}
            </Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-red-500 text-sm">{translator(errors.email.message)}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-left font-semibold">
              {translator(SELECTABLE_STRINGS.PASSWORD)}
            </Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-red-500 text-sm">{translator(errors.password.message)}</p>
            )}
          </div>

          <Button type="submit" className="w-full text-white font-semibold">
            {translator(SELECTABLE_STRINGS.SUBMIT)}
          </Button>

          <OAuthButtonsGrid />
        </form>

        <Separator className="border-[0.5px] border-black dark:border-white" />

        <div className="flex items-center justify-center space-x-2">
          <h2>{translator(SELECTABLE_STRINGS.NO_ACC_Q)}</h2>
          <Button asChild className="text-white font-semibold">
            <Link href="/auth/register" className="hover:underline">
              {translator(SELECTABLE_STRINGS.REGISTER)}
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Button asChild className="text-white font-semibold">
            <Link href="/auth/password/request" className="hover:underline">
              {translator(SELECTABLE_STRINGS.FORGOT_PASSWORD)}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
