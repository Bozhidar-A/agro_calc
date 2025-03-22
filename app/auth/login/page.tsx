'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APICaller } from '@/lib/api-util';
import { AuthFailure, AuthLogout, AuthStart, AuthSuccess } from '@/store/slices/authSlice';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password is too short')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export default function Login() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const updateAuthState = searchParams.get('updateAuthState');
    if (updateAuthState === 'refreshTokenExpired') {
      toast.error('Your session has expired. Please login again.');
      dispatch(AuthLogout());
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
    dispatch(AuthStart('login'));

    const backendWork = await APICaller(['auth', 'login'], '/api/auth/login', 'POST', data);

    if (!backendWork.success) {
      dispatch(AuthFailure(backendWork.message));
      toast.error('There was an error', {
        description: backendWork.message,
      });
      return;
    }

    dispatch(AuthSuccess(backendWork.user));
    toast.success('Successful login!');
    router.push('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleSubmit(HandleSubmit)} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>

        <div className="flex items-center justify-center space-x-2">
          <h2>Don't have an account?</h2>
          <Button asChild>
            <Link href="/auth/login" className="hover:underline">
              Register
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
