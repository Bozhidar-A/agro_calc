'use client';

import { Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Login() {
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
        const { email, password } = values;
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then(res => res.json()).then(data => console.log(data)).catch(err => console.error(err));
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

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </div>
    )
}