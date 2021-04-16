
import Globals from "./globals.js";

// This function runs when the button is clicked (see the event sheet)
export async function StartCamera()
{
	try {
		// Request camera input from the user. This might show a permission prompt.
		const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
		
		// If camera input approved, show it in the video element.
		const videoElem = Globals.videoElem;
		videoElem.srcObject = mediaStream;
		videoElem.play();
		
		// Start looking at the pixels in the video. This repeatedly
		// calling itself every frame using requestAnimationFrame.
		OnFrame();
	}
	catch (err)
	{
		// Handle an error - most likely the user declining the permission prompt.
		console.error(err);
		Globals.statusTextInstance.text = "Oops! Something went wrong";
	}
}

// Called every frame after receiving camera input
function OnFrame()
{
	// Read the pixels from the camera video
	GetCameraPixels();
	
	// Tell the browser to call this function again the next frame.
	// This means the function keeps being called every frame.
	requestAnimationFrame(OnFrame);
}

function GetCameraPixels()
{
	// Get the size of the video
	const videoElem = Globals.videoElem;
	const videoWidth = videoElem.videoWidth;
	const videoHeight = videoElem.videoHeight;
	
	// If the video size is not greater than 0, it's probably not fully loaded yet.
	// Ignore this call - it will keep trying every frame until it loads.
	if (videoWidth <= 0 || videoHeight <= 0)
		return;
	
	// Pixel data cannot be directly retrieved from a video, but it can be retrieved
	// from a canvas, which the video can be drawn to. So to get the video pixel data
	// use the following three steps:
	// 1) Size the canvas to match the size of the video
	const tempCanvas = Globals.tempCanvas;
	const tempCtx = Globals.tempCtx;
	tempCanvas.width = videoWidth;
	tempCanvas.height = videoHeight;
	
	// 2) Draw the video to the canvas
	tempCtx.drawImage(videoElem, 0, 0, videoWidth, videoHeight);
	
	// 3) Retrieve the canvas pixel data
	// const imageData1 = tempCtx.getImageData(0, 0, videoWidth*0.5, videoHeight*0.5);
	// const imageData2 = tempCtx.getImageData(videoWidth*0.5, 0, videoWidth, videoHeight*0.5);
	// const imageData3 = tempCtx.getImageData(0, videoHeight*0.5, videoWidth*0.5, videoHeight);
	const imageData1 = tempCtx.getImageData(0, 0, videoWidth, videoHeight*0.5);
	const imageData2 = tempCtx.getImageData(0, videoHeight*0.5, videoWidth, videoHeight);
	const imageData3 = tempCtx.getImageData(0, 0, videoWidth*0.5, videoHeight);
	const imageData4 = tempCtx.getImageData(videoWidth*0.5, 0, videoWidth, videoHeight);
	
	//COLOR1
	// Now calculate the average color from the retrieved pixel data.
	// Note this returns an array of [r, g, b] in a fractional 0-1 range.
	const average1Color = CalculateAverage1Color(imageData1);
	
	// Display the calculated average color in two ways:
	// 1) By setting the color of a sprite to visually show the color
	Globals.average1ColorSpriteInstance.colorRgb = average1Color;
	
	// 2) By displaying the RGB percentages in the Average1ColorText object
	Globals.average1ColorTextInstance.text = `R:${Math.round(average1Color[0] * 100)}\nG:${Math.round(average1Color[1] * 100)}\nB:${Math.round(average1Color[2] * 100)}`;

	// COLOR2
	// Now calculate the average color from the retrieved pixel data.
	// Note this returns an array of [r, g, b] in a fractional 0-1 range.
	const average2Color = CalculateAverage2Color(imageData2);
	
	// Display the calculated average color in two ways:
	// 1) By setting the color of a sprite to visually show the color
	Globals.average2ColorSpriteInstance.colorRgb = average2Color;
	
	// 2) By displaying the RGB percentages in the Average2ColorText object
	Globals.average2ColorTextInstance.text = `R:${Math.round(average2Color[0] * 100)}\nG:${Math.round(average2Color[1] * 100)}\nB:${Math.round(average2Color[2] * 100)}`;

	// COLOR3
	// Now calculate the average color from the retrieved pixel data.
	// Note this returns an array of [r, g, b] in a fractional 0-1 range.
	const average3Color = CalculateAverage3Color(imageData3);
	
	// Display the calculated average color in two ways:
	// 1) By setting the color of a sprite to visually show the color
	Globals.average3ColorSpriteInstance.colorRgb = average3Color;
	
	// 2) By displaying the RGB percentages in the Average3ColorText object
	Globals.average3ColorTextInstance.text = `R:${Math.round(average3Color[0] * 100)}\nG:${Math.round(average3Color[1] * 100)}\nB:${Math.round(average3Color[2] * 100)}`;

	// COLOR4
	// Now calculate the average color from the retrieved pixel data.
	// Note this returns an array of [r, g, b] in a fractional 0-1 range.
	const average4Color = CalculateAverage4Color(imageData4);
	
	// Display the calculated average color in two ways:
	// 1) By setting the color of a sprite to visually show the color
	Globals.average4ColorSpriteInstance.colorRgb = average4Color;
	
	// 2) By displaying the RGB percentages in the Average4ColorText object
	Globals.average4ColorTextInstance.text = `R:${Math.round(average4Color[0] * 100)}\nG:${Math.round(average4Color[1] * 100)}\nB:${Math.round(average4Color[2] * 100)}`;
}


// Calculate the average color from image data retrieved from the canvas
function CalculateAverage1Color(imageData1)
{
	// An ImageData object has a width, height, and data property with the byte data.
	// We are only interested in the byte data.
	const data = imageData1.data;
	
	let totalR = 0;		// sum of red components
	let totalG = 0;		// sum of green components
	let totalB = 0;		// sum of blue components
	let count = 0;		// number of pixels summed
	
	// Taking in to account every single pixel could be slow, and we probably don't
	// need that much precision anyway. To make it faster while still being accurate
	// enough, only sample every 16th pixel.
	const samplePixelInterval = 16;
	
	// The pixel data is represented as an unsigned byte array. An unsigned byte can
	// have a value from 0-255. Each pixel is comprised of four bytes, representing the
	// red, green, blue and alpha (transparency) value of the pixel, in a repeating sequence like so:
	// [r0, g0, b0, a0, r1, g1, b1, a1, r2, g2, b2, a2, ...]
	// Note this means every pixel is 4 bytes apart. The alpha is ignored since we
	// only want the color. This loop iterates every Nth pixel according to samplePixelInterval.
	for (let index = 0; index < data.length - 4; index += samplePixelInterval * 4)
	{
		totalR += data[index];		// add R component of this pixel
		totalG += data[index+1];	// add G component of this pixel
		totalB += data[index+2];	// add B component of this pixel
		count++;					// add to number of pixels summed
	}
	
	// Calculate the average RGB components by dividing the sum by the count.
	const averageR = totalR / count * 1.2;
	const averageG = totalG / count * 1.2;
	const averageB = totalB / count * 1.2;
	
	// Bytes return values in the range 0-255, and the average is in the same range.
	// However Construct object's color values use a fractional 0-1 range.
	// Return the average color as an array of [r, g, b] in the 0-1 range.
	return [averageR / 255, averageG / 255, averageB / 255];
}

// Calculate the average color from image data retrieved from the canvas
function CalculateAverage2Color(imageData2)
{
	// An ImageData object has a width, height, and data property with the byte data.
	// We are only interested in the byte data.
	const data = imageData2.data;
	
	let totalR = 0;		// sum of red components
	let totalG = 0;		// sum of green components
	let totalB = 0;		// sum of blue components
	let count = 0;		// number of pixels summed
	
	// Taking in to account every single pixel could be slow, and we probably don't
	// need that much precision anyway. To make it faster while still being accurate
	// enough, only sample every 16th pixel.
	const samplePixelInterval = 16;
	
	// The pixel data is represented as an unsigned byte array. An unsigned byte can
	// have a value from 0-255. Each pixel is comprised of four bytes, representing the
	// red, green, blue and alpha (transparency) value of the pixel, in a repeating sequence like so:
	// [r0, g0, b0, a0, r1, g1, b1, a1, r2, g2, b2, a2, ...]
	// Note this means every pixel is 4 bytes apart. The alpha is ignored since we
	// only want the color. This loop iterates every Nth pixel according to samplePixelInterval.
	for (let index = 0; index < data.length - 4; index += samplePixelInterval * 4)
	{
		totalR += data[index];		// add R component of this pixel
		totalG += data[index+1];	// add G component of this pixel
		totalB += data[index+2];	// add B component of this pixel
		count++;					// add to number of pixels summed
	}
	
	// Calculate the average RGB components by dividing the sum by the count.
	const averageR = totalR / count * 1.1;
	const averageG = totalG / count * 1.1;
	const averageB = totalB / count * 1.1;
	
	// Bytes return values in the range 0-255, and the average is in the same range.
	// However Construct object's color values use a fractional 0-1 range.
	// Return the average color as an array of [r, g, b] in the 0-1 range.
	return [averageR / 255, averageG / 255, averageB / 255];
}

// Calculate the average color from image data retrieved from the canvas
function CalculateAverage3Color(imageData3)
{
	// An ImageData object has a width, height, and data property with the byte data.
	// We are only interested in the byte data.
	const data = imageData3.data;
	
	let totalR = 0;		// sum of red components
	let totalG = 0;		// sum of green components
	let totalB = 0;		// sum of blue components
	let count = 0;		// number of pixels summed
	
	// Taking in to account every single pixel could be slow, and we probably don't
	// need that much precision anyway. To make it faster while still being accurate
	// enough, only sample every 16th pixel.
	const samplePixelInterval = 16;
	
	// The pixel data is represented as an unsigned byte array. An unsigned byte can
	// have a value from 0-255. Each pixel is comprised of four bytes, representing the
	// red, green, blue and alpha (transparency) value of the pixel, in a repeating sequence like so:
	// [r0, g0, b0, a0, r1, g1, b1, a1, r2, g2, b2, a2, ...]
	// Note this means every pixel is 4 bytes apart. The alpha is ignored since we
	// only want the color. This loop iterates every Nth pixel according to samplePixelInterval.
	for (let index = 0; index < data.length - 4; index += samplePixelInterval * 4)
	{
		totalR += data[index];		// add R component of this pixel
		totalG += data[index+1];	// add G component of this pixel
		totalB += data[index+2];	// add B component of this pixel
		count++;					// add to number of pixels summed
	}
	
	// Calculate the average RGB components by dividing the sum by the count.
	const averageR = totalR / count;
	const averageG = totalG / count;
	const averageB = totalB / count;
	
	// Bytes return values in the range 0-255, and the average is in the same range.
	// However Construct object's color values use a fractional 0-1 range.
	// Return the average color as an array of [r, g, b] in the 0-1 range.
	return [averageR / 255, averageG / 255, averageB / 255];
}

// Calculate the average color from image data retrieved from the canvas
function CalculateAverage4Color(imageData4)
{
	// An ImageData object has a width, height, and data property with the byte data.
	// We are only interested in the byte data.
	const data = imageData4.data;
	
	let totalR = 0;		// sum of red components
	let totalG = 0;		// sum of green components
	let totalB = 0;		// sum of blue components
	let count = 0;		// number of pixels summed
	
	// Taking in to account every single pixel could be slow, and we probably don't
	// need that much precision anyway. To make it faster while still being accurate
	// enough, only sample every 16th pixel.
	const samplePixelInterval = 16;
	
	// The pixel data is represented as an unsigned byte array. An unsigned byte can
	// have a value from 0-255. Each pixel is comprised of four bytes, representing the
	// red, green, blue and alpha (transparency) value of the pixel, in a repeating sequence like so:
	// [r0, g0, b0, a0, r1, g1, b1, a1, r2, g2, b2, a2, ...]
	// Note this means every pixel is 4 bytes apart. The alpha is ignored since we
	// only want the color. This loop iterates every Nth pixel according to samplePixelInterval.
	for (let index = 0; index < data.length - 4; index += samplePixelInterval * 4)
	{
		totalR += data[index];		// add R component of this pixel
		totalG += data[index+1];	// add G component of this pixel
		totalB += data[index+2];	// add B component of this pixel
		count++;					// add to number of pixels summed
	}
	
	// Calculate the average RGB components by dividing the sum by the count.
	const averageR = totalR / count;
	const averageG = totalG / count;
	const averageB = totalB / count;
	
	// Bytes return values in the range 0-255, and the average is in the same range.
	// However Construct object's color values use a fractional 0-1 range.
	// Return the average color as an array of [r, g, b] in the 0-1 range.
	return [averageR / 255, averageG / 255, averageB / 255];
}
