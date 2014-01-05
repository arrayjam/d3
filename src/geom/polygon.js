import "../core/subclass";
import "geom";

d3.geom.polygon = function(coordinates) {
  d3_subclass(coordinates, d3_geom_polygonPrototype);
  return coordinates;
};

var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];

d3_geom_polygonPrototype.area = function() {
  var i = -1,
      n = this.length,
      a,
      b = this[n - 1],
      area = 0;

  while (++i < n) {
    a = b;
    b = this[i];
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area * .5;
};

d3_geom_polygonPrototype.centroid = function(k) {
  var i = -1,
      n = this.length,
      x = 0,
      y = 0,
      a,
      b = this[n - 1],
      c;

  if (!arguments.length) k = -1 / (6 * this.area());

  while (++i < n) {
    a = b;
    b = this[i];
    c = a[0] * b[1] - b[0] * a[1];
    x += (a[0] + b[0]) * c;
    y += (a[1] + b[1]) * c;
  }

  return [x * k, y * k];
};

// The Sutherland-Hodgman clipping algorithm.
// Note: requires the clip polygon to be counterclockwise and convex.
d3_geom_polygonPrototype.clip = function(subject) {
  var input,
      closed = d3_geom_polygonClosed(subject),
      i = -1,
      n = this.length - d3_geom_polygonClosed(this),
      j,
      m,
      a = this[n - 1],
      b,
      c,
      d;

  while (++i < n) {
    input = subject.slice();
    subject.length = 0;
    b = this[i];
    c = input[(m = input.length - closed) - 1];
    j = -1;
    while (++j < m) {
      d = input[j];
      if (d3_geom_polygonInside(d, a, b)) {
        if (!d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        subject.push(d);
      } else if (d3_geom_polygonInside(c, a, b)) {
        subject.push(d3_geom_polygonIntersect(c, d, a, b));
      }
      c = d;
    }
    if (closed) subject.push(subject[0]);
    a = b;
  }

  return subject;
};

function d3_geom_polygonInside(p, a, b) {
  return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
}

// Intersect two infinite lines cd and ab.
function d3_geom_polygonIntersect(c, d, a, b) {
  var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3,
      y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
      ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
  return [x1 + ua * x21, y1 + ua * y21];
}

// Returns true if the polygon is closed.
function d3_geom_polygonClosed(coordinates) {
  var a = coordinates[0],
      b = coordinates[coordinates.length - 1];
  return !(a[0] - b[0] || a[1] - b[1]);
}

d3_geom_polygonPrototype.intersect = function(subject) {
  subject.forEach(function(Si) {
    this.forEach(function(Cj) {


    });
  });
}


function d3_geom_polygonLineSegmentsIntersect(p1, p2, q1, q2) {
  var r = subtractPoints(p2, p1);
  var s = subtractPoints(q2, q1);

  var uNumerator = crossProduct(subtractPoints(q1, p1), r);
  var denominator = crossProduct(r, s);

  if (uNumerator === 0 && denominator === 0) {
    // colinear, so do they overlap?
    return ((q1[0] - p1[0] < 0) !== (q1[0] - p2[0] < 0) !== (q2[0] - p1[0] < 0) !== (q2[0] - p2[0] < 0)) ||
      ((q1[1] - p1[1] < 0) !== (q1[1] - p2[1] < 0) !== (q2[1] - p1[1] < 0) !== (q2[1] - p2[1] < 0));
  }

  if (denominator === 0) {
    // lines are paralell
    return false;
  }

  var u = uNumerator / denominator;
  var t = crossProduct(subtractPoints(q1, p1), s) / denominator;

  if ((t >= 0) && (t <= 1) && (u >= 0) && (u <= 1))
    return [p1[0] + t * r[0], q1[1] + u * s[1]];

}

function crossProduct(point1, point2) {
  return point1[0] * point2[1] - point1[1] * point2[0];
}

function subtractPoints(point1, point2) {
  return [point1[0] - point2[0], point1[1] - point2[1]];
}

//intersect(P1,P2,Q1,Q2,alphaP,alphaQ)
  //WEC_P1 = <P1 - Q1 | (Q2 - Q1) >
  //WEC_P2 = <P2 - Q1 | (Q2 - Q1) >
  //if (WEC_P1*WEC_P2 <= 0)
    //WEC_Q1 = <Q1 - P1 | (P2 - P1) >
    //WEC_Q2 = <Q2 - P1 | (P2 - P1) >
    //if (WEC_Q1*WEC_Q2 <= 0)
      //alphaP = WEC_P1/(WEC_P1 - WEC_P2)
      //alphaQ = WEC_Q1/(WEC_Q1 - WEC_Q2)
      //return(true); exit
    //end if
  //end if
  //return(false)
//end intersect


//for each vertex Si of subject polygon do
  //for each vertex Cj of clip polygon do
    //if intersect(Si,Si+1,Cj,Cj+1,a,b)
      //I1 = CreateVertex(Si,Si+1,a)
      //I2 = CreateVertex(Cj,Cj+1,b)
      //link intersection points I1 and I2
      //sort I1 into subject polygon
      //sort I2 into clip polygon
    //end if
  //end for
//end for
