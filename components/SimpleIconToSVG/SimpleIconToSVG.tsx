import { SimpleIcon } from "simple-icons";

export default function SimpleIconToSVG({ icon }: { icon: SimpleIcon }) {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-white text-foreground"
        >
            <title>{icon.title}</title>
            <path d={icon.path} />
        </svg>
    )
}