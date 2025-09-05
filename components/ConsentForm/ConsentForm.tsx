'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { useConsent } from '@/hooks/useConsent';
import type { ConsentProps, ConsentDialogProps } from '@/lib/interfaces';
import { useSelector } from 'react-redux';

export default function ConsentForm({ open, onOpenChange }: ConsentDialogProps) {
    const router = useRouter();
    const consentReduxObj = useSelector((state: any) => state.consent);

    const {
        setHasConsented,
        updateConsentDate,
        SetClientConsent,
    } = useConsent();

    useEffect(() => {
        if (!open) return;
    }, [open]);

    const ConsentSchema = z.object({
        necessary: z.literal(true),
        preferences: z.boolean(),
        location: z.boolean(),
    });

    const {
        handleSubmit,
        setValue,
        watch,
    } = useForm<z.infer<typeof ConsentSchema>>({
        resolver: zodResolver(ConsentSchema),
        mode: 'onChange',
        defaultValues: {
            necessary: true,
            preferences: false,
            location: false,
        },
    });

    const form = watch();

    function OnSave(data: z.infer<typeof ConsentSchema>) {
        try {
            SetClientConsent(data);
            setHasConsented(true);
            updateConsentDate();
            toast.success('Saved privacy settings');
            onOpenChange?.(false);
            router.refresh();
        } catch {
            toast.error('Failed to save privacy settings');
            setHasConsented(true);
        }
    }

    const OnDeclineOptional = () => {
        setValue('preferences', false);
        setValue('location', false);
        handleSubmit(OnSave)();
    };

    const OnAcceptAll = () => {
        setValue('preferences', true);
        setValue('location', true);
        handleSubmit(OnSave)();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal>
            <DialogContent
                className="sm:max-w-md space-y-6"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-center">Privacy & Cookies</DialogTitle>
                    <DialogDescription className="text-center">
                        Control how we use cookies and related data. Necessary cookies are always on.
                        {JSON.stringify(consentReduxObj)}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(OnSave)}
                    className="space-y-4"
                    noValidate
                >
                    {/* NECESSARY */}
                    <div className="space-y-2 rounded-lg border p-4 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="nec" className="font-semibold">
                                Necessary
                            </Label>
                            <Switch id="nec" checked disabled />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Required for login and core features. Cannot be disabled.
                        </p>
                    </div>

                    {/* PREFERENCES */}
                    <div className="space-y-2 rounded-lg border p-4 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="pref" className="font-semibold">
                                Preferences
                            </Label>
                            <Switch
                                id="pref"
                                checked={form.preferences}
                                onCheckedChange={(v) => setValue('preferences', Boolean(v))}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">Save your language and color theme. Optional.</p>
                    </div>

                    {/* LOCATION */}
                    <div className="space-y-2 rounded-lg border p-4 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="loc" className="font-semibold">
                                Location
                            </Label>
                            <Switch
                                id="loc"
                                checked={form.location}
                                onCheckedChange={(v) => setValue('location', Boolean(v))}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Include approximate location with requests (for security). Optional.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-white font-semibold"
                    >
                        Save
                    </Button>

                    <div className="flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={OnDeclineOptional}
                            className="font-semibold"
                        >
                            Decline optional
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={OnAcceptAll}
                            className="font-semibold"
                        >
                            Accept all
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
