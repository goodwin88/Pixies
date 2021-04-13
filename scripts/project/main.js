
import Globals from "./globals.js";

runOnStartup(async runtime =>
{
	// On startup, insert the video element to the document, and
	// position it in the top-left of the page so it appears on-screen.
	const videoElem = Globals.videoElem;
	document.body.appendChild(videoElem);
	videoElem.style.position = "absolute";
	videoElem.style.left = "0px";
	videoElem.style.top = "0px";
	
	// Note only setting the width will proportionately resize the video
	// down to show a 256px sized thumbnail, rather than taking up the full
	// size of the video, which could take up the whole screen.
	videoElem.style.width = "256px";
	
	// Get Construct object instances in this event
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

function OnBeforeProjectStart(runtime)
{
	// Retrieve Construct object instances so they can be
	// updated from script conveniently
	Globals.statusTextInstance = runtime.objects.StatusText.getFirstInstance();
	Globals.average1ColorTextInstance = runtime.objects.Average1ColorText.getFirstInstance();
	Globals.average1ColorSpriteInstance = runtime.objects.Average1ColorSprite.getFirstInstance();
	Globals.average2ColorTextInstance = runtime.objects.Average2ColorText.getFirstInstance();
	Globals.average2ColorSpriteInstance = runtime.objects.Average2ColorSprite.getFirstInstance();
	Globals.average3ColorTextInstance = runtime.objects.Average3ColorText.getFirstInstance();
	Globals.average3ColorSpriteInstance = runtime.objects.Average3ColorSprite.getFirstInstance();
	Globals.average4ColorTextInstance = runtime.objects.Average4ColorText.getFirstInstance();
	Globals.average4ColorSpriteInstance = runtime.objects.Average4ColorSprite.getFirstInstance();
}
