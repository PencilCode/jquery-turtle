jQuery-turtle
=============

version 2.0

jQuery-turtle is a jQuery plugin that provides turtle graphics.
It is designed to provide easy access to advanced geometry for
students who are learning: it handles the math of 2d transforms,
usage of canvas, and accurate hit-testing.

The plugin provides three levels of functionality.  The first two
levels are cleanly encapsulated and useful for general programming.
The third level pollutes the global namespace with a few dozen
functions and other global objects to make concepts easier to learn.
These global functions are enabled only when you call the function
$.turtle().

JQuery CSS Hooks for Turtle Geometry
------------------------------------

Turtle-oriented 2d transform cssHooks, with animation support on all motion:
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
  $(x).css('turtleHull', '5 0 0 5 0 -5');// fine-tune shape for hit-testing.

Arbitrary 2d transforms are supported, including transforms of elements
nested within other elements that have css transforms. Transforms are
automatically decomposed to turtle components when necessary.
A canvas is supported for drawing, but only created when used.

JQuery Method extensions for Turtle Movement
--------------------------------------------

Turtle-oriented methods taking advantage of the css support:
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


Turtle Teaching Environment
---------------------------

An optional teaching environment setup invoked by $.turtle() that provides
easy packaging for the above functionality.  After $.turtle():
  * an <img id="turtle"> is created if #turtle doesn't already ist.
  * an eval debugging panel (see.js) is shown at the bottom of the screen.
  * turtle methods on the default turtle are packaged as globals, e.g., fd(10).
  * every #id element is turned into a global variable, window.id = $('#id').
  * globals are set up to save events: "lastclick", "lastmousemove", etc.
  * speed(movespersec) adjusts $.fx.speeds.turtle in a way suitable for kids.
  * tick([repspersec], fn) is an easier-to-call setInterval.
  * random(lessthanthisinteger || array) is an easy alternative to Math.random.
  * hatch(turtlename) creates another new turtle with another name.
  * see(a, b, c) logs data into the debugging panel.
