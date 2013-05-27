(function($) {
/*

jQuery-turtle
=============

version 2.0.4

jQuery-turtle is a jQuery plugin for turtle graphics.

With jQuery-turtle, every DOM element is a turtle that can be
moved using LOGO-inspired turtle methods like fd, bk, rt, and lt.
<pre>
  $('#turtle').pen('red').rt(90).fd(100).lt(90).bk(50).fadeOut();
</pre>
The plugin also provides functions to help in a rotated,
scaled, and transformed world where nested elements may be
transformed.  There are functions for collision testing, absolute
positioning, and absolute direction reading and setting.

[Try an interactive demo (CoffeeScript syntax) here.](
http://davidbau.github.io/jquery-turtle/demo.html)

Under the covers, CSS3 2D transforms and jQuery animations are
used to execute and store turtle movement, so jQuery-turtle
interacts well with other jQuery animations or direct uses of
2D CSS3 transforms.  The plugin sets up jQuery CSS hooks for
synthetic CSS properties such as turtleForward that can be
animated or used to directly manipulate turtle geometry at a basic
mathematical level.

A high-level educational environment is enabled by $.turtle().
That call creates a set of global objects and functions
catering to beginners.  These include a default turtle
and global functions to control it; an onpage debugger panel;
jQuery instances for every object with an #id; simplified
globals to access recent mouse and keyboard events, and
simplified functions for randomness, timers, animation control,
and creation of new turtles.  The jQuery teaching environment
has been developed to support a curriculum for young students.

JQuery Methods for Turtle Movement
----------------------------------

Turtle-oriented methods taking advantage of the css support:
<pre>
  $(x).fd(100)      // Forward relative motion in local coordinates.
  $(x).bk(50)       // Back.
  $(x).rt(90)       // Right turn.
  $(x).lt(45)       // Left turn.
  $(x).pen('red')   // Sets a pen style, or 'none' for no drawing.
  $(x).dot(12)      // Draws a dot of diameter 12.
  $(x).erase()      // Erases under the turtles collision hull.
  $(x).img('blue')  // Switch the image to a blue pointer.  May use any url.
  $(x).moveto({pageX: 40, pageY: 140})  // Absolute motion in page coordinates.
  $(x).turnto(heading || position)      // Absolute heading adjustment.
  $(x).scale(1.5)   // Scales the element up to 150% size.
  $(x).twist(180)   // Changes which direction is considered "forward".
  $(x).mirror(true) // Flips the turtle across its direction axis.
  $(x).reload()     // Reloads the turtle's image (restarting animated gifs)
  $(x).direct(fn)   // Like each, but this is set to $(elt) instead of elt.
  // Methods below this line do not queue for animation.
  $(x).center()     // Page coordinate position of transform-origin.
  $(x).direction()  // Absolute bearing taking into account nested transforms.
  $(x).shown()      // Shorthand for is(":visible")
  $(x).hidden()     // Shorthand for !is(":visible")
  $(x).touches(y)   // Collision tests elements (uses turtleHull if present).
  $(x).encloses(y)  // Containment collision test.
  $(x).within(d, t) // Filters to items with centers within d of t.center().
  $(x).notwithin()  // The negation of within.
</pre>

When $.fx.speeds.turtle is nonzero (the default is zero unless
$.turtle() is called), the first four movement functions animate
at that speed, and the remaining mutators also participate in the
animation queue.  Note that property-reading functions such as
touches() are synchronous and will not queue, and setting
$.fx.speed.turtle to 0 will make movement functions synchronous.

The absolute motion methods moveto and turnto accept any argument
with pageX and pageY, including, usefully, mouse events.  They
operate in absolute page coordinates even when the turtle is nested
within further transformed elements.

The hit-testing functions touches() and encloses() will test using
the convex hull for the two objects in question. This defaults to
the bounding box of the elements (as transformed) but can be overridden
by the turtleHull CSS property, if present.

JQuery CSS Hooks for Turtle Geometry
------------------------------------

Turtle-oriented 2d transform cssHooks, with animation support on all
motion:

<pre>
  $(x).css('turtlePosition', '30 40');   // position in local coordinates.
  $(x).css('turtlePositionX', '30');     // x component.
  $(x).css('turtlePositionY', '40');     // y component.
  $(x).css('turtleRotation', '90');      // rotation in degrees.
  $(x).css('turtleScale', '2');          // double the size of any element.
  $(x).css('turtleScaleX', '2');         // x stretch before rotate after twist.
  $(x).css('turtleScaleY', '2');         // y stretch before rotate after twist.
  $(x).css('turtleTwist', '45');         // turn before stretching.
  $(x).css('turtleForward', '50');       // position in direction of rotation.
  $(x).css('turtlePen', 'red');          // or 'red lineWidth 2px' etc.
  $(x).css('turtleHull', '5 0 0 5 0 -5');// fine-tune shape for collisions.
</pre>

Arbitrary 2d transforms are supported, including transforms of elements
nested within other elements that have css transforms. Transforms are
automatically decomposed to turtle components when necessary.

A canvas is supported for drawing, but only created when the pen is
used; pen styles include canvas style properties such as lineWidth
and lineCap.

A convex hull polygon can be set to be used by the collision detection
and hit-testing functions (encloses, touches).  The turtleHull is a list
of (unrotated) x-y coordinates relative to the object's transformOrigin.
If set to 'auto' (the default) the hull is just the bounding box for the
element.

Turtle Teaching Environment
---------------------------

An optional teaching environment setup is created by eval($.turtle()).
It provides easy packaging for the above functionality.

After eval($.turtle()):
  * An &lt;img id="turtle"&gt; is created if #turtle doesn't already exist.
  * An eval debugging panel (see.js) is shown at the bottom of the screen.
  * Turtle methods on the default turtle are packaged as globals, e.g., fd(10).
  * Every #id element is turned into a global variable: window.id = $('#id').
  * Globals are set up to save events: "lastclick", "lastmousemove", etc.
  * Default turtle animation is set to 1 move per sec so steps can be seen.
  * speed(movesPerSec) adjusts $.fx.speeds.turtle to 1000 / movesPerSec.
  * tick([ticksPerSec,] fn) is similarly an easier-to-call setInterval.
  * random(lessThanThisInteger || array) is an easy alternative to Math.random.
  * remove() will remove the global turtle and global turtle methods.
  * hatch([n,] [spec]) creates and returns any number of new turtles.
  * see(a, b, c) logs tree-expandable data into the debugging panel.
  * output(html or text) appends html to the document body.
  * input(label, callback) appends a labelled input field to the document body.

For example, after eval($.turtle()), the following is a valid program
in CoffeeScript syntax:

<pre>
speed 100
pen 'red'
chaser = hatch()
chaser.moveto 0,0
chaser.bg 'red'
player = turtle
tick 10, ->
  player.turnto lastmousemove
  player.fd 5
  chaser.turnto player
  chaser.rt (random 60) - 30
  chaser.fd 5
  if chaser.touches player
    output "tag! you're it!"
    tick ->
</pre>

The turtle teaching environment is designed to work well with either
Javascript or CoffeeScript.

License (MIT)
-------------

Copyright (c) 2013 David Bau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

//////////////////////////////////////////////////////////////////////////
// PREREQUISTIES
// Establish support for transforms in this browser.
//////////////////////////////////////////////////////////////////////////

var undefined = {}.undefined;

if (!$.cssHooks) {
  throw("jQuery 1.4.3+ is needed for jQuery-turtle to work");
}

// Determine the name of the 'transform' css property.
function styleSupport(prop) {
  var vendorProp, supportedProp,
      capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
      prefixes = [ "Moz", "Webkit", "O", "ms" ],
      div = document.createElement("div");
  if (prop in div.style) {
    supportedProp = prop;
  } else {
    for (var i = 0; i < prefixes.length; i++) {
      vendorProp = prefixes[i] + capProp;
      if (vendorProp in div.style) {
        supportedProp = vendorProp;
        break;
      }
    }
  }
  div = null;
  $.support[prop] = supportedProp;
  return supportedProp;
}
function hasGetBoundingClientRect() {
  var div = document.createElement("div"),
      result = ('getBoundingClientRect' in div);
  div = null;
  return result;
}
var transform = styleSupport("transform"),
    transformOrigin = styleSupport("transformOrigin");

if (!transform || !hasGetBoundingClientRect()) {
  // Need transforms and boundingClientRects to support turtle methods.
  return;
}

//////////////////////////////////////////////////////////////////////////
// MATH
// 2d matrix support functions.
//////////////////////////////////////////////////////////////////////////

function identity(x) { return x; }

// Handles both 2x2 and 2x3 matrices.
function matrixVectorProduct(a, v) {
  var r = [a[0] * v[0] + a[2] * v[1], a[1] * v[0] + a[3] * v[1]];
  if (a.length == 6) {
    r[0] += a[4];
    r[1] += a[5];
  }
  return r;
}

// Multiplies 2x2 or 2x3 matrices.
function matrixProduct(a, b) {
  var r = [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3]
  ];
  var along = (a.length == 6);
  if (b.length == 6) {
    r.push(a[0] * b[4] + a[2] * b[5] + (along ? a[4] : 0));
    r.push(a[1] * b[4] + a[3] * b[5] + (along ? a[5] : 0));
  } else if (along) {
    r.push(a[4]);
    r.push(a[5]);
  }
  return r;
}

function nonzero(e) {
  // Consider zero any deviations less than one in a trillion.
  return Math.abs(e) > 1e-12;
}

function isone2x2(a) {
  return !nonzero(a[1]) && !nonzero(a[2]) &&
      !nonzero(1 - a[0]) && !nonzero(1 - a[3]);
}

function inverse2x2(a) {
  if (isone2x2(a)) { return [1, 0, 0, 1]; }
  var d = decomposeSVD(a);
  // Degenerate matrices have no inverse.
  if (!nonzero(d[2])) return null;
  return matrixProduct(
      rotation(-(d[3])), matrixProduct(
      scale(1/d[1], 1/d[2]),
      rotation(-(d[0]))));
}

function rotation(theta) {
  var c = Math.cos(theta),
      s = Math.sin(theta);
  return [c, s, -s, c];
}

function scale(sx, sy) {
  if (arguments.length == 1) { sx = sy; }
  return [sx, 0, 0, sy];
}

function addVector(v, a) {
  return [v[0] + a[0], v[1] + a[1]];
}

function subtractVector(v, s) {
  return [v[0] - s[0], v[1] - s[1]];
}

function translatedMVP(m, v, origin) {
  return addVector(matrixVectorProduct(m, subtractVector(v, origin)), origin);
}

// decomposeSVD:
//
// Decomposes an arbitrary 2d matrix into a rotation, an X-Y scaling,
// and a prescaling rotation (which we call a "twist").  The prescaling
// rotation is only nonzero when there is some skew (i.e, a stretch that
// does not preserve rectilinear angles in the source).
//
// This decomposition is stable, which means that the product of
// the three components is always within near machine precision
// (about ~1e-15) of the original matrix.
//
// Input:  [m11, m21, m12, m22] in column-first order.
// Output: [rotation, scalex, scaley, twist] with rotations in radians.
//
// The decomposition is the unique 2d SVD permuted to fit the contraints:
//  * twist is between +- pi/4
//  * rotation is between +- pi/2
//  * scalex + scaley >= 0.
function decomposeSVD(m) {
  var // Compute M*M
      mtm0 = m[0] * m[0] + m[1] * m[1],
      mtm12 = m[0] * m[2] + m[1] * m[3],
      mtm3 = m[2] * m[2] + m[3] * m[3],
      // Compute right-side rotation.
      phi = -0.5 * Math.atan2(mtm12 * 2, mtm0 - mtm3),
      v0 = Math.cos(phi),
      v1 = Math.sin(phi),  // [v0 v1 -v1 v0]
      // Compute left-side rotation.
      mvt0 = (m[0] * v0 - m[2] * v1),
      mvt1 = (m[1] * v0 - m[3] * v1),
      theta = Math.atan2(mvt1, mvt0),
      u0 = Math.cos(theta),
      u1 = Math.sin(theta),  // [u0 u1 -u1 u0]
      // Compute the singular values.  Notice by computing in this way,
      // the sign is pushed into the smaller singular value.
      sv2c = (m[1] * v1 + m[3] * v0) * u0 - (m[0] * v1 + m[2] * v0) * u1,
      sv1c = (m[0] * v0 - m[2] * v1) * u0 + (m[1] * v0 - m[3] * v1) * u1,
      sv1, sv2;
  // Put phi between -pi/4 and pi/4.
  if (phi < -Math.PI / 4) {
    phi += Math.PI / 2;
    sv2 = sv1c;
    sv1 = sv2c;
    theta -= Math.PI / 2;
  } else {
    sv1 = sv1c;
    sv2 = sv2c;
  }
  // Put theta between -pi and pi.
  if (theta > Math.PI) { theta -= 2 * Math.PI; }
  return [theta, sv1, sv2, phi];
}

//////////////////////////////////////////////////////////////////////////
// CSS TRANSFORMS
// Basic manipulation of 2d CSS transforms.
//////////////////////////////////////////////////////////////////////////

function getElementTranslation(elem) {
  var ts = readTurtleTransform(elem, false);
  if (ts) { return [ts.tx, ts.ty]; }
  var m = readTransformMatrix(elem);
  if (m) { return [m[4], m[5]]; }
  return [0, 0];
}

// Reads out the 2x3 transform matrix of the given element.
function readTransformMatrix(elem) {
  var ts = (window.getComputedStyle ?
      window.getComputedStyle(elem)[transform] :
      $.css(elem, 'transform'));
  if (!ts || ts === 'none') {
    return null;
  }
  // Quick exit on the explicit matrix() case:
  var e =/^matrix\(([\-+.\de]+),\s*([\-+.\de]+),\s*([\-+.\de]+),\s*([\-+.\de]+),\s*([\-+.\de]+)(?:px)?,\s*([\-+.\de]+)(?:px)?\)$/.exec(ts);
  if (e) {
    return [parseFloat(e[1]), parseFloat(e[2]), parseFloat(e[3]),
            parseFloat(e[4]), parseFloat(e[5]), parseFloat(e[6])];
  }
  // Interpret the transform string.
  return transformStyleAsMatrix(ts);
}

// Reads out the css transformOrigin property, if present.
function readTransformOrigin(elem, wh) {
  var gcs = (window.getComputedStyle ?  window.getComputedStyle(elem) : null),
      origin = (gcs && gcs[transformOrigin] || $.css(elem, 'transformOrigin'));
  return origin && origin.indexOf('%') < 0 ?
      $.map(origin.split(' '), parseFloat) :
      [wh[0] / 2, wh[1] / 2];
}

// Composes all the 2x2 transforms up to the top.
function totalTransform2x2(elem) {
  var result = [1, 0, 0, 1], t;
  while (elem !== null) {
    t = readTransformMatrix(elem);
    if (t && !isone2x2(t)) {
      result = matrixProduct(t, result);
    }
    elem = elem.parentElement;
  }
  return result.slice(0, 4);
}

// Applies the css 2d transforms specification.
function transformStyleAsMatrix(transformStyle) {
  // Deal with arbitrary transforms:
  var result = [1, 0, 0, 1], ops = [], args = [],
      pat = /(?:^\s*|)(\w*)\s*\(([^)]*)\)\s*/g,
      unknown = transformStyle.replace(pat, function(m) {
        ops.push(m[1].toLowerCase());
        args.push($.map(m[2].split(','), function(s) {
          var v = s.trim().toLowerCase();
          return {
            num: parseFloat(v),
            unit: v.replace(/^[+-.\de]*/, '')
          };
        }));
        return '';
      });
  if (unknown) { return null; }
  for (var index = ops.length - 1; index >= 0; --index) {
    var m = null, a, c, s, t;
    var op = ops[index];
    var arg = args[index];
    if (op == 'matrix') {
      if (arg.length >= 6) {
        m = [arg[0].num, arg[1].num, arg[2].num, arg[3].num,
             arg[4].num, arg[5].num];
      }
    } else if (op == 'rotate') {
      if (arg.length == 1) {
        a = convertToRadians(arg[0]);
        c = Math.cos(a);
        s = Math.sin(a);
        m = [c, -s, c, s];
      }
    } else if (op == 'translate' || op == 'translatex' || op == 'translatey') {
      var tx = 0, ty = 0;
      if (arg.length >= 1) {
        if (arg[0].unit && arg[0].unit != 'px') { return null; } // non-pixels
        if (op == 'translate' || op == 'translatex') { tx = arg[0].num; }
        else if (op == 'translatey') { ty = arg[0].num; }
        if (op == 'translate' && arg.length >= 2) {
          if (arg[1].unit && arg[1].unit != 'px') { return null; }
          ty = arg[1].num;
        }
        m = [0, 0, 0, 0, tx, ty];
      }
    } else if (op == 'scale' || op == 'scalex' || op == 'scaley') {
      var sx = 1, sy = 1;
      if (arg.length >= 1) {
        if (op == 'scale' || op == 'scalex') { sx = arg[0].num; }
        else if (op == 'scaley') { sy = arg[0].num; }
        if (op == 'scale' && arg.length >= 2) { sy = arg[1].num; }
        m = [sx, 0, 0, sy, 0, 0];
      }
    } else if (op == 'skew' || op == 'skewx' || op == 'skewy') {
      var kx = 0, ky = 0;
      if (arg.length >= 1) {
        if (op == 'skew' || op == 'skewx') {
          kx = Math.tan(convertToRadians(arg[0]));
        } else if (op == 'skewy') {
          ky = Math.tan(convertToRadians(arg[0]));
        }
        if (op == 'skew' && arg.length >= 2) {
          ky = Math.tan(convertToRadians(arg[0]));
        }
        m = [1, ky, kx, 1, 0, 0];
      }
    } else {
      // Unrecgonized transformation.
      return null;
    }
    result = matrixProduct(result, m);
  }
  return result;
}

//////////////////////////////////////////////////////////////////////////
// ABSOLUTE PAGE POSITIONING
// Dealing with the element center, rectangle, and direction on the page,
// taking into account nested parent transforms.
//////////////////////////////////////////////////////////////////////////

function limitMovement(start, target, limit) {
  if (limit <= 0) return start;
  var distx = target.pageX - start.pageX,
      disty = target.pageY - start.pageY,
      dist2 = distx * distx + disty * disty;
  if (limit * limit >= dist2) {
    return target;
  }
  var frac = limit / Math.sqrt(dist2);
  return {
    pageX: start.pageX + frac * distx,
    pageY: start.pageY + frac * disty
  };
}

function limitRotation(start, target, limit) {
  if (limit <= 0) { target = start; }
  else if (limit < 180) {
    var delta = normalizeRotation(target - start);
    if (delta > limit) { target = start + limit; }
    else if (delta < -limit) { target = start - limit; }
  }
  return normalizeRotation(target);
}

function getCenterLTWH(x0, y0, w, h) {
  return { pageX: x0 + w / 2, pageY: y0 + h / 2 };
}

function getStraightRectLTWH(x0, y0, w, h) {
  var x1 = x0 + w, y1 = y0 + h;
  return [
    { pageX: x0, pageY: y0 },
    { pageX: x0, pageY: y1 },
    { pageX: x1, pageY: y1 },
    { pageX: x1, pageY: y0 }
  ];
}

function cleanedStyle(trans) {
  // Work around FF bug: the browser generates CSS transforms with nums
  // with exponents like 1e-6px that are not allowed by the CSS spec.
  // And yet it doesn't accept them when set back into the style object.
  // So $.swap doesn't work in these cases.  Therefore, we have a cleanedSwap
  // that cleans these numbers before setting them back.
  if (!/e[\-+]/.exec(trans)) {
    return trans;
  }
  var result = trans.replace(/(?:\d+(?:\.\d*)?|\.\d+)e[\-+]\d+/g, function(e) {
    return cssNum(parseFloat(e)); });
  return result;
}

function cleanSwap(elem, options, callback, args) {
  var ret, name, old = {};
  // Remember the old values, and insert the new ones
  for (name in options) {
    old[name] = elem.style[name];
    elem.style[name] = options[name];
  }
  ret = callback.apply(elem, args || []);
  // Revert the old values
  for (name in options) {
    elem.style[name] = cleanedStyle(old[name]);
  }
  return ret;
}

function unattached(elt) {
  // Unattached if not part of a document.
  while (elt) {
    if (elt.nodeType === 9) return false;
    elt = elt.parentNode;
  }
  return true;
}

function wh() {
  // Quirks-mode compatible window height.
  return window.innerHeight || $(window).height();
}

function ww() {
  // Quirks-mode compatible window width.
  return window.innerWidth || $(window).width();
}

function dh() {
  return document.body ? $(document).height() : document.height;
}

function dw() {
  return document.body ? $(document).width() : document.width;
}

function makeGbcrLTWH(left, top, width, height) {
  return {
    left: left, top: top, right: left + width, bottom: top + height,
    width: width, height: height
  };
}

function getPageGbcr(elem) {
  if (isPageCoordinate(elem)) {
    return makeGbcrLTWH(elem.pageX, elem.pageY, 0, 0);
  } else if ($.isWindow(elem)) {
    return makeGbcrLTWH(
        $(window).scrollLeft(), $(window).scrollTop(), ww(), wh());
  } else if (elem.nodeType === 9) {
    return makeGbcrLTWH(0, 0, dw(), dh());
  }
  return readPageGbcr.apply(elem);
}

function isGbcrOutside(center, distance, d2, gbcr) {
  var dy = Math.max(0,
           Math.max(gbcr.top - center.pageY, center.pageY - gbcr.bottom)),
      dx = Math.max(0,
           Math.max(gbcr.left - center.pageX, center.pageX - gbcr.right));
  return dx * dx + dy * dy > d2;
}

function isGbcrInside(center, d2, gbcr) {
  var dy = Math.max(gbcr.bottom - center.pageY, center.pageY - gbcr.top),
      dx = Math.max(gbcr.right - center.pageX, center.pageX - gbcr.left);
  return dx * dx + dy * dy < d2;
}

function isDisjointGbcr(gbcr0, gbcr1) {
  return (gbcr1.right < gbcr0.left || gbcr0.right < gbcr1.left ||
          gbcr1.bottom < gbcr0.top || gbcr0.bottom < gbcr1.top);
}

function gbcrEncloses(gbcr0, gbcr1) {
  return (gbcr1.top >= gbcr0.top && gbcr1.bottom <= gbcr0.bottom &&
          gbcr1.left >= gbcr0.left && gbcr1.right <= gbcr0.right);
}

function polyMatchesGbcr(poly, gbcr) {
  return (poly.length === 4 &&
      poly[0].pageX === gbcr.left && poly[0].pageY === gbcr.top &&
      poly[1].pageX === gbcr.left && poly[1].pageY === gbcr.bottom &&
      poly[2].pageX === gbcr.right && poly[2].pageY === gbcr.bottom &&
      poly[3].pageX === gbcr.right && poly[3].pageY === gbcr.top);
}

function readPageGbcr() {
  var raw = this.getBoundingClientRect();
  if (raw.width === 0 && raw.height === 0 &&
     raw.top === 0 && raw.left === 0 && unattached(this)) {
    // Prentend unattached images have a size.
    return {
      top: 0,
      bottom: this.height || 0,
      left: 0,
      right: this.width || 0,
      width: this.width || 0,
      height: this.height || 0,
    }
  }
  return {
    top: raw.top + window.pageYOffset,
    bottom: raw.bottom + window.pageYOffset,
    left: raw.left + window.pageXOffset,
    right: raw.right + window.pageXOffset,
    width: raw.width,
    height: raw.height
  };
}

// Temporarily eliminate transform (but reverse parent distortions)
// to get origin position; then calculate displacement needed to move
// turtle to target coordinates (again reversing parent distortions
// if possible).
function setCenterInPageCoordinates(elem, target, limit, localx, localy) {
  var totalParentTransform = totalTransform2x2(elem.parentElement),
      inverseParent = inverse2x2(totalParentTransform),
      hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      substTransform = swapout[transform] = (inverseParent ? 'matrix(' +
          $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      gbcr = cleanSwap(elem, swapout, readPageGbcr),
      middle = readTransformOrigin(elem, [gbcr.width, gbcr.height]),
      origin = addVector([gbcr.left, gbcr.top], middle),
      pos, current, translation, localTarget;
  if (!inverseParent) { return; }
  if ($.isNumeric(limit)) {
    pos = addVector(matrixVectorProduct(totalParentTransform, tr), origin);
    current = {
      pageX: pos[0],
      pageY: pos[1]
    };
    target = limitMovement(current, target, limit);
  }
  localTarget = matrixVectorProduct(inverseParent,
      subtractVector([target.pageX, target.pageY], origin));
  if (localx || localy) {
    var ts = readTurtleTransform(elem, true),
        r = (ts || 0) && convertToRadians(ts.rot);
    localTarget[0] += Math.cos(r) * localx + Math.sin(r) * localy;
    localTarget[1] += Math.sin(r) * localx - Math.cos(r) * localy;
  }
  $.style(elem, 'turtlePosition', localTarget.join(' '));
}

// Uses getBoundingClientRect to figure out current position in page
// coordinates.  Works by backing out local transformation (and inverting
// any parent rotations and distortions) so that the bounding rect is
// rectilinear; then reapplies translation (under any parent distortion)
// to get the final x and y, returned as {pageX:, pagey:}.
function getCenterInPageCoordinates(elem) {
  if ($.isWindow(elem)) {
    return getCenterLTWH(
        $(window).scrollLeft(), $(window).scrollTop(), ww(), wh());
  } else if (elem.nodeType === 9) {
    return getCenterLTWH(0, 0, dw(), dh());
  }
  var tr = getElementTranslation(elem),
      totalParentTransform = totalTransform2x2(elem.parentElement),
      inverseParent = inverse2x2(totalParentTransform),
      hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      st = swapout[transform] = (inverseParent ? 'matrix(' +
          $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      substTransform = (st == 'matrix(1, 0, 0, 1, 0, 0)') ? 'none' : st;
      saved = elem.style[transform],
      gbcr = cleanSwap(elem, swapout, readPageGbcr),
      middle = readTransformOrigin(elem, [gbcr.width, gbcr.height]),
      origin = addVector([gbcr.left, gbcr.top], middle),
      pos = addVector(matrixVectorProduct(totalParentTransform, tr), origin);
  return {
    pageX: pos[0],
    pageY: pos[1]
  };
}

function polyToVectorsOffset(poly, offset) {
  if (!poly) { return null; }
  var result = [], j = 0;
  for (; j < poly.length; ++j) {
    result.push([poly[j].pageX + offset[0], poly[j].pageY + offset[1]]);
  }
  return result;
}

// Uses getBoundingClientRect to figure out the corners of the
// transformed parallelogram in page coordinates.
function getCornersInPageCoordinates(elem, untransformed) {
  if ($.isWindow(elem)) {
    return getStraightRectLTWH(
        $(window).scrollLeft(), $(window).scrollTop(), ww(), wh());
  } else if (elem.nodeType === 9) {
    return getStraightRectLTWH(0, 0, dw(), dh());
  }
  var currentTransform = readTransformMatrix(elem) || [1, 0, 0, 1],
      totalParentTransform = totalTransform2x2(elem.parentElement),
      totalTransform = matrixProduct(totalParentTransform, currentTransform),
      inverseParent = inverse2x2(totalParentTransform),
      hidden = ($.css(elem, 'display') === 'none'),
      swapout = hidden ?
        { position: "absolute", visibility: "hidden", display: "block" } : {},
      substTransform = swapout[transform] = (inverseParent ? 'matrix(' +
          $.map(inverseParent, cssNum).join(', ') + ', 0, 0)' : 'none'),
      gbcr = cleanSwap(elem, swapout, readPageGbcr),
      middle = readTransformOrigin(elem, [gbcr.width, gbcr.height]),
      origin = addVector([gbcr.left, gbcr.top], middle),
      hull = polyToVectorsOffset(getTurtleData(elem).hull, origin) || [
        [gbcr.left, gbcr.top],
        [gbcr.left, gbcr.bottom],
        [gbcr.right, gbcr.bottom],
        [gbcr.right, gbcr.top]
      ];
  if (untransformed) {
    // Used by the turtleHull css getter hook.
    return $.map(hull, function(pt) {
      return { pageX: pt[0] - origin[0], pageY: pt[1] - origin[1] };
    });
  }
  return $.map(hull, function(pt) {
    var tpt = translatedMVP(totalTransform, pt, origin);
    return { pageX: tpt[0], pageY: tpt[1] };
  });
}

function setDirectionOnPage(elem, target, limit) {
  var totalParentTransform = totalTransform2x2(elem.parentElement),
      inverseParent = inverse2x2(totalParentTransform),
      ts = readTurtleTransform(elem, true);
  if (!inverseParent) {
    return;
  }
  if ($.isNumeric(limit)) {
    var r = convertToRadians(ts.rot),
        ux = Math.sin(r), uy = Math.cos(r),
        up = matrixVectorProduct(totalParentTransform, [ux, uy]);
        d = radiansToDegrees(Math.atan2(up[0], up[1]));
    target = limitRotation(d, target, limit);
  }
  var rt = convertToRadians(target),
      lp = matrixVectorProduct(inverseParent, [Math.sin(rt), Math.cos(rt)]),
      tr = Math.atan2(lp[0], lp[1]);
  ts.rot = radiansToDegrees(tr);
  elem.style[transform] = writeTurtleTransform(ts);
}

function getDirectionOnPage(elem) {
  var ts = readTurtleTransform(elem, true),
      r = convertToRadians(ts.rot),
      ux = Math.sin(r), uy = Math.cos(r),
      totalParentTransform = totalTransform2x2(elem.parentElement),
      up = matrixVectorProduct(totalParentTransform, [ux, uy]);
      dp = Math.atan2(up[0], up[1]);
  return radiansToDegrees(dp);
}

function scrollWindowToDocumentPosition(pos, limit) {
  var tx = pos.pageX,
      ty = pos.pageY,
      ww2 = ww() / 2,
      wh2 = wh() / 2,
      b = $('body'),
      dw = b.width(),
      dh = b.height(),
      w = $(window);
  if (tx > dw - ww2) { tx = dw - ww2; }
  if (tx < ww2) { tx = ww2; }
  if (ty > dh - wh2) { ty = dh - wh2; }
  if (ty < wh2) { ty = wh2; }
  targ = { pageX: tx, pageY: ty };
  if ($.isNumeric(limit)) {
    targ = limitMovement(w.center(), targ, limit);
  }
  w.scrollLeft(targ.pageX - ww2);
  w.scrollTop(targ.pageY - wh2);
}

//////////////////////////////////////////////////////////////////////////
// HIT DETECTION AND COLLISIONS
// Deal with touching and enclosing element rectangles taking
// into account distortions from transforms.
//////////////////////////////////////////////////////////////////////////

function signedTriangleArea(pt0, pt1, pt2) {
  var x1 = pt1.pageX - pt0.pageX,
      y1 = pt1.pageY - pt0.pageY,
      x2 = pt2.pageX - pt0.pageX,
      y2 = pt2.pageY - pt0.pageY;
  return x2 * y1 - x1 * y2;
}

function signedDeltaTriangleArea(pt0, diff1, pt2) {
  var x2 = pt2.pageX - pt0.pageX,
      y2 = pt2.pageY - pt0.pageY;
  return x2 * diff1.pageY - diff1.pageX * y2;
}

function pointInConvexPolygon(pt, poly) {
  // Implements top google hit algorithm for
  // ["An efficient test for a point to be in a convex polygon"]
  if (poly.length <= 0) { return false; }
  if (poly.length == 1) {
    return poly[0].pageX == pt.pageX && poly[0].pageY == pt.pageY;
  }
  var a0 = signedTriangleArea(pt, poly[poly.length - 1], poly[0]);
  if (a0 === 0) { return true; }
  var positive = (a0 > 0);
  if (poly.length == 2) { return false; }
  for (var j = 1; j < poly.length; ++j) {
    var aj = signedTriangleArea(pt, poly[j - 1], poly[j]);
    if (aj === 0) { return true; }
    if ((aj > 0) != positive) { return false; }
  }
  return true;
}

function diff(v1, v0) {
  return { pageX: v1.pageX - v0.pageX, pageY: v1.pageY - v0.pageY };
}

// Given an edge [p0, p1] of polygon P, and the expected sign of [p0, p1, p]
// for p inside P, then determine if all points in the other poly have the
// opposite sign.
function edgeSeparatesPointAndPoly(inside, p0, p1, poly) {
  var d1 = diff(p1, p0), j, s;
  for (j = 0; j < poly.length; ++j) {
    s = sign(signedDeltaTriangleArea(p0, d1, poly[j]));
    if (!s || s === inside) { return false; }
  }
  return true;
}

function sign(n) {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

function convexPolygonSign(poly) {
  if (poly.length <= 2) { return 0; }
  var a = signedTriangleArea(poly[poly.length - 1], poly[0], poly[1]);
  if (a !== 0) { return sign(a); }
  for (var j = 1; j < poly.length; ++j) {
    a = signedTriangleArea(poly[j - 1], poly[j], poly[(j + 1) % poly.length]);
    if (a !== 0) { return sign(a); }
  }
  return 0;
}

function doConvexPolygonsOverlap(poly1, poly2) {
  // Implements top google hit for
  // ["polygon collision" gpwiki]
  var sign = convexPolygonSign(poly1), j;
  for (j = 0; j < poly1.length; ++j) {
    if (edgeSeparatesPointAndPoly(
        sign, poly1[j], poly1[(j + 1) % poly1.length], poly2)) {
      return false;
    }
  }
  sign = convexPolygonSign(poly2);
  for (j = 0; j < poly2.length; ++j) {
    if (edgeSeparatesPointAndPoly(
        sign, poly2[j], poly2[(j + 1) % poly2.length], poly1)) {
      return false;
    }
  }
  return true;
}

function doesConvexPolygonContain(polyOuter, polyInner) {
  // Just verify all vertices of polyInner are inside.
  for (var j = 0; j < polyInner.length; ++j) {
    if (!pointInConvexPolygon(polyInner[j], polyOuter)) {
      return false;
    }
  }
  return true;
}

// Google search for [Graham Scan Tom Switzer].
function convexHull(points) {
  function keepLeft(hull, r) {
    if (!r || !isPageCoordinate(r)) { return hull; }
    while (hull.length > 1 && sign(signedTriangleArea(hull[hull.length - 2],
        hull[hull.length - 1], r)) != 1) { hull.pop(); }
    if (!hull.length || !equalPoint(hull[hull.length - 1], r)) { hull.push(r); }
    return hull;
  }
  function reduce(arr, valueInitial, fnReduce) {
    for (var j = 0; j < arr.length; ++j) {
      valueInitial = fnReduce(valueInitial, arr[j]);
    }
    return valueInitial;
  }
  function equalPoint(p, q) {
    return p.pageX === q.pageX && p.pageY === q.pageY;
  }
  function lexicalPointOrder(p, q) {
    return p.pageX < q.pageX ? -1 : p.pageX > q.pageX ? 1 :
           p.pageY < q.pageY ? -1 : p.pageY > q.pageY ? 1 : 0;
  }
  points.sort(lexicalPointOrder);
  var leftdown = reduce(points, [], keepLeft),
      rightup = reduce(points.reverse(), [], keepLeft);
  return leftdown.concat(rightup.slice(1, -1));
}

function parseTurtleHull(text) {
  if (!text) return null;
  var nums = $.map(text.trim().split(/\s+/), parseFloat), points = [], j = 0;
  while (j + 1 < nums.length) {
    points.push({ pageX: nums[j], pageY: nums[j + 1] });
    j += 2;
  }
  return points;
}

function readTurtleHull(elem) {
  return getTurtleData(elem).hull;
}

function writeTurtleHull(hull) {
  for (var j = 0, result = []; j < hull.length; ++j) {
    result.push(hull[j].pageX, hull[j].pageY);
  }
  return result.length ? $.map(result, cssNum).join(' ') : 'none';
}

function makeHullHook() {
  return {
    get: function(elem, computed, extra) {
      var hull = getTurtleData(elem).hull;
      return writeTurtleHull(hull ||
          getCornersInPageCoordinates(elem, true));
    },
    set: function(elem, value) {
      var hull =
        !value || value == 'auto' ? null :
        value == 'none' ? [] :
        convexHull(parseTurtleHull(value));
      getTurtleData(elem).hull = hull;
    }
  };
}

//////////////////////////////////////////////////////////////////////////
// TURTLE CSS CONVENTIONS
// For better performance, the turtle library always writes transform
// CSS in a canonical form; and it reads this form faster than generic
// matrices.
//////////////////////////////////////////////////////////////////////////

// The canonical 2D transforms written by this plugin have the form:
// translate(tx, ty) rotate(rot) scale(sx, sy) rotate(twi)
// (with each component optional).
// This function quickly parses this form into a canonicalized object.
function parseTurtleTransform(transform) {
  if (transform === 'none') {
    return {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
  }
  // Note that although the CSS spec doesn't allow 'e' in numbers, IE10
  // and FF put them in there; so allow them.
  var e = /^(?:translate\(([\-+.\de]+)(?:px)?,\s*([\-+.\de]+)(?:px)?\)\s*)?(?:rotate\(([\-+.\de]+)(?:deg)?\)\s*)?(?:scale\(([\-+.\de]+)(?:,\s*([\-+.\de]+))?\)\s*)?(?:rotate\(([\-+.\de]+)(?:deg)?\)\s*)?$/.exec(transform);
  if (!e) { return null; }
  var tx = e[1] ? parseFloat(e[1]) : 0,
      ty = e[2] ? parseFloat(e[2]) : 0,
      rot = e[3] ? parseFloat(e[3]) : 0,
      sx = e[4] ? parseFloat(e[4]) : 1,
      sy = e[5] ? parseFloat(e[5]) : sx,
      twi = e[6] ? parseFloat(e[6]) : 0;
  return {tx:tx, ty:ty, rot:rot, sx:sx, sy:sy, twi:twi};
}

function computeTurtleTransform(elem) {
  var m = readTransformMatrix(elem), d;
  if (!m) {
    return {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
  }
  d = decomposeSVD(m);
  return {
    tx: m[4], ty: m[5], rot: radiansToDegrees(d[0]),
    sx: d[1], sy: d[2], twi: radiansToDegrees(d[3])
  };
}

function readTurtleTransform(elem, computed) {
  return parseTurtleTransform(elem.style[transform]) ||
      (computed && computeTurtleTransform(elem));
}

function cssNum(n) {
  var r = n.toString();
  if (r.indexOf('e') >= 0) {
    r = Number(n).toFixed(17);
  }
  return r;
}

function writeTurtleTransform(ts) {
  var result = [];
  if (nonzero(ts.tx) || nonzero(ts.ty)) {
    result.push(
      'translate(' + cssNum(ts.tx) + 'px, ' + cssNum(ts.ty) + 'px)');
  }
  if (nonzero(ts.rot) || nonzero(ts.twi)) {
    result.push('rotate(' + cssNum(ts.rot) + 'deg)');
  }
  if (nonzero(1 - ts.sx) || nonzero(1 - ts.sy)) {
    if (nonzero(ts.sx - ts.sy)) {
      result.push('scale(' + cssNum(ts.sx) + ', ' + cssNum(ts.sy) + ')');
    } else {
      result.push('scale(' + cssNum(ts.sx) + ')');
    }
  }
  if (nonzero(ts.twi)) {
    result.push('rotate(' + cssNum(ts.twi) + 'deg)');
  }
  if (!result.length) {
    return 'none';
  }
  return result.join(' ');
}

function radiansToDegrees(r) {
  d = r * 180 / Math.PI;
  if (d > 180) { d -= 360; }
  return d;
}

function convertToRadians(d) {
  return d * Math.PI / 180;
}

function normalizeRotation(x) {
  if (Math.abs(x) > 180) {
    x = x % 360;
    if (x > 180) { x -= 360; }
    else if (x <= -180) { x += 360; }
  }
  return x;
}

//////////////////////////////////////////////////////////////////////////
// TURTLE DRAWING SUPPORT
// If pen, erase, or dot are used, then a full-page canvas is created
// and used for drawing.
//////////////////////////////////////////////////////////////////////////

// drawing state.
var drawing = {
  attached: false,
  surface: null,
  ctx: null,
  canvas: null,
  timer: null,
  subpixel: 1
};

function getTurtleClipSurface() {
  if (drawing.surface) {
    return drawing.surface;
  }
  var surface = document.createElement('samp');
  $(surface).css({
    position: 'absolute',
    display: 'inline-block',
    top: 0, left: 0, width: '100%', height: '100%',
    'z-index': -1,
    overflow: 'hidden'
  });
  drawing.surface = surface;
  attachClipSurface();
  return surface;
}

function attachClipSurface() {
  if (document.body) {
    $(drawing.surface).prependTo('body');
  } else {
    $(document).ready(attachClipSurface);
  }
}

function getTurtleDrawingCtx() {
  if (drawing.ctx) {
    return drawing.ctx;
  }
  var surface = getTurtleClipSurface();
  drawing.canvas = document.createElement('canvas');
  $(drawing.canvas).css({'z-index': -1});
  surface.appendChild(drawing.canvas);
  drawing.ctx = drawing.canvas.getContext('2d');
  resizecanvas();
  pollbodysize(resizecanvas);
  $(window).resize(resizecanvas);
  drawing.ctx.scale(drawing.subpixel, drawing.subpixel);
  return drawing.ctx;
}

function pollbodysize(callback) {
  var b = $('body');
  var lastwidth = b.width();
  var lastheight = b.height();
  var poller = (function() {
    if (b.width() != lastwidth || b.height() != lastheight) {
      callback();
      lastwidth = b.width();
      lastheight = b.height();
    }
  });
  if (drawing.timer) {
    clearInterval(drawing.timer);
  }
  drawing.timer = setInterval(poller, 250);
}

function resizecanvas() {
  if (!drawing.canvas) return;
  var b = $('body'),
      wh = Math.max(b.outerHeight(true),
          window.innerHeight || $(window).height()),
      bw = Math.max(200, Math.ceil(b.outerWidth(true) / 100) * 100),
      bh = Math.max(200, Math.ceil(wh / 100) * 100),
      cw = drawing.canvas.width,
      ch = drawing.canvas.height,
      tc;
  $(drawing.surface).css({ width: b.outerWidth(true) + 'px',
      height: wh + 'px'});
  if (cw != bw * drawing.subpixel || ch != bh * drawing.subpixel) {
    // Transfer canvas out to tc and back again after resize.
    tc = document.createElement('canvas');
    tc.width = Math.min(cw, bw * drawing.subpixel);
    tc.height = Math.min(ch, bh * drawing.subpixel);
    tc.getContext('2d').drawImage(drawing.canvas, 0, 0);
    drawing.canvas.width = bw * drawing.subpixel;
    drawing.canvas.height = bh * drawing.subpixel;
    drawing.canvas.getContext('2d').drawImage(tc, 0, 0);
    $(drawing.canvas).css({ width: bw, height: bh });
  }
}

// turtlePen style syntax
function parsePenStyle(text, defaultProp) {
  if (!text) { return null; }
  text = text.trim();
  if (!text || text === 'none') { return null; }
  if (text === 'path') { return { savePath: true }; }
  var words = text.split(/\s+/),
      mapping = {
        strokeStyle: identity,
        lineWidth: parseFloat,
        lineCap: identity,
        lineJoin: identity,
        miterLimit: parseFloat,
        fillStyle: identity,
      },
      result = {}, j, end = words.length;
  for (j = words.length - 1; j >= 0; --j) {
    if (mapping.hasOwnProperty(words[j])) {
      var key = words[j],
          param = words.slice(j + 1, end).join(' ');
      result[key] = mapping[key](param);
      end = j;
    }
  }
  if (end > 0 && !result[defaultProp]) {
    result[defaultProp] = words.slice(0, end).join(' ');
  }
  return result;
}

function writePenStyle(style) {
  if (!style) { return 'none'; }
  var result = [];
  $.each(style, function(k, v) {
    result.push(k);
    result.push(v);
  });
  return result.join(' ');
}

function getTurtleData(elem) {
  var state = $.data(elem, 'turtleData');
  if (!state) {
    state = $.data(elem, 'turtleData', { style: null, path: [] });
  }
  return state;
}

function makePenHook() {
  return {
    get: function(elem, computed, extra) {
      return writePenStyle(getTurtleData(elem).style);
    },
    set: function(elem, value) {
      var style = parsePenStyle(value, 'strokeStyle');
      getTurtleData(elem).style = style;
      elem.style.turtlePen = writePenStyle(style);
      if (style) {
        flushPenState(elem);
      }
    }
  };
}

function isPointNearby(a, b) {
  return Math.round(a.pageX - b.pageX) === 0 &&
         Math.round(a.pageY - b.pageY) === 0;
}

function applyPenStyle(ctx, ps) {
  if (!ps || !('strokeStyle' in ps)) { ctx.strokeStyle = 'black'; }
  if (!ps || !('lineWidth' in ps)) { ctx.lineWidth = 1.62; }
  if (!ps || !('lineCap' in ps)) { ctx.lineCap = 'round'; }
  if (ps) {
    for (var a in ps) {
      if (a === 'path') { continue; }
      ctx[a] = ps[a];
    }
  }
}

function flushPenState(elem) {
  var state = getTurtleData(elem);
  if (!state.style) {
    if (state.path.length) { state.path.length = 0; }
    return;
  }
  var center = getCenterInPageCoordinates(elem);
  // Once the pen is down, the origin needs to be stable when the image
  // loads.
  watchImageToFixOriginOnLoad(elem);
  if (!state.path.length ||
      !isPointNearby(center, state.path[state.path.length - 1])) {
    state.path.push(center);
  }
  if (!state.style.path) {
    var ctx = getTurtleDrawingCtx();
        isClosed = isPointNearby(
            state.path[0], state.path[state.path.length - 1]);
    ctx.save();
    applyPenStyle(ctx, state.style);
    ctx.beginPath();
    ctx.moveTo(state.path[0].pageX, state.path[0].pageY);
    for (var j = 1; j < state.path.length - (isClosed ? 1 : 0); ++j) {
      ctx.lineTo(state.path[j].pageX, state.path[j].pageY);
    }
    if (isClosed) { ctx.closePath(); }
    if ('fillStyle' in state.style) { ctx.fill(); }
    if ('strokeStyle' in state.style) { ctx.stroke(); }
    ctx.restore();
    state.path.splice(0, state.path.length - 1);
  }
}

function fillDot(position, diameter, style) {
  var ctx = getTurtleDrawingCtx();
  ctx.save();
  applyPenStyle(ctx, style);
  ctx.beginPath();
  ctx.arc(position.pageX, position.pageY, diameter / 2, 0, 2*Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function eraseBox(elem, style) {
  var c = getCornersInPageCoordinates(elem),
      ctx = getTurtleDrawingCtx(),
      j = 1;
  if (!c || c.length < 3) { return; }
  ctx.save();
  // Clip to box and use 'copy' mode so that 'transparent' can be
  // written into the canvas - that's better erasing than 'white'.
  ctx.globalCompositeOperation = 'copy';
  applyPenStyle(ctx, style);
  ctx.beginPath();
  ctx.moveTo(c[0].pageX, c[0].pageY);
  for (; j < c.length; j += 1) {
    ctx.lineTo(c[j].pageX, c[j].pageY);
  }
  ctx.closePath();
  ctx.clip();
  ctx.fill();
  ctx.restore();
}

//////////////////////////////////////////////////////////////////////////
// JQUERY METHOD SUPPORT
// Functions in direct support of exported methods.
//////////////////////////////////////////////////////////////////////////

function applyImg(sel, img) {
  if (sel[0].tagName == 'IMG') {
    sel[0].src = img.url;
    sel.css(img.css);
  } else {
    sel.css({
      backgroundImage: 'url(' + img.url + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: img.css.width + 'px ' + img.css.height + 'px'
    });
  }
}

function doQuickMove(elem, distance, sideways) {
  var ts = readTurtleTransform(elem, true),
      r = (ts || 0) && convertToRadians(ts.rot),
      dy = -Math.cos(r) * distance,
      dx = Math.sin(r) * distance;
  if (!ts) { return; }
  if (sideways) {
    dy += Math.sin(r) * sideways;
    dx += Math.cos(r) * sideways;
  }
  ts.tx += dx;
  ts.ty += dy;
  elem.style[transform] = writeTurtleTransform(ts);
  flushPenState(elem);
}

function displacedPosition(elem, distance, sideways) {
  var ts = readTurtleTransform(elem, true),
      r = (ts || 0) && convertToRadians(ts.rot),
      scaledDistance = (ts || 0) && (distance * ts.sy),
      scaledSideways = (ts || 0) && ((sideways || 0) * ts.sx),
      dy = -Math.cos(r) * scaledDistance,
      dx = Math.sin(r) * scaledDistance;
  if (!ts) { return; }
  if (scaledSideways) {
    dy += Math.sin(r) * scaledSideways;
    dx += Math.cos(r) * scaledSideways;
  }
  return cssNum(ts.tx + dx) + ' ' + cssNum(ts.ty + dy);
}

function isPageCoordinate(obj) {
  return $.isNumeric(obj.pageX) && $.isNumeric(obj.pageY);
}

function makeTurtleForwardHook() {
  return {
    get: function(elem, computed, extra) {
      var ts = readTurtleTransform(elem, computed);
      if (ts) {
        var r = convertToRadians(ts.rot),
            c = Math.cos(r),
            s = Math.sin(r);
        return (ts.tx * s - ts.ty * c) / ts.sy + 'px';
      }
    },
    set: function(elem, value) {
      var ts = readTurtleTransform(elem, true) ||
              {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0},
          v = parseFloat(value) * ts.sy,
          r = convertToRadians(ts.rot),
          c = Math.cos(r),
          s = Math.sin(r),
          p = ts.tx * c + ts.ty * s;
      ts.tx = p * c + v * s;
      ts.ty = p * s - v * c;
      elem.style[transform] = writeTurtleTransform(ts);
      flushPenState(elem);
    }
  };
}

// Finally, add turtle support.
function makeTurtleHook(prop, normalize, unit, displace) {
  return {
    get: function(elem, computed, extra) {
      var ts = readTurtleTransform(elem, computed);
      if (ts) { return ts[prop] + unit; }
    },
    set: function(elem, value) {
      var ts = readTurtleTransform(elem, true) ||
          {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
      ts[prop] = normalize(value);
      elem.style[transform] = writeTurtleTransform(ts);
      if (displace) {
        flushPenState(elem);
      }
    }
  };
}

function makeRotationStep(prop) {
  return function(fx) {
    if (!fx.delta) {
      fx.delta = normalizeRotation(fx.end - fx.start);
      fx.start = fx.end - fx.delta;
    }
    $.cssHooks[prop].set(fx.elem, fx.start + fx.delta * fx.pos);
  };
}

function splitPair(text, duplicate) {
  if (text.length && text[0] === '_') {
    // Hack: remove forced number non-conversion.
    text = text.substring(1);
  }
  var result = $.map(('' + text).split(/\s+/), parseFloat);
  while (result.length < 2) {
    result.push(duplicate ?
        (!result.length ? 1 : result[result.length - 1]) : 0);
  }
  return result;
}

function makePairStep(prop, displace) {
  return function(fx) {
    if (!fx.delta) {
      var end = splitPair(fx.end, !displace);
      fx.start = splitPair(fx.start, !displace);
      fx.delta = [end[0] - fx.start[0], end[1] - fx.start[1]];
    }
    $.cssHooks[prop].set(fx.elem, [fx.start[0] + fx.delta[0] * fx.pos,
        fx.start[1] + fx.delta[1] * fx.pos].join(' '));
  };
}

var XY = ['X', 'Y'];
function makeTurtleXYHook(publicname, propx, propy, displace) {
  return {
    get: function(elem, computed, extra) {
      var ts = readTurtleTransform(elem, computed);
      if (ts) {
        if (displace || ts[propx] != ts[propy]) {
          // Hack: if asked to convert a pair to a number by fx, then refuse.
          return (extra === '' ? '_' : '') + ts[propx] + ' ' + ts[propy];
        } else {
          return '' + ts[propx];
        }
      }
    },
    set: function(elem, value, extra) {
      var ts = readTurtleTransform(elem, true) ||
              {tx: 0, ty: 0, rot: 0, sx: 1, sy: 1, twi: 0};
      var parts = (typeof(value) == 'string' ? value.split(/\s+/) : [value]);
      if (parts.length < 1 || parts.length > 2) { return; }
      if (parts.length >= 1) { ts[propx] = parts[0]; }
      if (parts.length >= 2) { ts[propy] = parts[1]; }
      else if (!displace) { ts[propy] = ts[propx]; }
      else { ts[propy] = 0; }
      elem.style[transform] = writeTurtleTransform(ts);
      if (displace) {
        flushPenState(elem);
      }
    }
  };
}

function watchImageToFixOriginOnLoad(elem) {
  if (!elem || elem.tagName !== 'IMG' && elem.complete ||
      $.data(elem, 'turtleFixingOrigin')) {
    return;
  }
  $.data(elem, 'turtleFixingOrigin', true);
  var oldOrigin = readTransformOrigin(elem,
          [$(elem).width(), $(elem).height()]),
      fixOrigin = function() {
    var newOrigin = readTransformOrigin(elem,
            [$(elem).width(), $(elem).height()]),
        ts = readTurtleTransform(elem, true);
    $.removeData(elem, 'turtleFixingOrigin');
    ts.tx += oldOrigin[0] - newOrigin[0];
    ts.ty += oldOrigin[1] - newOrigin[1];
    elem.style[transform] = writeTurtleTransform(ts);
    jQuery.event.remove(elem, 'load', fixOrigin);
  };
  jQuery.event.add(elem, 'load', fixOrigin);
}

function withinOrNot(obj, within, distance, x, y) {
  var sel, gbcr;
  if (x === undefined && y === undefined) {
    sel = $(distance);
    gbcr = getPageGbcr(sel[0]);
    if (polyMatchesGbcr(getCornersInPageCoordinates(sel[0]), gbcr)) {
      return obj.filter(function() {
        var thisgbcr = getPageGbcr(this);
        return within === (gbcrEncloses(gbcr, thisgbcr) ||
            (!isDisjointGbcr(gbcr, thisgbcr) && sel.encloses(this)));
      });
    } else {
      return obj.filter(function() {
        return within === sel.encloses(this);
      });
    }
  }
  if (distance === 'touch') {
    sel = $(x);
    gbcr = getPageGbcr(sel[0]);
    if (polyMatchesGbcr(getCornersInPageCoordinates(sel[0]), gbcr)) {
      return obj.filter(function() {
        var thisgbcr = getPageGbcr(this);
        // !isDisjoint test assumes gbcr is tight.
        return within === (!isDisjointGbcr(gbcr, thisgbcr) &&
          (gbcrEncloses(gbcr, thisgbcr) || sel.touches(this)));
      });
    } else {
      return obj.filter(function() {
        return within === sel.touches(this);
      });
    }
  }
  var ctr = $.isNumeric(x) && $.isNumeric(y) ? { pageX: x, pageY: y } :
    isPageCoordinate(x) ? x :
    $(x).center(),
    d2 = distance * distance;
  return obj.filter(function() {
    var gbcr = getPageGbcr(this);
    if (isGbcrOutside(ctr, distance, d2, gbcr)) { return !within; }
    if (isGbcrInside(ctr, d2, gbcr)) { return within; }
    var thisctr = getCenterInPageCoordinates(this),
        dx = ctr.pageX - thisctr.pageX,
        dy = ctr.pageY - thisctr.pageY;
    return within === (dx * dx + dy * dy <= d2);
  });
}

//////////////////////////////////////////////////////////////////////////
// JQUERY REGISTRATION
// Register all our hooks.
//////////////////////////////////////////////////////////////////////////

$.extend(true, $, {
  cssHooks: {
    turtlePen: makePenHook(),
    turtleForward: makeTurtleForwardHook(),
    turtlePosition: makeTurtleXYHook('turtlePosition', 'tx', 'ty', true),
    turtlePositionX: makeTurtleHook('tx', identity, 'px', true),
    turtlePositionY: makeTurtleHook('ty', identity, 'px', true),
    turtleRotation: makeTurtleHook('rot', normalizeRotation, 'deg', false),
    turtleScale: makeTurtleXYHook('turtleScale', 'sx', 'sy', false),
    turtleScaleX: makeTurtleHook('sx', identity, '', false),
    turtleScaleY: makeTurtleHook('sy', identity, '', false),
    turtleTwist: makeTurtleHook('twi', normalizeRotation, 'deg', false),
    turtleHull: makeHullHook()
  },
  cssNumber: {
    turtleScale: true,
    turtleScaleX: true,
    turtleScaleY: true,
    turtleTwist: true
  },
  support: {
    turtle: true
  }
});
$.extend(true, $.fx, {
  step: {
    turtlePosition: makePairStep('turtlePosition', true),
    turtleRotation: makeRotationStep('turtleRotation'),
    turtleScale: makePairStep('turtlePosition', false),
    turtleTwist: makeRotationStep('turtleTwist')
  },
  speeds: {
    turtle: 0
  }
});

var turtlefn = {
  rt: function(amount) {
    return this.animate({'turtleRotation': '+=' + amount}, 'turtle');
  },
  lt: function(amount) {
    return this.animate({'turtleRotation': '-=' + amount}, 'turtle');
  },
  fd: function(amount, y) {
    var sideways = 0;
    if (y !== undefined) {
      sideways = amount;
      amount = y;
    }
    // Fast path: do the move directly when there is no animation.
    if (!$.fx.speeds.turtle) {
      return this.each(function(j, elem) {
        var q = $.queue(elem), doqueue = (q && q.length > 0);
        function domove() {
          doQuickMove(elem, amount, sideways);
          if (doqueue) { $.dequeue(elem); }
        }
        if (doqueue) {
          domove.finish = domove;
          q.push(domove);
        } else {
          domove();
        }
      });
    }
    if (!sideways) {
      return this.animate({'turtleForward': '+=' + amount}, 'turtle');
    } else {
      return this.direct(function(j, elem) {
        this.animate({'turtlePosition':
            displacedPosition(elem, amount, sideways)}, 'turtle');
      });
    }
  },
  bk: function(amount) {
    return this.fd(-amount);
  },
  pen: function(penstyle) {
    return this.direct(function(j, elem) {
      this.css('turtlePen', penstyle);
    });
  },
  dot: function(style, diameter) {
    if ($.isNumeric(style) && diameter === undefined) {
      diameter = style;
      style = null;
    }
    if (diameter === undefined) { diameter = 8.8; }
    if (!style) { style = 'black'; }
    var ps = parsePenStyle(style, 'fillStyle');
    return this.direct(function(j, elem) {
      var c = this.center();
      fillDot(c, diameter, ps);
      // Once drawing begins, origin must be stable.
      watchImageToFixOriginOnLoad(elem);
    });
  },
  erase: function(style) {
    if (!style) { style = 'transparent'; }
    var ps = parsePenStyle(style, 'fillStyle');
    return this.direct(function(j, elem) {
      eraseBox(elem, ps);
      // Once drawing begins, origin must be stable.
      watchImageToFixOriginOnLoad(elem);
    });
  },
  img: function (name) {
    var img = nameToImg(name);
    if (!img) return this;
    return this.direct(function() {
      applyImg(this, img);
    });
  },
  reload: function() {
    // Used to reload images to cycle animated gifs.
    return this.direct(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) {
        window.location.reload();
        return;
      }
      if (elem.src) {
        var src = elem.src;
        elem.src = '';
        elem.src = src;
      }
    });
  },
  center: function() {
    if (!this.length) return;
    return getCenterInPageCoordinates(this[0]);
  },
  moveto: function(position, limit, y) {
    if ($.isNumeric(position) && $.isNumeric(limit)) {
      position = { pageX: parseFloat(position), pageY: parseFloat(limit) };
      limit = null;
    }
    var localx = 0, localy = 0;
    if ($.isNumeric(y) && $.isNumeric(limit)) {
      localx = limit;
      localy = y;
      limit = null;
    }
    return this.direct(function(j, elem) {
      var pos = position;
      if (pos && !isPageCoordinate(pos)) { pos = $(pos).center(); }
      if (!pos || !isPageCoordinate(pos)) return this;
      if ($.isWindow(elem)) {
        scrollWindowToDocumentPosition(pos, limit);
        return;
      } else if (elem.nodeType === 9) {
        return;
      }
      setCenterInPageCoordinates(elem, pos, limit, localx, localy);
      // moveto implies a request for a stable origin.
      watchImageToFixOriginOnLoad(elem);
      flushPenState(elem);
    });
  },
  direction: function() {
    if (!this.length) return;
    var elem = this[0], dir;
    if ($.isWindow(elem) || elem.nodeType === 9) return 0;
    return getDirectionOnPage(elem);
  },
  turnto: function(direction, limit) {
    return this.direct(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      var dir = direction;
      if (!$.isNumeric(direction)) {
        var pos = direction, cur = $(elem).center();
        if (pos && !isPageCoordinate(pos)) { pos = $(pos).center(); }
        if (!pos || !isPageCoordinate(pos)) return;
        dir = radiansToDegrees(
            Math.atan2(pos.pageX - cur.pageX, cur.pageY - pos.pageY));
      }
      setDirectionOnPage(elem, dir, limit);
    });
  },
  mirror: function(val) {
    if (val === undefined) {
      // Zero arguments returns true if mirrored.
      var c = $.map(this.css('turtleScale').split(' '), parseFloat),
          p = c[0] * (c.length > 1 ? c[1] : c[0]);
      return (p < 0);
    }
    return this.direct(function(j, elem) {
      var c = $.map($.css(elem, 'turtleScale').split(' '), parseFloat);
      if (c.length === 1) { c.push(c[0]); }
      if ((c[0] * c[1] < 0) === (!val)) {
        c[0] = -c[0];
        this.css('turtleScale', c.join(' '));
      }
    });
  },
  twist: function(val) {
    if (val === undefined) {
      return parseFloat(this.css('turtleTwist'));
    }
    return this.direct(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      this.css('turtleTwist', val);
    });
  },
  scale: function(valx, valy) {
    if (valx === undefined && valy === undefined) {
      return parseFloat(this.css('turtleTwist'));
    }
    var val = '' + cssNum(valx) +
        (valy === undefined ? '' : ' ' + cssNum(valy));
    return this.direct(function(j, elem) {
      if ($.isWindow(elem) || elem.nodeType === 9) return;
      this.css('turtleScale', val);
    });
  },
  shown: function() {
    return this.is(':visible');
  },
  hidden: function() {
    return this.is(':hidden');
  },
  encloses: function(arg, y) {
    if (!this.length || this.hidden()) return false;
    if ($.isNumeric(arg) && $.isNumeric(y)) {
      arg = [{ pageX: arg, pageY: y }];
    }
    if (!arg) return true;
    if (typeof arg === 'string') { arg = $(arg); }
    if (!arg.jquery && !$.isArray(arg)) { arg = [arg]; }
    var elem = this[0],
        gbcr0 = getPageGbcr(elem),
        encloser = null, rectenc = false,
        allok = true, j = 0, k, obj;
    for (; allok && j < arg.length; ++j) {
      obj = arg[j];
      // Optimize the outside-bounding-box case.
      if (isDisjointGbcr(gbcr0, getPageGbcr(obj))) {
        return false;
      }
      if (!encloser) {
        encloser = getCornersInPageCoordinates(elem);
        rectenc = polyMatchesGbcr(encloser, gbcr0);
      }
      // Optimize the rectilinear-encloser case.
      if (rectenc && gbcrEncloses(gbcr0, getPageGbcr(obj))) {
        continue;
      }
      if (isPageCoordinate(obj)) {
        allok &= pointInConvexPolygon(obj, encloser);
      } else {
        allok &= doesConvexPolygonContain(
          encloser, getCornersInPageCoordinates(obj));
      }
    }
    return !!allok;
  },
  touches: function(arg, y) {
    if (this.hidden() || !this.length) { return false; }
    if ($.isNumeric(arg) && $.isNumeric(y)) {
      arg = [{ pageX: arg, pageY: y }];
    }
    if (!arg) return false;
    if (typeof arg === 'string') { arg = $(arg); }
    if (!arg.jquery && !$.isArray(arg)) { arg = [arg]; }
    var elem = this[0],
        gbcr0 = getPageGbcr(elem),
        toucher = null,
        anyok = false, j = 0, k, obj;
    for (;!anyok && j < arg.length; ++j) {
      obj = arg[j];
      // Optimize the outside-bounding-box case.
      if (isDisjointGbcr(gbcr0, getPageGbcr(obj))) {
        continue;
      }
      if (!toucher) {
        toucher = getCornersInPageCoordinates(elem);
      }
      if (isPageCoordinate(obj)) {
        anyok |= pointInConvexPolygon(obj, toucher);
      } else {
        anyok |= doConvexPolygonsOverlap(
          toucher, getCornersInPageCoordinates(obj));
      }
    }
    return !!anyok;
  },
  within: function(distance, x, y) {
    return withinOrNot(this, true, distance, x, y);
  },
  notwithin: function(distance, x, y) {
    return withinOrNot(this, false, distance, x, y);
  },
  direct: function(qname, callback, args) {
    if ($.isFunction(qname)) {
      args = callback;
      callback = qname;
      qname = 'fx';
    }
    // If animation is active, then direct will queue the callback.
    // It will also arrange things so that if the callback enqueues
    // further animations, they are inserted at the same location,
    // so that the callback can expand into several animations,
    // just as an ordinary function call expands into its subcalls.
    function enqueue(elem, index) {
       var animation = (function() {
            var saved = $.queue(this, qname),
                subst = [];
            if (saved[0] === 'inprogress') {
              subst.unshift(saved.shift());
            }
            $.queue(elem, qname, subst);
            action();
            $.merge($.queue(elem, qname), saved);
            $.dequeue(elem, qname);
          }),
          action = animation.finish = (args ?
          (function() { callback.apply($(elem), args); }) :
          (function() { callback.call($(elem), j, elem); }));
      $.queue(elem, qname, animation);
    }
    var elem, sel, length = this.length, j = 0;
    for (; j < length; ++j) {
      elem = this[j];
      // Queue an animation if there is a queue.
      if ($.queue(elem, qname).length) {
        enqueue(elem, j);
      } else if (args) {
        callback.apply($(elem), args);
      } else {
        callback.call($(elem), j, elem);
      }
    }
    return this;
  }
};

$.fn.extend(turtlefn);


//////////////////////////////////////////////////////////////////////////
// TURTLE GLOBAL ENVIRONMENT
// Implements educational support when $.turtle() is called:
// * Looks for an element #id to use as the turtle (id defaults to 'turtle').
// * If not found, does a hatch(id).
// * Turns every #id into a global variable.
// * Sets up globals for "lastclick", "lastmousemove" etc.
// * Sets up global functions for all turtle functions for the main turtle.
// * Sets up a global "tick" function.
// * Sets up a global "speed" function and does a speed(10) by default.
// * Sets up a global "hatch" function to make a new turtle.
//////////////////////////////////////////////////////////////////////////

var turtleGIFUrl = "data:image/gif;base64,R0lGODlhKAAvAPIHAAFsOACSRQ2ZRQySQzCuSBygRQ+DPv///yH5BAlkAAcAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAKAAvAAAD/ni63P4wygVqnVjWQnoBWdgAXdmBYkiaJZpiK0u4ryafNUwYw0AUHFruARgEjkiBcOgAAJ+FwXJSMcwglqwlFcMxskZkIbDNAKwmlOUoQB4JyDK1a7AMxm4k3K3NNlkVRwVteQF4bnVnJR9/J0VihQKHeU4mjCMzhYN5m5EfgE2BeQJ7eoUBkm10RKeGeKQEhGKHfaynpIMCkrF6kxcRRbJuk3o/HcJkGndAsqSnHW/Iv7aoHEDQhaVAeXXA2YvIpYaFUwdnz4S4gxy6b+RYBs+ci0+wUJdNrcSubri6AgMAlhPVT1w0NwbjeBvmoWCehAG6YWFzTBcvNsT2RSxnfM5atlkO3y28BQcWw30cFQBoBYseM5NxtBBZqUkWB4Pbjji5OYVgEmIXHVYqYYBIpmHIOhWqAwoTASlJkKGSSqbLjCUxqjjzRK7PNAqWqrQKYPCrjRYqaWqKKaILPnNrIm40C8OAgQ8cZTIx42Wvjrd+gUkMrIEu4cMLEgAAIfkECWQABwAsAAAAACgALwCCAm04AJJFDZlFDJJDL65IHKBGDIM+////A/54utz+MMoFgKkzy1qIL4AmNoBneuEolqeZqhnbEi+8zagdE8YwEIVOTfewBI5IwZDoAASfBSUzUqlalwcnCgup9pCBQqDKqJy4pAoYTECSzefmtSIQr492N9wld6nDAndhglo5TWcAgXh3dYIXQkuFNHdRa5WMIBiHHwCCbWyKYHUCF10Wf5R2Ah6heHloCqhrqwK1dUBIuHobA61Il2wnvrAAA0+hq4JBRwS1YJpFSR1BHp5JvqUQBncnwMzSd1yyuYG1QHUdzoNr4p3coh0f1KtAUO3KqaLntrXigslrmrERNIZKq3h5AgDMRRCNO3q2BB5pBCbhri7T3rlC9naJ3QaCCtusSpjRYxorBXzMagHFXMcxkajRcGcpVDyFv14V6WYEXkBfIZVAoxCPU82jggY4wWIB0TVGQGEakjMnZFKLUvms6EXwJUwZPFRU8aRIU1OtI6p+HQIW1oQ5RZykdPvWg4EpaYHQxZtlKV8NZP4KZpAAADs=";

var eventfn = { click:1, mouseup:1, mousedown:1, mousemove:1,
    keydown:1, keypress:1, keyup:1 };

var global_turtle = null;
var global_turtle_methods = [];
var attaching_ids = false;
var dollar_turtle_methods = {
  erase: function() { directIfGlobal(function() { $(document).erase() }); },
  tick: function(x, y) { directIfGlobal(function() { tick(x, y); }); },
  speed: function(mps) { directIfGlobal(function() { speed(mps); }); },
  random: random,
  hatch: hatch,
  input: input,
  output: output
};

$.turtle = function turtle(id, options) {
  var exportedsee = false;
  if (!arguments.length) {
    id = 'turtle';
  }
  if (arguments.length == 1 && typeof(id) == 'object' && id &&
      !id.hasOwnProperty('length')) {
    options = id;
    id = 'turtle';
  }
  options = options || {};
  // Clear any previous turtle methods.
  clearGlobalTurtle();
  // Expand any <script type="text/html"> unless htmlscript is false.
  // This is to simplify literal HTML editing within templated editors.
  if (!options.hasOwnProperty('htmlscript') || options.htmlscript) {
    $('script[type="text/html"]').each(function() {
        $(this).replaceWith(
            $(this).html().replace(/^\x3c!\[CDATA\[\n?|\]\]\x3e$/g, ''));
    });
  }
  if (!drawing.ctx && options.hasOwnProperty('subpixel')) {
    drawing.subpixel = parseInt(options.subpixel);
  }
  // Set up global events.
  if (!options.hasOwnProperty('events') || options.events) {
    turtleevents(options.eventprefix);
  }
  // Set up window-scoped event handler methods too.
  if (!options.hasOwnProperty('handlers') || options.handlers) {
    globalizeMethods($(window), eventfn);
  }
  // Set up global objects by id.
  if (!options.hasOwnProperty('ids') || options.ids) {
    turtleids(options.idprefix);
  }
  // Set up global log function.
  if (!options.hasOwnProperty('see') || options.see) {
    exportsee();
    exportedsee = true;
    if (window.addEventListener) {
      window.addEventListener('error', see);
    } else {
      window.onerror = see;
    }
  }
  // Copy $.turtle.* functions into global namespace.
  if (!options.hasOwnProperty('functions') || options.functions) {
    $.extend(window, dollar_turtle_methods);
  }
  // Set turtle speed
  speed(options.hasOwnProperty('speed') ? options.speed : 1);
  // Find or create a turtle if one does not exist.
  var selector = null;
  if (id) {
    selector = $('#' + id);
    if (!selector.length) {
      selector = hatch(id);
    }
  }
  if (selector && !selector.length) { selector = null; }
  // Globalize selected jQuery methods of a singleton turtle.
  if (selector && selector.length === 1 &&
      (!options.hasOwnProperty('global') || options.global)) {
    var extraturtlefn = {
      show:1, hide:1, css:1, fadeIn:1, fadeOut:1, fadeTo:1, fadeToggle:1,
      animate:1, delay:1, stop:1, finish:1, toggle:1, remove:1 };
    var globalfn = $.extend({}, turtlefn, extraturtlefn);
    global_turtle_methods.push.apply(global_turtle_methods,
       globalizeMethods(selector, globalfn));
    global_turtle = selector[0];
    $(document).on('DOMNodeRemoved.turtle', onDOMNodeRemoved);
  }
  // Set up test console.
  if (!options.hasOwnProperty('panel') || options.panel) {
    var retval = null,
        seeopt = {
      title: 'turtle test panel',
      abbreviate: [undefined]
    };
    if (selector) { seeopt.abbreviate.push(selector); }
    if (options.title) {
      seeopt.title = options.title;
    }
    if (options.panelheight) {
      seeopt.height = options.panelheight;
    }
    see.init(seeopt);
    // Return an eval loop hook string if 'see' is exported.
    if (exportedsee) {
      if (window.CoffeeScript) {
        return "see.init(eval(see.cs))";
      } else {
        return see.here;
      }
    }
  }
};

$.extend($.turtle, dollar_turtle_methods);

function globalizeMethods(thisobj, fnames) {
  var replaced = [];
  for (var fname in fnames) {
    if (fnames.hasOwnProperty(fname) && !(fname in window)) {
      replaced.push(fname);
      window[fname] = (function() {
        var method = thisobj[fname], target = thisobj;
        return (function() { return method.apply(target, arguments); });
      })();
    }
  }
  return replaced;
}

function clearGlobalTurtle() {
  global_turtle = null;
  for (var j = 0; j < global_turtle_methods.length; ++j) {
    delete window[global_turtle_methods[j]];
  }
  global_turtle_methods.length = 0;
}

function directIfGlobal(fn) {
  if (global_turtle) {
    $(global_turtle).direct(fn);
  } else {
    fn();
  }
}

function onDOMNodeRemoved(e) {
  // Undefine global variable.
  if (e.target.id && window[e.target.id] && window[e.target.id].jquery &&
      window[e.target.id].length === 1 && window[e.target.id][0] === e.target) {
    delete window[e.target.id];
  }
  // Clear global turtle.
  if (e.target === global_turtle) {
    clearGlobalTurtle();
  }
}

function isCSSColor(color) {
  if (!/^[a-z]+$/i.exec(color)) { return false; }
  var d = document.createElement('div'), unset = d.style.color;
  d.style.color = color;
  return (unset != d.style.color);
}

function createPointerOfColor(color) {
  var c = document.createElement('canvas');
  c.width = 40;
  c.height = 48;
  var ctx = c.getContext('2d');
  ctx.beginPath();
  ctx.moveTo(0,49);
  ctx.lineTo(20,0);
  ctx.lineTo(40,48);
  ctx.lineTo(20,42);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  return c.toDataURL();
}

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"]/g, function(s) {return entityMap[s];});
}

// Turtle creation function.
function hatch(count, spec) {
  if (spec === undefined && !$.isNumeric(count)) {
    spec = count;
    count = 1;
  }
  if (count === 1) {
    // Pass through identical jquery instance in the 1 case.
    return hatchone(typeof spec === 'function' ? spec(0) : spec);
  } else {
    var j = 0, result = [];
    for (; j < count; ++j) {
      result.push(hatchone(typeof spec === 'function' ? spec(j) : spec)[0]);
    }
    return $(result);
  }
}

function nameToImg(name) {
  if (name == 'turtle') return {
    url: turtleGIFUrl,
    css: {
      width: 20,
      height: 24,
      turtleHull: "-8 -5 -8 6 0 -13 8 6 8 -5 0 9",
      transformOrigin: '10px 13px',
      opacity: 0.5
    }
  };
  if (isCSSColor(name)) return {
    url: createPointerOfColor(name),
    css: {
      width: 20,
      height: 24,
      turtleHull: "-10 11 0 -13 10 11",
      transformOrigin: '10px 13px',
      opacity: 0.8
    }
  };
  var openicon =
    /^openicon:\/?\/?([^@\/][^@]*)(?:@(?:(\d+):)?(\d+))?$/.exec(name);
  if (openicon) {
    var openiconName = openicon[1],
        sourceSize = parseInt(openicon[3]),
        targetSize = parseInt(openicon[2]),
        dotloc = openiconName.lastIndexOf('.'),
        openiconType = 'png';
    if (openiconName.indexOf('/') == -1) {
      openiconName = 'others/' + openiconName;
    }
    if (dotloc > 0 && dotloc <= openiconName.length - 4 &&
        dotloc >= openiconName.length - 5) {
      openiconType = openiconName.substring(dotloc + 1);
      openiconName = openiconName.substring(0, dotloc);
    }
    if (!targetSize) {
      targetSize = sourceSize || 24;
    }
    if (!sourceSize) {
      sourceSize = 48;
    }
    return {
      url: 'http://openiconlibrary.sourceforge.net/gallery2/' +
        'open_icon_library-full/icons/' + openiconType + '/' +
        sourceSize + 'x' + sourceSize + '/' +
        openiconName + '.' + openiconType,
      css: {
        width: targetSize,
        height: targetSize,
        opacity: 1
      }
    }
  }
  if (/^(?:https?:\/)?\//i.exec(name)) {
    return {
      url: name,
      css: {
        opacity: 1
      }
    }
  }
  return null;
}

function hatchone(name) {
  var isID = name && /^[a-zA-Z]\w*$/.exec(name),
      isTag = name && /^<.*>$/.exec(name),
      img = nameToImg(name) ||
        (isID || name === undefined) && nameToImg('turtle');

  // Don't overwrite previously existing id.
  if (isID && $('#' + name).length) { isID = false; }

  // Create an image element with the requested name.
  var result;
  if (img) {
    result = $('<img>');
    applyImg(result, img);
  } else if (isTag) {
    result = $(name);
  } else {
    result = $('<div>' + escapeHtml(name) + '</div>');
  }
  result.css({
    'position': 'absolute',
    'display': 'inline-block',
    'top': 0,
    'left': 0
  }).appendTo(getTurtleClipSurface()).moveto(document);

  // Every hatched turtle has class="turtle".
  result.addClass('turtle');

  // Set the id.
  if (isID) {
    result.attr('id', name);
    // Update global variable unless there is a conflict.
    if (attaching_ids && !window.hasOwnProperty(name)) {
      window[name] = result;
    }
  }
  // Move it to the center of the document and export the name as a global.
  return result;
}

// Simplify Math.floor(Math.random() * N) and also random choice.
function random(arg) {
  if (typeof(arg) == 'number') { return Math.floor(Math.random() * arg); }
  if (typeof(arg) == 'object' && arg.length && arg.slice) {
    return arg[Math.floor(Math.random() * arg.length)];
  }
  if (arg == 'normal') {
    // Ratio of uniforms gaussian, from tinyurl.com/9oh2nqg
    var u, v, x, y, q;
    do {
      u = Math.random();
      v = 1.7156 * (Math.random() - 0.5);
      x = u - 0.449871;
      y = Math.abs(v) + 0.386595;
      q = x * x + y * (0.19600 * y - 0.25472 * x);
    } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
    return v / u;
  }
  if (arg == 'position') {
    return {
      pageX: random(dw()),
      pageY: random(dh())
    };
  }
  return Math.random();
}

// Simplify setInterval(fn, 1000) to just tick(fn).
var tickinterval = null;
function tick(rps, fn) {
  fn = arguments.length >= 2 ? fn : rps;
  rps = arguments.length > 1 && $.isNumeric(rps) ? rps : 1;
  if (tickinterval) {
    window.clearInterval(tickinterval);
    tickinterval = null;
  }
  if (fn && rps) {
    tickinterval = window.setInterval(fn, 1000 / rps);
  }
}

// Allow speed to be set in moves per second.
function speed(mps) {
  if (mps === undefined) {
    return 1000 / $.fx.speeds.turtle;
  } else {
    $.fx.speeds.turtle = mps > 0 ? 1000 / mps : 0;
  }
}

// Simplify $('#x').move() to just x.move()
function turtleids(prefix) {
  if (prefix === undefined) {
    prefix = '';
  }
  $('[id]').each(function(j, item) {
    window[prefix + item.id] = $('#' + item.id);
  });
  attaching_ids = true;
}

// Simplify $(window).click(function(e) { x.moveto(e); } to just
// x.moveto(lastclick).
var eventsaver = null;
function turtleevents(prefix) {
  if (prefix === undefined) {
    prefix = 'last';
  }
  if (eventsaver) {
    $(window).off($.map(eventfn, function(x,k) { return k; }).join(' '),
        eventsaver);
  }
  if (prefix || prefix === '') {
    eventsaver = (function(e) {
      window[prefix + e.type] = e;
    });
    $(window).on($.map(eventfn, function(x,k) { return k; }).join(' '),
        eventsaver);
    for (var k in eventfn) {
      if (eventfn.hasOwnProperty(k)) {
        window[prefix + k] = null;
      }
    }
  }
}

// Simplify $('body').append(html).
function output(html) {
  if (html === undefined || html === null) {
    return $('<img>').img('turtle').appendTo('body');
  }
  if (!html || html[0] != '<' || html.indexOf('>') == -1) {
    html = '<div>' + escapeHtml(html) + '</div>';
  }
  return $(html).appendTo('body');
}

// Simplify $('body').append('<input>' + label) and onchange hookup.
function input(name, callback) {
  if ($.isFunction(name) && callback === undefined) {
    callback = name;
    name = null;
  }
  name = $.isNumeric(name) || name ? name : '&rArr;';
  var textbox = $('<input>'),
      label = $(
      '<label style="display:block">' +
      name + '&nbsp;' +
      '</label>').append(textbox),
      thisval = $([textbox[0], label[0]]),
      debounce = null,
      lastseen = textbox.val();
  function dodebounce() {
    if (!debounce) {
      debounce = setTimeout(function() { debounce = null; }, 1000);
    }
  }
  function newval() {
    var val = textbox.val();
    if (debounce && lastseen == val) { return; }
    dodebounce();
    lastseen = val;
    textbox.remove();
    label.append(val);
    if ($.isNumeric(val)) {
      val = parseFloat(val);
    }
    if (callback) { callback.call(thisval, val); }
  }
  function key(e) {
    if (e.which == 13) { newval(); }
  }
  dodebounce();
  textbox.on('keydown', key);
  textbox.on('change', newval);
  $('body').append(label);
  textbox.focus();
  return thisval;
}

//////////////////////////////////////////////////////////////////////////
// SEE LOGGING SUPPORT
// A copy of see.js here.
//////////////////////////////////////////////////////////////////////////

// see.js version 0.2

var pulljQueryVersion = null;  // Disable auto-pull of jQuery

var seepkg = 'see'; // Defines the global package name used.
var version = '0.2';
var oldvalue = noteoldvalue(seepkg);
// Option defaults
var linestyle = 'position:relative;display:block;font-family:monospace;' +
  'word-break:break-all;margin-bottom:3px;padding-left:1em;';
var logdepth = 5;
var autoscroll = false;
var logelement = 'body';
var panel = true;
var see;  // defined below.
var paneltitle = '';
var logconsole = null;
var uselocalstorage = '_loghistory';
var panelheight = 100;
var currentscope = '';
var scopes = {
  '':  { e: window.eval, t: window },
  top: { e: window.eval, t: window }
};
var coffeescript = window.CoffeeScript;
var seejs = '(function(){return eval(arguments[0]);})';

function init(options) {
  if (arguments.length === 0) {
    options = {};
  } else if (arguments.length == 2) {
    var newopt = {};
    newopt[arguments[0]] = arguments[1];
    options = newopt;
  } else if (arguments.length == 1 && typeof arguments[0] == 'function') {
    options = {'eval': arguments[0]};
  }
  if (options.hasOwnProperty('jQuery')) { $ = options.jQuery; }
  if (options.hasOwnProperty('eval')) { scopes[''].e = options['eval']; }
  if (options.hasOwnProperty('this')) { scopes[''].t = options['this']; }
  if (options.hasOwnProperty('element')) { logelement = options.element; }
  if (options.hasOwnProperty('autoscroll')) { autoscroll = options.autoscroll; }
  if (options.hasOwnProperty('linestyle')) { linestyle = options.linestyle; }
  if (options.hasOwnProperty('depth')) { logdepth = options.depth; }
  if (options.hasOwnProperty('panel')) { panel = options.panel; }
  if (options.hasOwnProperty('height')) { panelheight = options.height; }
  if (options.hasOwnProperty('title')) { paneltitle = options.title; }
  if (options.hasOwnProperty('console')) { logconsole = options.console; }
  if (options.hasOwnProperty('history')) { uselocalstorage = options.history; }
  if (options.hasOwnProperty('coffee')) { coffeescript = options.coffee; }
  if (options.hasOwnProperty('abbreviate')) { abbreviate = options.abbreviate; }
  if (options.hasOwnProperty('noconflict')) { noconflict(options.noconflict); }
  if (panel) {
    // panel overrides element and autoscroll.
    logelement = '#_testlog';
    autoscroll = '#_testscroll';
    pulljQuery(tryinitpanel);
  }
  return scope();
}

function scope(name, evalfuncarg, evalthisarg) {
  if (arguments.length <= 1) {
    if (!arguments.length) {
      name = '';
    }
    return seepkg + '.scope(' + cstring(name) + ',' + seejs + ',this)';
  }
  scopes[name] = { e: evalfuncarg, t: evalthisarg };
}

function seeeval(scope, code) {
  if (arguments.length == 1) {
    code = scope;
    scope = '';
  }
  var ef = scopes[''].e, et = scopes[''].t;
  if (scopes.hasOwnProperty(scope)) {
    if (scopes[scope].e) { ef = scopes[scope].e; }
    if (scopes[scope].t) { et = scopes[scope].t; }
  }
  return ef.call(et, code);
}

var varpat = '[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*';
var initialvardecl = new RegExp(
  '^\\s*var\\s+(?:' + varpat + '\\s*,)*' + varpat + '\\s*;\\s*');

function barecs(s) {
  // Compile coffeescript in bare mode.
  var compiler = coffeescript || window.CoffeeScript;
  var compiled = compiler.compile(s, {bare:1});
  if (compiled) {
    // Further strip top-level var decls out of the coffeescript so
    // that assignments can leak out into the enclosing scope.
    compiled = compiled.replace(initialvardecl, '');
  }
  return compiled;
}

function exportsee() {
  see.repr = repr;
  see.html = loghtml;
  see.noconflict = noconflict;
  see.init = init;
  see.scope = scope;
  see.eval = seeeval;
  see.barecs = barecs;
  see.here = 'eval(' + seepkg + '.init())';
  see.clear = clear;
  see.js = seejs;
  see.cs = '(function(){return eval(' + seepkg + '.barecs(arguments[0]));})';
  see.version = version;
  window[seepkg] = see;
}

function noteoldvalue(name) {
  return {
    name: name,
    has: window.hasOwnProperty(name),
    value: window[name],
  };
}

function restoreoldvalue(old) {
  if (!old.has) {
    delete window[old.name];
  } else {
    window[old.name] = old.value;
  }
}

function noconflict(newname) {
  if (!newname || typeof(newname) != 'string') {
    newname = 'see' + (1 + Math.random() + '').substr(2);
  }
  if (oldvalue) {
    restoreoldvalue(oldvalue);
  }
  seepkg = newname;
  oldvalue = noteoldvalue(newname);
  exportsee();
  return see;
}

function pulljQuery(callback) {
  if (!pulljQueryVersion || ($ && $.fn && $.fn.jquery)) {
    callback();
    return;
  }
  function loadscript(src, callback) {
    function setonload(script, fn) {
      script.onload = script.onreadystatechange = fn;
    }
    var script = document.createElement("script"),
       head = document.getElementsByTagName("head")[0],
       pending = 1;
    setonload(script, function() {
      if (pending && (!script.readyState ||
          {loaded:1,complete:1}[script.readyState])) {
        pending = 0;
        callback();
        setonload(script, null);
        head.removeChild(script);
      }
    });
    script.src = src;
    head.appendChild(script);
  }
  loadscript(
      '//ajax.googleapis.com/ajax/libs/jquery/' +
      pulljQueryVersion + '/jquery.min.js',
      function() {
    $ = jQuery.noConflict(true);
    callback();
  });
}

// ---------------------------------------------------------------------
// LOG FUNCTION SUPPORT
// ---------------------------------------------------------------------
var logcss = "input._log:focus{outline:none;}label._log > span:first-of-type:hover{text-decoration:underline;}samp._log > label._log,samp_.log > span > label._log{display:inline-block;vertical-align:top;}label._log > span:first-of-type{margin-left:2em;text-indent:-1em;}label._log > ul{display:none;padding-left:14px;margin:0;}label._log > span:before{content:'';font-size:70%;font-style:normal;display:inline-block;width:0;text-align:center;}label._log > span:first-of-type:before{content:'\\0025B6';}label._log > ul > li{display:block;white-space:pre-line;margin-left:2em;text-indent:-1em}label._log > ul > li > samp{margin-left:-1em;text-indent:0;white-space:pre;}label._log > input[type=checkbox]:checked ~ span{margin-left:2em;text-indent:-1em;}label._log > input[type=checkbox]:checked ~ span:first-of-type:before{content:'\\0025BC';}label._log > input[type=checkbox]:checked ~ span:before{content:'';}label._log,label._log > input[type=checkbox]:checked ~ ul{display:block;}label._log > span:first-of-type,label._log > input[type=checkbox]:checked ~ span{display:inline-block;}label._log > input[type=checkbox],label._log > input[type=checkbox]:checked ~ span > span{display:none;}";
var addedcss = false;
var cescapes = {
  '\0': '\\0', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r',
  '\t': '\\t', '\v': '\\v', "'": "\\'", '"': '\\"', '\\': '\\\\'
};
var retrying = null;
var queue = [];
see = function see() {
  if (logconsole && typeof(logconsole.log) == 'function') {
    logconsole.log.apply(window.console, arguments);
  }
  var args = Array.prototype.slice.call(arguments);
  queue.push('<samp class="_log">');
  while (args.length) {
    var obj = args.shift();
    if (vtype(obj) == 'String')  {
      // Logging a string just outputs the string without quotes.
      queue.push(htmlescape(obj));
    } else {
      queue.push(repr(obj, logdepth, queue));
    }
    if (args.length) { queue.push(' '); }
  }
  queue.push('</samp>');
  flushqueue();
};

function loghtml(html) {
  queue.push('<samp class="_log">');
  queue.push(html);
  queue.push('</samp>');
  flushqueue();
}

function vtype(obj) {
  var bracketed = Object.prototype.toString.call(obj);
  var vt = bracketed.substring(8, bracketed.length - 1);
  if (vt == 'Object') {
    if ('length' in obj && 'slice' in obj && 'number' == typeof obj.length) {
      return 'Array';
    }
    if ('originalEvent' in obj && 'target' in obj && 'type' in obj) {
      return vtype(obj.originalEvent);
    }
  }
  return vt;
}

function isprimitive(vt) {
  switch (vt) {
    case 'String':
    case 'Number':
    case 'Boolean':
    case 'Undefined':
    case 'Date':
    case 'RegExp':
    case 'Null':
      return true;
  }
  return false;
}

function isdom(obj) {
  return (obj.nodeType && obj.nodeName && typeof(obj.cloneNode) == 'function');
}

function midtruncate(s, maxlen) {
  if (maxlen && maxlen > 3 && s.length > maxlen) {
    return s.substring(0, Math.floor(maxlen / 2) - 1) + '...' +
        s.substring(s.length - (Math.ceil(maxlen / 2) - 2));
  }
  return s;
}

function cstring(s, maxlen) {
  function cescape(c) {
    if (cescapes.hasOwnProperty(c)) {
      return cescapes[c];
    }
    var temp = '0' + c.charCodeAt(0).toString(16);
    return '\\x' + temp.substring(temp.length - 2);
  }
  if (s.indexOf('"') == -1 || s.indexOf('\'') != -1) {
    return midtruncate('"' +
        htmlescape(s.replace(/[\0-\x1f\x7f-\x9f"\\]/g, cescape)) + '"', maxlen);
  } else {
    return midtruncate("'" +
        htmlescape(s.replace(/[\0-\x1f\x7f-\x9f'\\]/g, cescape)) + "'", maxlen);
  }
}
function tiny(obj, maxlen) {
  var vt = vtype(obj);
  if (vt == 'String') { return cstring(obj, maxlen); }
  if (vt == 'Undefined' || vt == 'Null') { return vt.toLowerCase(); }
  if (isprimitive(vt)) { return '' + obj; }
  if (vt == 'Array' && obj.length === 0) { return '[]'; }
  if (vt == 'Object' && isshort(obj)) { return '{}'; }
  if (isdom(obj) && obj.nodeType == 1) {
    if (obj.hasAttribute('id')) {
      return obj.tagName.toLowerCase() +
          '#' + htmlescape(obj.getAttribute('id'));
    } else {
      if (obj.hasAttribute('class')) {
        var classname = obj.getAttribute('class').split(' ')[0];
        if (classname) {
          return obj.tagName.toLowerCase() + '.' + htmlescape(classname);
        }
      }
      return obj.tagName.toLowerCase();
    }
  }
  return vt;
}
function isnonspace(dom) {
  return (dom.nodeType != 3 || /[^\s]/.exec(dom.textContent));
}
function trimemptystartline(s) {
  return s.replace(/^\s*\n/, '');
}
function isshort(obj, shallow, maxlen) {
  var vt = vtype(obj);
  if (isprimitive(vt)) { return true; }
  if (!shallow && vt == 'Array') { return !maxlen || obj.length <= maxlen; }
  if (isdom(obj)) {
    if (obj.nodeType == 9 || obj.nodeType == 11) return false;
    if (obj.nodeType == 1) {
      return (obj.firstChild === null ||
         obj.firstChild.nextSibling === null &&
         obj.firstChild.nodeType == 3 &&
         obj.firstChild.textContent.length <= maxlen);
    }
    return true;
  }
  if (vt == 'Function') {
    var sc = obj.toString();
    return (sc.length - sc.indexOf('{') <= maxlen);
  }
  if (vt == 'Error') {
    return !!obj.stack;
  }
  var count = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      count += 1;
      if (shallow && !isprimitive(vtype(obj[prop]))) { return false; }
      if (maxlen && count > maxlen) { return false; }
    }
  }
  return true;
}
function domsummary(dom, maxlen) {
  var short;
  if ('outerHTML' in dom) {
    short = isshort(dom, true, maxlen);
    var html = dom.cloneNode(short).outerHTML;
    var tail = null;
    if (!short) {
      var m = /^(.*)(<\/[^\s]*>$)/.exec(html);
      if (m) {
        tail = m[2];
        html = m[1];
      }
    }
    return [htmlescape(html), tail && htmlescape(tail)];
  }
  if (dom.nodeType == 1) {
    var parts = ['<' + dom.tagName];
    for (var j = 0; j < dom.attributes.length; ++j) {
      parts.push(domsummary(dom.attributes[j], maxlen)[0]);
    }
    short = isshort(dom, true, maxlen);
    if (short && dom.firstChild) {
      return [htmlescape(parts.join(' ') + '>' +
          dom.firstChild.textContent + '</' + dom.tagName + '>'), null];
    }
    return [htmlescape(parts.join(' ') + (dom.firstChild? '>' : '/>')),
        !dom.firstChild ? null : htmlescape('</' + dom.tagName + '>')];
  }
  if (dom.nodeType == 2) {
    return [htmlescape(dom.name + '="' +
        htmlescape(midtruncate(dom.value, maxlen), '"') + '"'), null];
  }
  if (dom.nodeType == 3) {
    return [htmlescape(trimemptystartline(dom.textContent)), null];
  }
  if (dom.nodeType == 4) {
    return ['<![CDATA[' + htmlescape(midtruncate(dom.textContent, maxlen)) +
        ']]>', null];
  }
  if (dom.nodeType == 8) {
    return ['<!--' + htmlescape(midtruncate(dom.textContent, maxlen)) +
        '-->', null];
  }
  if (dom.nodeType == 10) {
    return ['<!DOCTYPE ' + htmlescape(dom.nodeName) + '>', null];
  }
  return [dom.nodeName, null];
}
function summary(obj, maxlen) {
  var vt = vtype(obj);
  if (isprimitive(vt)) {
    return tiny(obj, maxlen);
  }
  if (isdom(obj)) {
    var ds = domsummary(obj, maxlen);
    return ds[0] + (ds[1] ? '...' + ds[1] : '');
  }
  if (vt == 'Function') {
    var ft = obj.toString();
    if (ft.length - ft.indexOf('{') > maxlen) {
      ft = ft.replace(/\{(?:.|\n)*$/, '').trim();
    }
    return ft;
  }
  if ((vt == 'Error' || vt == 'ErrorEvent') && 'message' in obj) {
    return obj.message;
  }
  var pieces = [];
  if (vt == 'Array' && obj.length < maxlen) {
    var identical = (obj.length > 1);
    var firstobj = identical && obj[0];
    for (var j = 0; j < obj.length; ++j) {
      if (identical && obj[j] !== firstobj) { identical = false; }
      pieces.push(tiny(obj[j], maxlen));
    }
    if (identical) {
      return '[' + tiny(firstobj, maxlen) + '] \xd7 ' + obj.length;
    }
    return '[' + pieces.join(', ') + ']';
  } else if (isshort(obj, false, maxlen)) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        pieces.push(quotekey(key) + ': ' + tiny(obj[key], maxlen));
      }
    }
    return (vt == 'Object' ? '{' : vt + '{') + pieces.join(', ') + '}';
  }
  if (vt == 'Array') { return 'Array(' + obj.length + ')'; }
  return vt;
}
function quotekey(k) {
  if (/^\w+$/.exec(k)) { return k; }
  return cstring(k);
}
function htmlescape(s, q) {
  var pat = /[<>&]/g;
  if (q) { pat = new RegExp('[<>&' + q + ']', 'g'); }
  return s.replace(pat, function(c) {
    return c == '<' ? '&lt;' : c == '>' ? '&gt;' : c == '&' ? '&amp;' :
           c == '"' ? '&quot;' : '&#' + c.charCodeAt(0) + ';';
  });
}
function unindented(s) {
  s = s.replace(/^\s*\n/, '');
  var leading = s.match(/^\s*\S/mg);
  var spaces = leading.length && leading[0].length - 1;
  var j = 1;
  // If the block begins with a {, ignore those spaces.
  if (leading.length > 1 && leading[0].trim() == '{') {
    spaces = leading[1].length - 1;
    j = 2;
  }
  for (; j < leading.length; ++j) {
    spaces = Math.min(leading[j].length - 1, spaces);
    if (spaces <= 0) { return s; }
  }
  var removal = new RegExp('^\\s{' + spaces + '}', 'mg');
  return s.replace(removal, '');
}
function expand(prefix, obj, depth, output) {
  output.push('<label class="_log"><input type="checkbox"><span>');
  if (prefix) { output.push(prefix); }
  if (isdom(obj)) {
    var ds = domsummary(obj, 10);
    output.push(ds[0]);
    output.push('</span><ul>');
    for (var node = obj.firstChild; node; node = node.nextSibling) {
      if (isnonspace(node)) {
        if (node.nodeType == 3) {
          output.push('<li><samp>');
          output.push(unindented(node.textContent));
          output.push('</samp></li>');
        } else if (isshort(node, true, 20) || depth <= 1) {
          output.push('<li>' + summary(node, 20) + '</li>');
        } else {
          expand('', node, depth - 1, output);
        }
      }
    }
    output.push('</ul>');
    if (ds[1]) {
      output.push('<span>');
      output.push(ds[1]);
      output.push('</span>');
    }
    output.push('</label>');
  } else {
    output.push(summary(obj, 10));
    output.push('</span><ul>');
    var vt = vtype(obj);
    if (vt == 'Function') {
      var ft = obj.toString();
      var m = /\{(?:.|\n)*$/.exec(ft);
      if (m) { ft = m[0]; }
      output.push('<li><samp>');
      output.push(htmlescape(unindented(ft)));
      output.push('</samp></li>');
    } else if (vt == 'Error') {
      output.push('<li><samp>');
      output.push(htmlescape(obj.stack));
      output.push('</samp></li>');
    } else if (vt == 'Array') {
      for (var j = 0; j < Math.min(100, obj.length); ++j) {
        try {
          val = obj[j];
        } catch(e) {
          val = e;
        }
        if (isshort(val, true, 20) || depth <= 1 || vtype(val) == 'global') {
          output.push('<li>' + j + ': ' + summary(val, 100) + '</li>');
        } else {
          expand(j + ': ', val, depth - 1, output);
        }
      }
      if (obj.length > 100) {
        output.push('<li>length=' + obj.length + ' ...</li>');
      }
    } else {
      var count = 0;
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          count += 1;
          if (count > 100) { continue; }
          var val;
          try {
            val = obj[key];
          } catch(e) {
            val = e;
          }
          if (isshort(val, true, 20) || depth <= 1 || vtype(val) == 'global') {
            output.push('<li>');
            output.push(quotekey(key));
            output.push(': ');
            output.push(summary(val, 100));
            output.push('</li>');
          } else {
            expand(quotekey(key) + ': ', val, depth - 1, output);
          }
        }
      }
      if (count > 100) {
        output.push('<li>' + count + ' properties total...</li>');
      }
    }
    output.push('</ul></label>');
  }
}
function initlogcss() {
  if (!addedcss && !window.document.getElementById('_logcss')) {
    var style = window.document.createElement('style');
    style.id = '_logcss';
    style.innerHTML = (linestyle ? 'samp._log{' +
        linestyle + '}' : '') + logcss;
    window.document.head.appendChild(style);
    addedcss = true;
  }
}
function repr(obj, depth, aoutput) {
  depth = depth || 3;
  var output = aoutput || [];
  var vt = vtype(obj);
  if (vt == 'Error' || vt == 'ErrorEvent') {
    output.push('<span style="color:red;">');
    expand('', obj, depth, output);
    output.push('</span>');
  } else if (isprimitive(vt)) {
    output.push(tiny(obj));
  } else if (isshort(obj, true, 100) || depth <= 0) {
    output.push(summary(obj, 100));
  } else {
    expand('', obj, depth, output);
  }
  if (!aoutput) {
    return output.join('');
  }
}
function aselement(s, def) {
  switch (typeof s) {
    case 'string':
      if (s == 'body') { return document.body; }
      if (document.querySelector) { return document.querySelector(s); }
      if ($) { return $(s)[0]; }
      return null;
    case 'undefined':
      return def;
    case 'boolean':
      if (s) { return def; }
      return null;
    default:
      return s;
  }
  return null;
}
function stickscroll() {
  var stick = false, a = aselement(autoscroll, null);
  if (a) {
    stick = a.scrollHeight - a.scrollTop - 10 <= a.clientHeight;
  }
  if (stick) {
    return (function() {
      a.scrollTop = a.scrollHeight - a.clientHeight;
    });
  } else {
    return (function() {});
  }
}
function flushqueue() {
  var elt = aselement(logelement, null);
  if (elt && elt.appendChild && queue.length) {
    initlogcss();
    var temp = window.document.createElement('samp');
    temp.innerHTML = queue.join('');
    queue.length = 0;
    var complete = stickscroll();
    while ((child = temp.firstChild)) {
      elt.appendChild(child);
    }
    complete();
  }
  if (!retrying && queue.length) {
    retrying = setTimeout(function() { timer = null; flushqueue(); }, 100);
  } else if (retrying && !queue.length) {
    clearTimeout(retrying);
    retrying = null;
  }
}

// ---------------------------------------------------------------------
// TEST PANEL SUPPORT
// ---------------------------------------------------------------------
var addedpanel = false;
var inittesttimer = null;
var abbreviate = [{}.undefined];

function show(flag) {
  if (!addedpanel) { return; }
  if (arguments.length === 0 || flag) {
    $('#_testpanel').show();
  } else {
    $('#_testpanel').hide();
  }
}
function clear() {
  if (!addedpanel) { return; }
  $('#_testlog').find('._log').not('#_testpaneltitle').remove();
}
function promptcaret(color) {
  return '<samp style="position:absolute;left:0;font-size:120%;color:' + color +
      ';">&gt;</samp>';
}
function getSelectedText(){
    if(window.getSelection) { return window.getSelection().toString(); }
    else if(document.getSelection) { return document.getSelection(); }
    else if(document.selection) {
        return document.selection.createRange().text; }
}
function formattitle(title) {
  return '<samp class="_log" id="_testpaneltitle" style="font-weight:bold;">' +
      title + '</samp>';
}
function readlocalstorage() {
  if (!uselocalstorage) {
    return;
  }
  var state = { height: panelheight, history: [] };
  try {
    var result = window.JSON.parse(window.localStorage[uselocalstorage]);
    if (result && result.slice && result.length) {
      // if result is an array, then it's just the history.
      state.history = result;
      return state;
    }
    $.extend(state, result);
  } catch(e) {
  }
  return state;
}
function updatelocalstorage(state) {
  if (!uselocalstorage) {
    return;
  }
  var stored = readlocalstorage(), changed = false;
  if ('history' in state &&
      state.history.length &&
      (!stored.history.length ||
      stored.history[stored.history.length - 1] !==
      state.history[state.history.length - 1])) {
    stored.history.push(state.history[state.history.length - 1]);
    changed = true;
  }
  if ('height' in state && state.height !== stored.height) {
    stored.height = state.height;
    changed = true;
  }
  if (changed) {
    window.localStorage[uselocalstorage] = window.JSON.stringify(stored);
  }
}
function wheight() {
  return window.innerHeight || $(window).height();
}
function tryinitpanel() {
  if (addedpanel) {
    if (paneltitle) {
      if ($('#_testpaneltitle').length) {
        $('#_testpaneltitle').html(paneltitle);
      } else {
        $('#_testlog').prepend(formattitle(paneltitle));
      }
    }
  } else {
    if (!window.document.getElementById('_testlog') && window.document.body) {
      initlogcss();
      var state = readlocalstorage();
      var titlehtml = (paneltitle ? formattitle(paneltitle) : '');
      if (state.height > wheight() - 50) {
        state.height = Math.min(wheight(), Math.max(10, wheight() - 50));
      }
      $('body').prepend(
        '<samp id="_testpanel" style="overflow:hidden;' +
            'position:fixed;bottom:0;left:0;width:100%;height:' + state.height +
            'px;background:rgba(240,240,240,0.8);' +
            'font:10pt monospace;' +
            // This last bit works around this position:fixed bug in webkit:
            // https://code.google.com/p/chromium/issues/detail?id=128375
            '-webkit-transform:translateZ(0);">' +
          '<samp id="_testdrag" style="' +
              'cursor:row-resize;height:6px;width:100%;' +
              'display:block;background:lightgray"></samp>' +
          '<samp id="_testscroll" style="overflow-y:scroll;overflow-x:hidden;' +
             'display:block;width:100%;height:' + (state.height - 6) + 'px;">' +
            '<samp id="_testlog" style="display:block">' +
            titlehtml + '</samp>' +
            '<samp style="position:relative;display:block;">' +
            promptcaret('blue') +
            '<input id="_testinput" class="_log" style="width:100%;' +
                'padding-left:1em;margin:0;border:0;font:inherit;' +
                'background:rgba(255,255,255,0.8);">' +
           '</samp>' +
        '</samp>');
      addedpanel = true;
      flushqueue();
      var historyindex = 0;
      var historyedited = {};
      $('#_testinput').on('keydown', function(e) {
        if (e.which == 13) {
          // Handle the Enter key.
          var text = $(this).val();
          $(this).val('');
          // Save (nonempty, nonrepeated) commands to history and localStorage.
          if (text.trim().length &&
              (!state.history.length ||
               state.history[state.history.length - 1] !== text)) {
            state.history.push(text);
            updatelocalstorage({ history: [text] });
          }
          // Reset up/down history browse state.
          historyedited = {};
          historyindex = 0;
          // Copy the entered prompt into the log, with a grayed caret.
          loghtml('<samp class="_log" style="margin-left:-1em;">' +
                  promptcaret('lightgray') +
                  htmlescape(text) + '</samp>');
          $(this).select();
          // Deal with the ":scope" command
          if (text.trim().length && text.trim()[0] == ':') {
            var scopename = text.trim().substring(1).trim();
            if (!scopename || scopes.hasOwnProperty(scopename)) {
              currentscope = scopename;
              var desc = scopename ? 'scope ' + scopename : 'default scope';
              loghtml('<span style="color:blue">switched to ' + desc + '</span>');
            } else {
              loghtml('<span style="color:red">no scope ' + scopename + '</span>');
            }
            return;
          }
          // Actually execute the command and log the results (or error).
          try {
            var result = seeeval(currentscope, text);
            for (var j = abbreviate.length - 1; j >= 0; --j) {
              if (result === abbreviate[j]) break;
            }
            if (j < 0) {
              loghtml(repr(result));
            }
          } catch (e) {
            see(e);
          }
        } else if (e.which == 38 || e.which == 40) {
          // Handle the up and down arrow keys.
          // Stow away edits in progress (without saving to history).
          historyedited[historyindex] = $(this).val();
          // Advance the history index up or down, pegged at the boundaries.
          historyindex += (e.which == 38 ? 1 : -1);
          historyindex = Math.max(0, Math.min(state.history.length,
              historyindex));
          // Show the remembered command at that slot.
          var newval = historyedited[historyindex] ||
              state.history[state.history.length - historyindex];
          if (typeof newval == 'undefined') { newval = ''; }
          $(this).val(newval);
          this.selectionStart = this.selectionEnd = newval.length;
          e.preventDefault();
        }
      });
      $('#_testdrag').on('mousedown', function(e) {
        var drag = this,
            dragsum = $('#_testpanel').height() + e.pageY,
            barheight = $('#_testdrag').height(),
            dragwhich = e.which,
            dragfunc;
        if (drag.setCapture) { drag.setCapture(true); }
        dragfunc = function dragresize(e) {
          if (e.type != 'blur' && e.which == dragwhich) {
            var winheight = wheight();
            var newheight = Math.max(barheight, Math.min(winheight,
                dragsum - e.pageY));
            var complete = stickscroll();
            $('#_testpanel').height(newheight);
            $('#_testscroll').height(newheight - barheight);
            complete();
          }
          if (e.type == 'mouseup' || e.type == 'blur' ||
              e.type == 'mousemove' && e.which != dragwhich) {
            $(window).off('mousemove mouseup blur', dragfunc);
            if (document.releaseCapture) { document.releaseCapture(); }
            if ($('#_testpanel').height() != state.height) {
              state.height = $('#_testpanel').height();
              updatelocalstorage({ height: state.height });
            }
          }
        };
        $(window).on('mousemove mouseup blur', dragfunc);
        return false;
      });
      $('#_testpanel').on('mouseup', function(e) {
        if (getSelectedText()) { return; }
        // Focus without scrolling.
        var scrollpos = $('#_testscroll').scrollTop();
        $('#_testinput').focus();
        $('#_testscroll').scrollTop(scrollpos);
      });
    }
  }
  if (inittesttimer && addedpanel) {
    clearTimeout(inittesttimer);
  } else if (!addedpanel && !inittesttimer) {
    inittesttimer = setTimeout(tryinitpanel, 100);
  }
}

})(jQuery);
