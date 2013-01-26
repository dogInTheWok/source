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
var myLines = new Array();
var lineLength = new Array();
lineLength[0]=0;
var i=0;
var k=0;
var lineValid=false;
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
		lineValid=true;
	}
	else
	{
		if (i<=lineLength[k]){lineValid=false;}
	}
	
	for (l=0;l<myLines.length/2-10;l++)
	{
		if (cX<myLines[2*l]+tol && cX>myLines[2*l]-tol && cY<myLines[2*l+1]+tol && cY>myLines[2*l+1]-tol)
		{
			// check if line start on another line
			if (!lineValid && i==lineLength[k])
			{
				lineValid=true;
				break;
			}
		}
		// check if line crosses another line
		if (lineValid && cX<myLines[2*l]+tol && cX>myLines[2*l]-tol && cY<myLines[2*l+1]+tol && cY>myLines[2*l+1]-tol)
		{
			if (i>lineLength[k]+8*tol)
			{
				hitLine=true;
				hitLineAt=l;
				break;
			}
		}
	}
	
	// draw line if inside circle and no condition to cancel is triggered
	if ((0 in keysDown) && (rSqCur<=radius*radius) && lineValid && !hitLine)
	{
		ctx.fillStyle = '#000000';
		ctx.moveTo(cX,cY)
		ctx.lineTo(global_X-xOff,global_Y-yOff);
		ctx.stroke();
		global_X=e.clientX;
		global_Y=e.clientY;
		myLines[2*i]=cX;
		myLines[2*i+1]=cY
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
			k++;
		}
		lineValid=false;
		hitLine=false;
		drawn=false;
		delete keysDown[e.keyCode];
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

function erase()
{
	ctx.clearRect(0,0,1000,1000);
	ctx.beginPath();
}

//Point in Polygon algorithm ---> should work for us
function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}