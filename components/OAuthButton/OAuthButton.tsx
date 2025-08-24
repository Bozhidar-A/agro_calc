import SimpleIconToSVG from '@/components/SimpleIconToSVG/SimpleIconToSVG';
import { Button } from '@/components/ui/button';
import { SupportedOAuthProvider } from '@/lib/interfaces';

export function OAuthButton({ buttonData }: { buttonData: SupportedOAuthProvider }) {
  let url = buttonData.authURL;

  if (
    buttonData.currLoc &&
    typeof buttonData.currLoc.lat === 'number' &&
    typeof buttonData.currLoc.lon === 'number'
  ) {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('lat', buttonData.currLoc.lat.toString());
    urlObj.searchParams.set('lon', buttonData.currLoc.lon.toString());
    url = urlObj.toString();
  }

  return (
    <Button asChild className="dark:text-white font-bold">
      <a href={url}>
        <SimpleIconToSVG icon={buttonData.icon} />
      </a>
    </Button>
  );
}
