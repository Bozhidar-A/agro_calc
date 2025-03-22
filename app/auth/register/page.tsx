'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { APICaller } from '@/lib/api-util';

const schema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password is too short')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
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

  async function HandleSubmit(data) {
    const backendWork = await APICaller(['auth', 'register'], '/api/auth/register', 'POST', data);

    if (!backendWork.success) {
      toast.error('There was an error', {
        description: backendWork.message,
      });
      return;
    }

    toast.success('Successful registered! Please log in.');
    router.push('/auth/login');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] text-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <h2 className="text-2xl font-bold text-center text-green-500">Register</h2>
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

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>

          <Separator className="border-[0.5px] border-black dark:border-white" />

          <div className="flex items-center justify-center space-x-2">
            <h2>Have an account?</h2>
            <Button asChild>
              <Link href="/auth/login" className="hover:underline">
                Login
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
