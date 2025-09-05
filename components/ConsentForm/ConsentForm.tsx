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
import type { ConsentDialogProps } from '@/lib/interfaces';
import { useTranslate } from '@/hooks/useTranslate';
import { SELECTABLE_STRINGS } from '@/lib/LangMap';

export default function ConsentForm({ open, onOpenChange }: ConsentDialogProps) {
    const translate = useTranslate();
    const router = useRouter();

    const {
        preferences,
        location,
        setPreferences,
        setLocation,
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
        reset,
    } = useForm<z.infer<typeof ConsentSchema>>({
        resolver: zodResolver(ConsentSchema),
        mode: 'onChange',
        defaultValues: {
            necessary: true,
            preferences: Boolean(preferences),
            location: Boolean(location),
        },
    });

    // Sync form state with consent values from useConsent when dialog opens
    useEffect(() => {
        if (open) {
            reset({
                necessary: true,
                preferences: Boolean(preferences),
                location: Boolean(location),
            });
        }
    }, [open, preferences, location, reset]);

    const form = watch();

    function OnSave(data: z.infer<typeof ConsentSchema>) {
        try {
            SetClientConsent(data);
            setPreferences(data.preferences);
            setLocation(data.location);
            updateConsentDate();
            toast.success(translate(SELECTABLE_STRINGS.TOAST_INFO_CONSENT_SAVED));
            onOpenChange(false);
            router.refresh();
        } catch {
            toast.error(translate(SELECTABLE_STRINGS.TOAST_ERROR_CONSENT_SAVED_FAIL));
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
        <Dialog open={open} onOpenChange={onOpenChange} modal >
            <DialogContent
                className="sm:max-w-md space-y-6"
            >
                <DialogHeader>
                    <DialogTitle className="text-center">{translate(SELECTABLE_STRINGS.GDPR_CONSENT_TITLE)}</DialogTitle>
                    <DialogDescription className="text-center">
                        {translate(SELECTABLE_STRINGS.GDPR_CONSENT_DESCRIPTION)}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(OnSave)}
                    className="space-y-4"
                    noValidate
                    data-testid="consent-form"
                >
                    {/* NECESSARY */}
                    <div className="space-y-2 rounded-lg border p-4 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="nec" className="font-semibold">
                                {translate(SELECTABLE_STRINGS.GDPR_CONSENT_NECESSARY)}
                            </Label>
                            <Switch id="nec" checked disabled />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {translate(SELECTABLE_STRINGS.GDPR_CONSENT_NECESSARY_DESCRIPTION)}
                        </p>
                    </div>

                    {/* PREFERENCES */}
                    <div className="space-y-2 rounded-lg border p-4 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="pref" className="font-semibold">
                                {translate(SELECTABLE_STRINGS.GDPR_CONSENT_PREFERENCES)}
                            </Label>
                            <Switch
                                id="pref"
                                checked={form.preferences}
                                onCheckedChange={(v) => setValue('preferences', Boolean(v))}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">{translate(SELECTABLE_STRINGS.GDPR_CONSENT_PREFERENCES_DESCRIPTION)}</p>
                    </div>

                    {/* LOCATION */}
                    <div className="space-y-2 rounded-lg border p-4 text-left">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="loc" className="font-semibold">
                                {translate(SELECTABLE_STRINGS.GDPR_CONSENT_LOCATION)}
                            </Label>
                            <Switch
                                id="loc"
                                checked={form.location}
                                onCheckedChange={(v) => setValue('location', Boolean(v))}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {translate(SELECTABLE_STRINGS.GDPR_CONSENT_LOCATION_DESCRIPTION)}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-white font-semibold"
                    >
                        {translate(SELECTABLE_STRINGS.GDPR_CONSENT_SAVE)}
                    </Button>

                    <div className="flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={OnDeclineOptional}
                            className="font-semibold"
                        >
                            {translate(SELECTABLE_STRINGS.GDPR_CONSENT_REJECT_OPTIONAL)}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={OnAcceptAll}
                            className="font-semibold"
                        >
                            {translate(SELECTABLE_STRINGS.GDPR_CONSENT_ACCEPT_ALL)}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
