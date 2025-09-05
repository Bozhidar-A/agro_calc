'use client';


import ConsentForm from "@/components/ConsentForm/ConsentForm";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
    const router = useRouter();
    return (
        <ConsentForm
            open={true}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    router.replace('/');
                }
            }}
        />
    );
}