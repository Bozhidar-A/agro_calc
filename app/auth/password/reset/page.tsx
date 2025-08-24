'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslate } from '@/hooks/useTranslate';
import { APICaller } from '@/lib/api-util';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

const schema = z
  .object({
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

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

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
    const backendWork = await APICaller(
      ['auth', 'passwordReset', 'reset'],
      '/api/auth/passwordReset/reset',
      'POST',
      {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }
    );

    if (backendWork.success) {
      toast.success(translator(SELECTABLE_STRINGS.TOAST_PASSWORD_RESET_SUCCESS));
      router.push('/auth/login?updateAuthState=resetPasswordWhileAuth');
      return;
    }

    toast.error(translator(SELECTABLE_STRINGS.TOAST_ERROR_PASSWORD_RESET_FAILED));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h2 className="text-2xl font-bold text-center text-green-500">
          {translator(SELECTABLE_STRINGS.REGISTER)}
        </h2>
        <form onSubmit={handleSubmit(HandleSubmit)} className="space-y-4" noValidate>
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

          <Button type="submit" className="w-full text-white font-bold">
            {translator(SELECTABLE_STRINGS.RESET_PASSWORD)}
          </Button>
        </form>
      </div>
    </div>
  );
}
