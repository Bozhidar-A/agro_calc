'use client';

import { AuthFailure, AuthStart, AuthSuccess } from "@/store/slices/authSLice";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function Register() {
    const dispatch = useDispatch();
    const router = useRouter()

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => PasswordCheck(value),
            confirmPassword: (value, values) => (value === values.password ? null : 'Passwords do not match'),
        },
    });

    function PasswordCheck(value: string) {
        if (value.length < 6) {
            return 'Password is too short';
        }

        if (!/[a-z]/.test(value)) {
            return 'Password must contain a lowercase letter';
        }

        if (!/[A-Z]/.test(value)) {
            return 'Password must contain an uppercase letter';
        }

        if (!/[0-9]/.test(value)) {
            return 'Password must contain a number';
        }

        return null;
    }

    function HandleSubmit(values) {
        dispatch(AuthStart("register"));

        const { email, password } = values;
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) {
                console.error(data);
                dispatch(AuthFailure(data.message));
                return;
            }

            dispatch(AuthSuccess(data.user));
            alert('User created');
            router.push('/');
        }).catch(err => {
            console.error(err);
            dispatch(AuthFailure("Internal Server Error"));
        });
    }

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={form.onSubmit((values) => HandleSubmit(values))}>
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />

                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="Your password"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />

                <PasswordInput
                    withAsterisk
                    label="Confirm Password"
                    placeholder="Repeat your password"
                    key={form.key('confirmPassword')}
                    {...form.getInputProps('confirmPassword')}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </div>
    )
}