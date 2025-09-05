'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
import type { ConsentCookieProps, ConsentDialogProps } from '@/lib/interfaces';

export default function ConsentForm({ open, onOpenChange }: ConsentDialogProps) {
    const router = useRouter();

    const {
        preferences,
        location,
        setHasConsented,
        setPreferences,
        setLocation,
        updateConsentDate,
        GetClientConsent,
        SetClientConsent,
    } = useConsent();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setIsLoading(true);
        try {
            const c: ConsentCookieProps = GetClientConsent();
            setPreferences(Boolean(c.preferences));
            setLocation(Boolean(c.location));
            // keep dialog open until user saves
        } catch {
            toast.error('Failed to load privacy settings');
            // keep dialog open, don't flip hasConsented here
        } finally {
            setIsLoading(false);
        }
    }, [open]);

    const onDeclineOptional = () => {
        setPreferences(false);
        setLocation(false);
    };

    const onAcceptAll = () => {
        setPreferences(true);
        setLocation(true);
    };

    const onSave = () => {
        setIsSaving(true);
        try {
            // Save to localStorage
            SetClientConsent({
                necessary: true,
                preferences: preferences,
                location: location,
            });
            // Save to Redux
            setPreferences(preferences);
            setLocation(location);
            setHasConsented(true);
            updateConsentDate();
            toast.success('Saved privacy settings');
            onOpenChange?.(false);
            router.refresh();
        } catch {
            toast.error('Failed to save privacy settings');
            setHasConsented(true);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={() => { }} modal>
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
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">Loading privacy settings...</p>
                    </div>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSave();
                        }}
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
                                    checked={preferences}
                                    onCheckedChange={(v) => setPreferences(Boolean(v))}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">Save your language and color theme.</p>
                        </div>

                        {/* LOCATION */}
                        <div className="space-y-2 rounded-lg border p-4 text-left">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="loc" className="font-semibold">
                                    Location
                                </Label>
                                <Switch
                                    id="loc"
                                    checked={location}
                                    onCheckedChange={(v) => setLocation(Boolean(v))}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Include approximate location with requests (for security). Optional.
                            </p>
                        </div>

                        <Button type="submit" className="w-full text-white font-semibold" disabled={isSaving}>
                            {isSaving ? 'Saving…' : 'Save'}
                        </Button>

                        <div className="flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    onDeclineOptional();
                                    onSave();
                                }}
                                className="font-semibold"
                                disabled={isSaving}
                            >
                                Decline optional
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onAcceptAll();
                                    onSave();
                                }}
                                className="font-semibold"
                                disabled={isSaving}
                            >
                                Accept all
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
