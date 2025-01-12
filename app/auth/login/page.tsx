'use client';

import { AuthFailure, AuthLogout, AuthStart, AuthSuccess } from "@/store/slices/authSLice";
import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const updateAuthState = searchParams.get('updateAuthState');
        //This seems VERY stupid, but I know on failed auth due to expired refresh token
        //a redirect to here will happen
        //this SHOULD be a safe way to handle local state update
        //when it can't be done from the server
        if (updateAuthState === 'refreshTokenExpired') {
            dispatch(AuthLogout());
            // Perform additional actions (e.g., show a toast or log out user)
        }

    }, [searchParams]);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => PasswordCheck(value),
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
        dispatch(AuthStart("login"));

        const { email, password } = values;
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) {
                dispatch(AuthFailure(data.message));
                alert(data.message);
                return;
            }
            alert('User logged in');
            dispatch(AuthSuccess(data.user));
            router.push('/');
        }).catch(err => {
            dispatch(AuthFailure("Internal Server Error"));
            alert('Internal Server Error');
            console.log(err);
        });
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={(values) => HandleSubmit(values)}>
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

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </div>
    )
}