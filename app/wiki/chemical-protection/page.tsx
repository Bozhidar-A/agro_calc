'use client'

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function WikiChemicalProtectionPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Chemical Protection</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Start from here and go to the page of what you want to look up.</p>
                    <Link href="/wiki/chemical-protection/plant">Plants</Link>
                    <Link href="/wiki/chemical-protection/enemy">Enemies</Link>
                    <Link href="/wiki/chemical-protection/chemical">Chemicals</Link>
                    <Link href="/wiki/chemical-protection/active-ingredient">Active Ingredients</Link>
                </CardContent>
            </Card>
        </div>
    )
}