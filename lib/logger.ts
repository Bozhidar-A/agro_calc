export function Log(location: string[], message: string) {
    console.log(`[${location.join(" > ")}]: ${message}`);
}