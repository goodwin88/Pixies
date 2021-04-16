"use strict";


// Import camera.js so scripts in events can use Camera.StartCamera().
import * as Camera from "./camera.js";


{
	const scriptsInEvents = {

		async Mechaniccamera_Event1_Act1(runtime, localVars)
		{
			Camera.StartCamera();	// see camera.js
		}

	};
	
	self.C3.ScriptsInEvents = scriptsInEvents;
}
