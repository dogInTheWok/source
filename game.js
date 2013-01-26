document.getElementById("myTitle").innerHTML="blub"

// canvas handles
var c=document.getElementById("cw");
var ctx=c.getContext("2d");

///Constants
var XOFF=7;					// canvas offsets, irgendwie elegant kalibrieren!
var YOFF=105;
var TOLERANCE=5;
var MIN_DISTANCE_TO_START = 40;
var XCENTER=360;
var YCENTER=250;
var RADIUS=240;
var RADIUS_MARGIN = 8000;http://www.notebooksbilliger.de/notebooks/lenovo+notebooks/lenovo+business/thinkpad+l+serie

// global coordinates
var lineValid=true;

/* Storage for all line segments, structure:
 *  3*i = x ccordinate
 * 	3*i + 1 = y coordinate
 * 	3*i + 2 = identifier 
 */ 
var myLines = new Array();

///Length of each actual line
var lineLength = new Array();
lineLength[0]=0;

/* Storage for the intersection points between the lines
 * 2*i	   = x coordinate
 * 2*i + 1 = y coordinate
 */
var intersectioner = new Array();
var numInter = 0;

///Counter for actual lines, i.e. number of lines, visible for the user 
var counterLines = 0;

///Temporary storage for intersection points at begin and end of current line
var startInter = new Array();
var endInter = new Array();

///Temporary storage for current line
var currentLine = new Array();
var currentIdent = 0;

///Identifier for line segment
var identLine = 0;

// debug auxiliary variables/functions
;

// Handle keyboard controls
var keysDown = {};

///Initializing event listeners
addEventListener("mousedown", function (e) {
	keysDown[e.keyCode] = true;
	}, false);

addEventListener("mouseup", function (e) {
	delete keysDown[e.keyCode];
	}, false);


function drawCircle()
{
	ctx.fillStyle = '#000000';
	ctx.beginPath();
	ctx.arc(XCENTER,YCENTER,RADIUS,0,2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
}

function drawLine(fromx, fromy, tox, toy, color)
{
		// draw line 
		
		ctx.fillStyle = color;
		ctx.moveTo(tox,toy);
		ctx.lineTo(fromx,fromy);
		ctx.stroke();

}

function eraseInvalid()
{
	var x;
	var y;
	var nextX;
	var nextY;
	var start=0;
	
	ctx.clearRect(0,0,1000,1000);
	ctx.beginPath();
	
	drawCircle();
	
	for (t=0;t<lineLength.length;t++)
	{
		for (i=start;i<start+lineLength[t]-1;i++)
		{
			nextX=myLines[3*(i+1)];
			nextY=myLines[3*(i+1) + 1];
			x=myLines[3*i];
			y=myLines[3*i+1];
			drawLine(x,y,nextX,nextY,'#000000');
		}
		start=start+lineLength[t];
	}
}

function writeToTempStorage(x, y)
{
	currentLine[3 * currentIdent] = x;
	currentLine[3 * currentIdent + 1] = y;
	currentLine[3 * currentIdent + 2] = currentIdent;

	currentIdent++;
}

function finalizeLine()
{
	///write temp to final storage here
	/// - line itself
	for(ind = 0; ind < currentIdent; ++ind)
	{
		myLines[(identLine + ind) * 3] = currentLine[3 * ind]; 
		myLines[(identLine + ind) * 3 + 1] = currentLine[3 * ind + 1]; 
		myLines[(identLine + ind) * 3 + 2] = identLine + ind; 
	}
	lineLength[counterLines] = currentIdent;
	counterLines++;
	identLine = identLine + currentIdent;
	
	/// - startInd, endInd
	intersectioner[2 * numInter] = startInter[0];
	intersectioner[2 * numInter + 1] = startInter[1];
	numInter++;
	intersectioner[2 * numInter] = endInter[0];
	intersectioner[2 * numInter + 1] = endInter[1];
	numInter++;
}

function resetStorage()
{	
	currentLine = new Array();
	currentIdent = 0;
	//document.getElementById("div").innerHTML="resetStorage " + currentLine[currentLine.length-4]
	lineValid=true;
}

function endLine()
{
	delete keysDown[0];
}

function checkMinDist(x, y, originX, originY, Dist)
{
	if((x-originX) * (x-originX) + (y -originY) * (y - originY) > Dist * Dist)
	{
		var checkMinDist = true;
	}
	else{
		var checkMinDist = false;
	}
	
	return checkMinDist;
}

function draw(e)
{
	if (!(0 in keysDown))
	{
		eraseInvalid();
		resetStorage();
		endLine();
		//document.getElementById("div").innerHTML="lineValid " + lineValid
		return;
	}
	
	//document.getElementById("div").innerHTML="Joined draw(e)"
	var x=e.clientX;
	var y=e.clientY;
	var cX=x-XOFF;
	var cY=y-YOFF;
	var prevX;
	var prevY;
	var rSqCur=(cX-XCENTER)*(cX-XCENTER)+(cY-YCENTER)*(cY-YCENTER);
	
	if(!lineValid)
	{
		//document.getElementById("div").innerHTML="lineValid == false"
		///Invalid line has been drawn --> reset temp storage
		eraseInvalid();
		resetStorage();
		return;
	}
	
	if (currentIdent<=lineLength[counterLines])
	{
		// check if line starts on circle
		if ((rSqCur<RADIUS_MARGIN+RADIUS*RADIUS) && (rSqCur>RADIUS*RADIUS-RADIUS_MARGIN))
		{
			//document.getElementById("div").innerHTML="Start on cirlce arc"
			startInter[0] = 4 * numInter; //cX;
			startInter[1] = 4 * numInter + 1; //cY;
			
			///Store temporary coordinates for line here too
			writeToTempStorage(cX, cY);
			//document.getElementById("div").innerHTML="RETURN 1"
			return;
		}
		else
		{
			lineValid=false;
			//document.getElementById("div").innerHTML="RETURN 2"
			return;
		}
	}
	else
	{
		if (rSqCur>RADIUS*RADIUS)
		{
			//if( checkMinDist(cX,cY,currentLine[0],currentLine[1],MIN_DISTANCE_TO_START))
			{
				endInter[0] = cX;
				endInter[1] = cY;
				
				writeToTempStorage(cX, cY);
				
				finalizeLine();
				endLine();
				resetStorage();
			}
			
		}
	}
	for (l = 0; l < Math.max(myLines.length, currentLine.length) / 3 - 10; l++)
	{
		//document.getElementById("div").innerHTML=""+myLines[150]+" "+myLines[151];
		document.getElementById("div1").innerHTML="" + identLine;
		document.getElementById("div2").innerHTML="" + currentIdent;
		// check if line starts on another line
		if (currentIdent<=lineLength[counterLines])
		{
			document.getElementById("div").innerHTML="start on another line"
			if (cX<myLines[3*l]+TOLERANCE && cX>myLines[3*l]-TOLERANCE && cY<myLines[3*l+1]+TOLERANCE && cY>myLines[3*l+1]-TOLERANCE)
			{
				startInter[0] = 4 * numInter + 2; //cX;
				startInter[1] = 4 * numInter + 3; //cY;
				
				//document.getElementById("div").innerHTML="Start on another line"
								
				///Store temporary coordinates for line here
				writeToTempStorage(cX, cY);
				
			}
			else
			{
				lineValid=false;
			}
			//document.getElementById("div").innerHTML="RETURN 3"
			return;
		}
		if (l<currentLine.length/3-10 && currentIdent>2 && (cX<currentLine[3*l]+TOLERANCE && cX>currentLine[3*l]-TOLERANCE && cY<currentLine[3*l+1]+TOLERANCE && cY>currentLine[3*l+1]-TOLERANCE))
		{
				endInter[0] = cX;
				endInter[1] = cY;
				
				 ///Store temporary coordinates for line here
			  	writeToTempStorage(cX, cY);

				 ///Check if valid and finalize
				eraseInvalid();
				resetStorage();
				endLine();
				document.getElementById("div").innerHTML="ich schie� mir selbst in den Fu�"
				return;
		}
		if(checkMinDist(cX,cY,currentLine[0],currentLine[1],MIN_DISTANCE_TO_START))
		{
			// check if line crosses another line
			if (cX<myLines[3*l]+TOLERANCE && cX>myLines[3*l]-TOLERANCE && cY<myLines[3*l+1]+TOLERANCE && cY>myLines[3*l+1]-TOLERANCE)
			{
				
				endInter[0] = cX;
				endInter[1] = cY;
				 ///Store temporary coordinates for line here
			  	writeToTempStorage(cX, cY);

				 ///Check if valid and finalize
				finalizeLine();
				resetStorage();
				endLine();
				return;
			}
		}
	}
	
	///Store temporary line coordinates here
	writeToTempStorage(cX, cY);
	prevX=currentLine[3*(currentIdent - 2)];
	prevY=currentLine[3*(currentIdent - 2) + 1];
	//document.getElementById("div").innerHTML="" + prevX + " " + prevY;
	if (currentIdent>1)
	{
		drawLine(cX,cY,prevX,prevY,'#000000');
	}
	
}

