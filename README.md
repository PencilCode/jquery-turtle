jQuery-turtle
=============

version 2.0.0

jQuery-turtle is a jQuery plugin for turtle graphics.

With jQuery-turtle, every DOM element is a turtle that can be
moved using LOGO-inspired turtle methods like fd, bk, rt, and lt.
<pre>
  $('#myelt').pen('red').rt(90).fd(100).lt(90).bk(50).fadeOut();
</pre>
The plugin also provides functions to help in a rotated,
scaled, and transformed world where nested elements may be
transformed: hit testing and collision testing, absolute
positioning and absolute direction reading and setting.

The plugin sets up low-level CSS hooks for synthetic CSS
properties that can be animated or used to directly manipulate
turtle geometry at a basic mathematical level.  Under the covers,
CSS3 2D transforms and jQuery animations are used to execute
and store turtle movement.  So jQuery-turtle interacts well with
other jQuery animations or direct uses of 2D CSS3 transforms.

A high-level educational environment is enabled by $.turtle().
That call creates a set of global objects and functions designed
as a teaching tool for beginners.  These include a default
turtle and global functions to control it; an onpage debugger
panel; jQuery instances for every object with an #id; simplified
globals to access recent mouse and keyboard events, and simplified
functions for randomness, timers, animation control, and creation
of new turtles.  The jQuery teaching environment has been developed
to support a curriculum for young students.

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
  $(x).bg('pink')   // Shorthand for css("background", "pink")
  $(x).moveto({pageX: 40, pageY: 140})  // Absolute motion in page coordinates.
  $(x).turnto(heading || position)      // Absolute heading adjustment.
  $(x).scale(1.5)   // Scales the element up to 150% size.
  $(x).twist(180)   // Changes which direction is considered "forward".
  $(x).mirror(true) // Flips the turtle across its direction axis.
  $(x).reload()     // Reloads the turtle's image (restarting animated gifs)
  // Methods below this line do not queue for animation.
  $(x).center()     // Page coordinate position of transform-origin.
  $(x).direction()  // Absolute heading taking into account nested transforms.
  $(x).shown()      // Shorthand for is(":visible")
  $(x).hidden()     // Shorthand for !is(":visible")
  $(x).touches(y)   // Collision tests elements (uses turtleHull if present).
  $(x).encloses(y)  // Containment collision test.
</pre>
When $.fx.speeds.turtle is nonzero (the default is zero unless
$.turtle() is called), the first four movement functions animate
at that speed, and the remaining mutators also participate in the
animation queue.  Note that when using predicates such as
touches(), queuing will mess up the logic because the predicate
will not queue, so when making a game with hit testing,
$.fx.speed.turtle should be set to 0 so that movement is
synchronous and instantaneous.  The absolute motion methods
moveto and turnto accept any argument with pageX and pageY,
including, usefully, mouse events.

JQuery CSS Hooks for Turtle Geometry
------------------------------------

Low-level Turtle-oriented 2d transform cssHooks, with animation
support on all motion:
<pre>
  $(x).css('turtlePosition', '30 40');   // position in local coordinates.
  $(x).css('turtlePositionX', '30');     // x component.
  $(x).css('turtlePositionY', '40');     // y component.
  $(x).css('turtleRotation', '90');      // rotation in degrees.
  $(x).css('turtleScale', '2');          // double the size of any element.
  $(x).css('turtleScaleX', '2');         // x stretch before rotate after twist.
  $(x).css('turtleScaleY', '2');         // y stretch before rotate after twist.
  $(x).css('turtleTwist', '45');         // turn before stretching.
  $(x).css('turtleDisplacement', '50');  // position in direction of rotation.
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
of x-y coordinates relative to the object's transformOrigin.  If set to
'auto' (the default) the hull is just the bounding box for the element.

Turtle Teaching Environment
---------------------------

An optional teaching environment setup is created by $.turtle().
It provides easy packaging for the above functionality.

After $.turtle():
  * An &lt;img id="turtle"&gt; is created if #turtle doesn't already exist.
  * An eval debugging panel (see.js) is shown at the bottom of the screen.
  * Turtle methods on the default turtle are packaged as globals, e.g., fd(10).
  * Every #id element is turned into a global variable: window.id = $('#id').
  * Globals are set up to save events: "lastclick", "lastmousemove", etc.
  * speed(movesPerSec) adjusts $.fx.speeds.turtle in a way suitable for kids.
  * Default turtle animation is set to 10 moves per sec so steps can be seen.
  * tick([ticksPerSec,] fn) is an easier-to-call setInterval.
  * random(lessThanThisInteger || array) is an easy alternative to Math.random.
  * hatch() creates and returns a new turtle.
  * see(a, b, c) logs tree-expandable data into the debugging panel.

The turtle teaching environment is designed to work well with either
Javascript or CoffeeScript.  The turtle library is especially compelling
as a teaching tool when used with CoffeeScript.

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

