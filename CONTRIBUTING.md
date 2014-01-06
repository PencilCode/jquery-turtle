jquery-turtle is currently a single monolithic javascript file.
The build minifies the code and runs unit tests using a headless
webkit.

To set up a working build and test environment, you need git, nodejs,
and grunt.

<pre>
sudo apt-get install git
sudo apt-get install nodejs
sudo npm install -g grunt-cli
git clone https://github.com/PencilCode/jquery-turtle.git
cd jquery-turtle
npm install
grunt
</pre>

The default grunt target will run minification and unit tests.
