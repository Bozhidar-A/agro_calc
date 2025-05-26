import Link from "next/link";

export default function WikiPage() {
    return (
        <div>
            <h1>Wiki</h1>
            <p>Find all the information about everything we offer here.</p>
            <Link href="/wiki/sowing">Sowing</Link>
        </div>
    )
}
