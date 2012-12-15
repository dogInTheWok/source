document.getElementById("myTitle").innerHTML="blub"

// canvas handles
var c=document.getElementById("cw");
var ctx=c.getContext("2d");

///Constants
var XOFF=7;					// canvas offsets, irgendwie elegant kalibrieren!
var YOFF=105;
var TOLERANCE=5;
var XCENTER=360;
var YCENTER=250;
var RADIUS=240;
var RADIUS_MARGIN = 8000;

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
var hitLineAt=0;

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
	var c=document.getElementById("cw");
	var ctx=c.getContext("2d");
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
	for (i=0;i<currentLine.length-1;i++)
	{
		drawLine(currentLine[3*i], currentLine[3*i+1], \
			currentLine[3*(i+1)], currentLine[3*(i+1)+1,'#FFFFFF']);
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
		myLines[3 * ind] = currentLine[3 * ind]; 
		myLines[3 * ind + 1] = currentLine[3 * ind + 1]; 
		myLines[3 * ind + 2] = identLine + ind; 
	}
	lineLength[counterLines] = currentIdent + 1;
	counterLines++;
	identLine += currentIdent;
	currentIdent = 0;
	
	/// - startInd, endInd
	intersectioner[2 * numInter] = startInter[0];
	intersectioner[2 * numInter + 1] = startInter[1];
	numInter++;
	intersectioner[2 * numInter] = endInter[0];
	intersectioner[2 * numInter + 1] = endInter[1];
	
}

function resetStorage()
{
	currentIdent = 0;
	lineValid=true;
}

function draw(e){
	var x=e.clientX;
	var y=e.clientY;
	var cX=x-XOFF;
	var cY=y-YOFF;
	var rSqCur=(cX-XCENTER)*(cX-XCENTER)+(cY-YCENTER)*(cY-YCENTER);
	
	if(!lineValid)
	{
		///Invalid line has been drawn --> reset temp storage
		eraseInvalid();
		resetStorage();
		
	}
	
	
	// check if line starts on circle
	if ((rSqCur<RADIUS_MARGIN+RADIUS*RADIUS) && (rSqCur>RADIUS*RADIUS-RADIUS_MARGIN))
	{
	//	lineValid=true;
		startInter[0] = cX;
		startInter[1] = cY;
		
		///Store temporary coordinates for line here too
		writeToTempStorage(cX, cY);
		//drawLine();
		return;
	}
	else
	{
		if (i<=lineLength[counterLines])
		{
			lineValid=false;
			return;
		}
	}
	
	for (l=0;l<myLines.length/3-10;l++)
	{
		// check if line starts on another line
		if (currentIdent<=lineLength[counterLines])
		{
			if (cX<myLines[3*l]+TOLERANCE && cX>myLines[3*l]-TOLERANCE && cY<myLines[3*l+1]+TOLERANCE && cY>myLines[3*l+1]-TOLERANCE)
			{
				startInter[0] = cX;
				startInter[1] = cY;
				
				///Store temporary coordinates for line here
				writeToTempStorage(cX, cY);
				drawLine(cX,cY,currentLine[3*(currentIdent - 1)], \ 
				currentLine[3*(currentIdent - 1) + 1],'#000000');
			}
			else
			{
				lineValid=false;
			}
			return;
		}
		
		if(currentIdent > lineLength[counterLines] + 8 * TOLERANCE)
		{
			// check if line crosses another line
			if (cX<myLines[3*l]+TOLERANCE && cX>myLines[3*l]-TOLERANCE && cY<myLines[3*l+1]+TOLERANCE && cY>myLines[3*l+1]-TOLERANCE)
			{
				//hitLine=true;
				hitLineAt=l;
				endInter[0] = cX;
				endInter[1] = cY;
				 ///Store temporary coordinates for line here
			  	writeToTempStorage(cX, cY);
				drawLine(cX,cY,currentLine[3*(currentIdent - 1)], \ 
				currentLine[3*(currentIdent - 1) + 1],'#000000');
				 ///Check if valid and finalize
				finalizeLine();
				
				break;
			}
		}
	}
	///Store temporary line coordinates here
	writeToTempStorage(cX, cY);
	drawLine(cX,cY,currentLine[3*(currentIdent - 1)], \ 
				currentLine[3*(currentIdent - 1) + 1],'#000000');
	
}
	///////////////////
	// draw line if inside circle and no condition to cancel is triggered
/*	if ((0 in keysDown) && (rSqCur<=RADIUS*RADIUS) && lineValid)
	{
		ctx.fillStyle = '#000000';
		ctx.moveTo(cX,cY)
		ctx.lineTo(global_X-XOFF,global_Y-YOFF);
		ctx.stroke();
		global_X=e.clientX;
		global_Y=e.clientY;
		myLines[3*i]=cX;
		myLines[3*i+1]=cY;
		myLines[3*i+2]=k;
		i++;
		drawn=true;
	}
	else
	{
		global_X=e.clientX;
		global_Y=e.clientY;
		lineLength[k]=i;
		if (lineValid && drawn)
		{
			document.getElementById("div").innerHTML="k: "+String(k)+"; LL[k]: "+lineLength[k]+", "+String(lineLength[k-1])+", "+myLines.length+"<br>Hitline: "+String(hitLine)+" @ "+String(hitLineAt)
			endInter[0] = cX;
			endInter[1] = cY;
			k++;
			
		}
		lineValid=false;
		drawn=false;
		delete keysDown[e.keyCode];
		intersectioner[numInter*2]=endInter[0];
	//	if (i>0)
	//	{
	//		for(j=0;j<line.length;j++)
	//		{
	//			if (j%5==0)
	//			{
	//				document.getElementById("div").innerHTML=document.getElementById("div").innerHTML+line[j]+"<br>"
	//				document.getElementById("div").innerHTML=i;	
	//			}
	//		}
	//		myLines[k]=line.length;
	//		myLines[k+1]=line;
	//		i=0;
	//		k=k+line.length;
	//		document.getElementById("div").innerHTML=""
	//	}
		
	}

}
*/

