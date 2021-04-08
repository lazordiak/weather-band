import { Bezier } from "./bezier"

const setup = (measures,p, canvasParentRef) => {


  console.log(measures);
  console.log(p,canvasParentRef);

  let xOff;
  let xTracker;
  let longX;
  let longY;

  let longArr = [];

  let topCurvePoints;
  let longBitPoints;
  let lastBitPoints;
  let topPartPoints;

  const CalculateMidpoint = (start,end) => {
      return start + (end-start)/2;
  }

  /*console.log("height: ",parentHeight);
  console.log("width: ",parentWidth);
  console.log(canvasParentRef);*/

  let canvas = p.createCanvas(measures.width, measures.height).parent(canvasParentRef);
      p.background(251,247,239);

      let width = p.width;
      let height = p.height;

      //LINE BETWEEN TWO SPHERES POINTS
      const topStartPoint = {x:(width/2),y:height/7};
      const topEndPoint = {x:(width-p.width/10),y:height/2};
      const topMidPoint = 
          {x:CalculateMidpoint(topStartPoint.x,topEndPoint.x),
          y:CalculateMidpoint(topStartPoint.y,topEndPoint.y)};

      //this is going to change the second point bc it's automatically calculating a t value 
      const curve = Bezier.quadraticFromPoints(
          topStartPoint,
          {x:topStartPoint.x+50,y:topStartPoint.y+40},
          topMidPoint
      );
      const curve2 = Bezier.quadraticFromPoints(
          topMidPoint,
          {x:topEndPoint.x-50,y:topEndPoint.y-40},
          topEndPoint
      );

      const p1LUT = curve.getLUT(10);
      const p2LUT = curve2.getLUT(10);
      const pTop = p1LUT.concat(p2LUT);
      //console.log(p1LUT);
      topCurvePoints = pTop;

      p.noFill();
      p.strokeWeight(0.5);
      p.stroke(0);
      p.beginShape();
      for(let i=0; i<pTop.length; i++) {
          p.curveVertex(pTop[i].x,pTop[i].y)
      }
      p.endShape();

      const topBitStart = pTop[p.ceil(pTop.length/2.5)];
      const topBitEnd = {x:topBitStart.x+width/20,y:topBitStart.y-height/15};

      const curveTop = Bezier.quadraticFromPoints(
          topBitStart,
          {x:CalculateMidpoint(topBitStart.x,topBitEnd.x)+15,
           y:CalculateMidpoint(topBitStart.y,topBitEnd.y)+5},
          topBitEnd
      );

      const curveTopLUT = curveTop.getLUT();
      topPartPoints = curveTopLUT;

      p.beginShape();
      p.curveVertex(topBitStart.x,topBitStart.y);
      for(let i=0; i<curveTopLUT.length; i++) {
          p.curveVertex(curveTopLUT[i].x,curveTopLUT[i].y)
      }
      p.endShape();

      const longBitStart = pTop[p.ceil(pTop.length-(pTop.length/3))];
      const longBitEnd = {x:width/2,y:height-(height/3)};

      xTracker = longBitStart.x;
      longX = longBitStart.x;
      longY = longBitStart.y;

      const longBit = Bezier.quadraticFromPoints(
          longBitStart,
          {x:CalculateMidpoint(longBitStart.x,longBitStart.y),
          y:CalculateMidpoint(longBitStart.x,longBitStart.y)},
          longBitEnd,
          100
      );

      const longBitLUT = longBit.getLUT();

      p.beginShape();
      p.curveVertex(longX,longY);
      longArr.push([longX,longY]);
      while(longX > longBitEnd.x) {
          p.curveVertex(longX,longY);
          longX -= 0.05;
          longY += 0.04;
          longArr.push([longX,longY]);
      }
      p.endShape();

      console.log(longArr);

      const lastBitStart = {x:longArr[p.ceil(longArr.length-(longArr.length/3))][0],y:longArr[p.ceil(longArr.length-(longArr.length/3))][1]};
      const lastBitEnd = {x:width/6,y:height/3};

      const lastCurve = Bezier.quadraticFromPoints(
          lastBitStart,
          {x:CalculateMidpoint(lastBitStart.x,lastBitEnd.x)-40,
          y:CalculateMidpoint(lastBitStart.y,lastBitEnd.y)+50},
          lastBitEnd,
          0.45
      );

      const lastCurveLUT = lastCurve.getLUT();
      lastBitPoints = lastCurveLUT;
      
      p.beginShape();
      p.curveVertex(lastBitStart.x,lastBitStart.y);
      for(let i=0; i<lastCurveLUT.length; i++) {
          p.curveVertex(lastCurveLUT[i].x,lastCurveLUT[i].y)
      }
      p.curveVertex(lastBitEnd.x,lastBitEnd.y);
      p.endShape();

      p.noStroke();
      p.fill(218,163,78);
      p.ellipse(topStartPoint.x,topStartPoint.y,20,20);
      p.ellipse(topEndPoint.x,topEndPoint.y,80,80);
      
      p.beginShape();
      p.curveVertex(topBitEnd.x,topBitEnd.y);
      p.curveVertex(topBitEnd.x,topBitEnd.y);
      p.curveVertex(topBitEnd.x-5,topBitEnd.y-20);
      p.curveVertex(topBitEnd.x-15,topBitEnd.y-20);
      p.curveVertex(topBitEnd.x-30,topBitEnd.y-10)
      p.curveVertex(topBitEnd.x-10,topBitEnd.y-5);
      p.curveVertex(topBitEnd.x-20,topBitEnd.y)
      p.endShape();
      
      p.beginShape();
      p.curveVertex(longX,longY);
      p.curveVertex(longX,longY);
      p.curveVertex(longX-width/60,longY+height/10);
      p.curveVertex(longX-width/30,longY+height/5);
      p.curveVertex(longX-width/12,longY+height/5);
      p.curveVertex(longX-width/6,longY+height/5);
      p.curveVertex(longX-width/12,longY+height/10);
      p.curveVertex(longX,longY);
      p.curveVertex(longX,longY);
      p.endShape();
      
      p.beginShape();
      p.curveVertex(lastBitEnd.x,lastBitEnd.y);
      p.curveVertex(lastBitEnd.x,lastBitEnd.y);
      p.curveVertex(lastBitEnd.x-10,lastBitEnd.y-30);
      p.curveVertex(lastBitEnd.x+10,lastBitEnd.y-150);
      p.curveVertex(lastBitEnd.x+100,lastBitEnd.y-150);
      p.curveVertex(lastBitEnd.x+40,lastBitEnd.y-30);
      p.curveVertex(lastBitEnd.x,lastBitEnd.y);
      p.curveVertex(lastBitEnd.x,lastBitEnd.y);
      p.endShape();
  };

const draw = (p) => {

}

export { setup, draw };