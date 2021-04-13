
// Global variables: create a <video> element, and a 2D canvas context
// for getting pixel data from the video
const tempCanvas = document.createElement("canvas");

const Globals = {
	videoElem: document.createElement("video"),
	tempCanvas,
	tempCtx: tempCanvas.getContext("2d"),

	// Global variables referring to Construct object instances
	statusTextInstance: null,
	averageColor1TextInstance: null,
	averageColor1SpriteInstance: null,
	averageColor2TextInstance: null,
	averageColor2SpriteInstance: null,
	averageColor3TextInstance: null,
	averageColor3SpriteInstance: null,
	averageColor4TextInstance: null,
	averageColor4SpriteInstance: null
};

export default Globals;
