jQuery-turtle
=============

version 2.0

jQuery-turtle is a jQuery plugin that provides turtle graphics.
It is designed to provide easy access to advanced geometry for
students who are learning: it handles the math of 2d transforms,
usage of canvas, and accurate hit-testing.

The programming model is that every DOM element is a turtle that
can be moved using fd, bk, rt, lt, etc.  CSS transforms are used
to do the movement.

The plugin provides three levels of functionality.  The lowest
level are CSS hooks that are for advanced use.  The second level
is a set of turtle movement functions that can be used on any
jQuery object.  These functions are useful for general 2d transform
support and animation.  The third level is a set of functions
expressly designed for learning beginners.  The third level
populates the global namespace with a handful of functions and
other global objects to make programming concepts easier to
learn.  These global functions are set up only when you call the
function $.turtle().

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
  $(x).css('turtleScaleX', '2');         // y stretch before rotate after twist.
  $(x).css('turtleTwist', '45');         // turn before stretching.
  $(x).css('turtleDisplacement', '50');  // position in direction of rotation.
  $(x).css('turtlePen', 'red');          // or 'red lineWidth 2px' etc.
  $(x).css('turtleHull', '5 0 0 5 0 -5');// fine-tune shape for collisions.
</pre>

Arbitrary 2d transforms are supported, including transforms of elements
nested within other elements that have css transforms. Transforms are
automatically decomposed to turtle components when necessary.
A canvas is supported for drawing, but only created when the pen is
used.  A convex hull polygon can be set to be used by the collision
detection and hit-testing functions below.

JQuery Method extensions for Turtle Movement
--------------------------------------------

Turtle-oriented methods taking advantage of the css support:
<pre>
  $(x).fd(100)  // Forward relative motion in local coordinates.
  $(x).bk(50)   // Back.
  $(x).rt(90)   // Right turn.
  $(x).lt(45)   // Left turn.
  $(x).moveto({pageX: 40, pageY: 140})  // Absolute motion in page coordinates.
  $(x).center()     // Page coordinate position of transform-origin.
  $(x).turnto(heading || position)      // Absolute heading adjustment.
  $(x).direction()  // Absolute heading taking into account nested transforms.
  $(x).twist(180)   // Changes which direction is considered "forward".
  $(x).mirror(true) // Flips the turtle across its direction axis.
  $(x).shown()      // Shorthand for is(":visible")
  $(x).hidden()     // Shorthand for !is(":visible")
  $(x).pen('red')   // Sets a pen style, or 'none' for no drawing.
  $(x).dot()        // Draws a dot.
  $(x).reload()     // Reloads the turtle's image (restarting animated gifs)
  $(x).erase()      // Erases under the turtle.
  $(x).touches(y)   // Collision tests elements (uses turtleHull if present).
  $(x).encloses(y)  // Containment collision test.
</pre>
When $.fx.speeds.turtle is nonzero (the default is zero unless
$.turtle() is called), the first four movement functions animate
at that speed, and the remaining mutators also participate in the
animation queue.  Note that when using predicates such as
touches(), queuing will mess up the logic because the predicate
will not queue.  When making a game with hit testing,
$.fx.speed.turtle should be set to 0 so that movement is
synchronous and instantaneous.

Turtle Teaching Environment
---------------------------

An optional teaching environment setup is created by $.turtle().
It provides easy packaging for the above functionality.

After $.turtle():
  * An &lt;img id="turtle"&gt; is created if #turtle doesn't already exist.
  * An eval debugging panel (see.js) is shown at the bottom of the screen.
  * Turtle methods on the default turtle are packaged as globals, e.g., fd(10).
  * Every #id element is turned into a global variable, window.id = $('#id').
  * Globals are set up to save events: "lastclick", "lastmousemove", etc.
  * speed(movespersec) adjusts $.fx.speeds.turtle in a way suitable for kids.
  * tick([repspersec], fn) is an easier-to-call setInterval.
  * random(lessthanthisinteger || array) is an easy alternative to Math.random.
  * hatch(turtlename) creates another new turtle with another name.
  * see(a, b, c) logs data into the debugging panel.

The turtle teaching environment is designed to work well with either
Javascript or CoffeeScript.

