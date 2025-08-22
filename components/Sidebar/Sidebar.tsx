import { SELECTABLE_STRINGS } from '@/lib/LangMap';
import { Menu, Home, Calculator, Settings, LogOut, LogIn, UserPlus, User, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { useTranslate } from '@/hooks/useTranslate';
import { AuthLogout } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { APICaller } from '@/lib/api-util';
import { Log } from '@/lib/logger';
import Link from 'next/link';
import SettingsGrid from '../SettingsGrid/SettingsGrid';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const [open, setOpen] = useState(false);
    const translator = useTranslate();
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, user, email } = useAuth();

    async function HandleLogout() {
        const backendWork = await APICaller(['auth', 'logout'], '/api/auth/logout', 'GET');

        if (backendWork.success) {
            dispatch(AuthLogout());
            toast.success(translator(SELECTABLE_STRINGS.TOAST_LOGOUT_SUCCESS));
            router.push('/');
            return;
        }

        Log(['auth', 'logout'], backendWork.message);
    }


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild data-testid="open-sheet-button">
                <Button variant="ghost" size="icon" name="menu" className="hover:bg-accent">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu Icon</span>
                </Button>
            </SheetTrigger>

            <SheetContent data-testid="sheet-content" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="space-y-2.5 pb-4">
                    {isAuthenticated && user ? (
                        <SheetTitle className="text-xl font-semibold">
                            {email}
                        </SheetTitle>
                    ) : (
                        <SheetTitle className="text-xl font-semibold">{translator(SELECTABLE_STRINGS.MENU)}</SheetTitle>
                    )}
                </SheetHeader>

                <div className="flex flex-col space-y-4">
                    {isAuthenticated ? (
                        <div className="flex flex-col justify-center space-y-4 w-full">
                            <Button asChild variant="outline" className="w-full font-medium">
                                <Link href="/profile" onClick={() => setOpen(false)}>
                                    <User className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.PROFILE)}
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full font-medium"
                                onClick={() => {
                                    HandleLogout();
                                    setOpen(false);
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {translator(SELECTABLE_STRINGS.LOGOUT)}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-row justify-center space-x-4 w-full">
                            <Button asChild variant="outline" className="w-1/2 font-medium">
                                <Link href="/auth/login" onClick={() => setOpen(false)}>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.LOGIN)}
                                </Link>
                            </Button>
                            <Button asChild variant="default" className="w-1/2 font-medium">
                                <Link href="/auth/register" onClick={() => setOpen(false)}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.REGISTER)}
                                </Link>
                            </Button>
                        </div>
                    )}

                    <div className="space-y-1">
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            Navigation
                        </div>
                        <nav className="grid gap-1">
                            <Button asChild variant="ghost" className="justify-start font-normal">
                                <Link href="/" onClick={() => setOpen(false)}>
                                    <Home className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.HOME)}
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="justify-start font-normal">
                                <Link href="/calculators/sowing" onClick={() => setOpen(false)}>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.SOWING_RATE_CALC_TITLE)}
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="justify-start font-normal">
                                <Link href="/calculators/combined" onClick={() => setOpen(false)}>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.COMBINED_CALC_TITLE)}
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="justify-start font-normal">
                                <Link href="/calculators/chemical-protection/working-solution" onClick={() => setOpen(false)}>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.CHEM_PROT_WORKING_SOLUTION_CALC_TITLE)}
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="justify-start font-normal">
                                <Link href="/calculators/chemical-protection/percent-solution" onClick={() => setOpen(false)}>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.CHEMICAL_PROTECTION_PERCENT_SOLUTION_CALC_TITLE)}
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" className="justify-start font-normal">
                                <Link href="/wiki" onClick={() => setOpen(false)}>
                                    <Book className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.WIKI)}
                                </Link>
                            </Button>
                        </nav>
                    </div>

                    <div className="space-y-1">
                        <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            {translator(SELECTABLE_STRINGS.SETTINGS)}
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start font-normal" data-testid="settings-button">
                                    <Settings className="mr-2 h-4 w-4" />
                                    {translator(SELECTABLE_STRINGS.SETTINGS)}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold">{translator(SELECTABLE_STRINGS.SETTINGS)}</DialogTitle>
                                </DialogHeader>
                                <SettingsGrid />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}