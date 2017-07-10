var gulp = require("gulp"),
config 		= require("./gulp-tasks/config.json"),
requireDir  = require("require-dir"),
chalk 		= require("chalk"); 
requireDir("./gulp-tasks", {recurse: true});

//default server with nodemon and watch
gulp.task("default", ["start","Watch"], function() {
	console.log(chalk.blue('Server listening with tasks:'),chalk.green(' Start'),chalk.red(' &&'),chalk.green(' Watch'))
});


gulp.task("merge", ["jsLint","joinJs"], function(){});