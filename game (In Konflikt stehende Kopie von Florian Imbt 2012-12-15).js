document.getElementById("myTitle").innerHTML="blub"
// canvas handles
var c=document.getElementById("cw");
var ctx=c.getContext("2d");

// global coordinates
var global_X;
var global_Y;
var xOff=7;					// canvas offsets, irgendwie elegant kalibrieren!
var yOff=105;
var xCenter=360;
var yCenter=250;
var radius=240;

/* Storage for all line segments, structure:
 *  3*i = x ccordinate
 * 	3*i + 1 = y coordinate
 * 	3*i + 2 = identifier 
 */ 
var myLines = new Array();
var myValidLines = new Array();
var lineLength = new Array();

/* Storage for the intersection points between the lines
 * 2*i	   = x coordinate
 * 2*i + 1 = y coordinate
 */
var intersectioner = new Array();
var numInter = 0;

///Temporary storage for intersection points at begin and end of current line
var startInter = new Array();;
var endInter = new Array();;

///Temporary storage for current line
var currentLine = new Array();
var indexCurrentLine = 0;
var currentIdent;

///Identifier for line segment
var identLine;

lineLength[0]=0;
var i=0;
var k=0;
var lineValid=true;
var tol=5;
var drawn=false;
var hitLine=false;

// debug auxiliary variables/functions
var hitLineAt=0;

// Handle keyboard controls
var keysDown = {};

addEventListener("mousedown", function (e) {
	keysDown[e.keyCode] = true;
	}, false);

addEventListener("mouseup", function (e) {
	delete keysDown[e.keyCode];
	}, false);


function drawingCircle()
{
	var c=document.getElementById("cw");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.arc(xCenter,yCenter,radius,0,2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
}

function draw(e){
	var x=e.clientX;
	var y=e.clientY;
	var cX=x-xOff;
	var cY=y-yOff;
	var rSqCur=(cX-xCenter)*(cX-xCenter)+(cY-yCenter)*(cY-yCenter);
	
	// check if line starts on circle
	if ((rSqCur<8000+radius*radius) && (rSqCur>radius*radius-8000))
	{
//		lineValid=true;
		startInter[0] = cX;
		startInter[1] = cY;
		i++;
		return;
	}
	else
	{
		if (i<=lineLength[k])
		{
			lineValid=false;
			return;
		}
	}
	
	for (l=0;l<myLines.length/3-10;l++)
	{
		// check if line starts on another line
		if (i<=lineLength[k])
		{
			if (cX<myLines[3*l]+tol && cX>myLines[3*l]-tol && cY<myLines[3*l+1]+tol && cY>myLines[3*l+1]-tol)
			{
				startInter[0] = cX;
				startInter[1] = cY;
				
				///Store temporary coordinates for line here
			}
			else
			{
				lineValid=false;
			}
			return;
		}
		
		if(i > lineLength[k] + 8 * tol)
		{
			// check if line crosses another line
			if (cX<myLines[3*l]+tol && cX>myLines[3*l]-tol && cY<myLines[3*l+1]+tol && cY>myLines[3*l+1]-tol)
			{
				//hitLine=true;
				hitLineAt=l;
				endInter[0] = cX;
				endInter[1] = cY;
				 ///Store temporary coordinates for line here
				 
				 ///Check if valid and finalize
				//so far just a dummy: pass begin and end of an actual line
				drawingLine();
				
				break;
			}
		}
	}
	///Store temporary line coordinates here
	currentLine[3 * indexCurrentLine ] = cX;
	currentLine[3 * indexCurrentLine + 1] = cY;
	currentLine[3 * indexCurrentLine + 2] = currentIdent;
	
}
	///////////////////
	// draw line if inside circle and no condition to cancel is triggered
/*	if ((0 in keysDown) && (rSqCur<=radius*radius) && lineValid)
	{
		ctx.fillStyle = '#000000';
		ctx.moveTo(cX,cY)
		ctx.lineTo(global_X-xOff,global_Y-yOff);
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
function drawingLine()
{
		// draw line if inside circle and no condition to cancel is triggered
	if ((0 in keysDown) && (rSqCur<=radius*radius) && lineValid)
	{
		ctx.fillStyle = '#000000';
		ctx.moveTo(cX,cY)
		ctx.lineTo(global_X-xOff,global_Y-yOff);
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
	}
}

function erase()
{
	ctx.clearRect(0,0,1000,1000);
	ctx.beginPath();
}
