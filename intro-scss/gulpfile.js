const gulp = require("gulp");
const clean = require("del");
const htmlMin = require("gulp-htmlmin");
const cssMin = require("gulp-csso");
const jsUglify = require("gulp-uglify");
const babel = require("gulp-babel");
const autoPrefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const replace = require("gulp-html-replace");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");

gulp.task("clean", function () {
  return clean("./build");
});

gulp.task("html", function () {
  return gulp.src("./src/**/*.html")
    .pipe(replace({
      javascript: "js/script.min.js"
    }))
    .pipe(htmlMin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest("./build"));
});

gulp.task("scss", function () {
  return gulp.src("./src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer())
    .pipe(cssMin())
    .pipe(gulp.dest("./build/css"));
});

gulp.task("javascript", function () {
  return gulp.src("./src/js/*.js")
    .pipe(concat("script.min.js"))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(jsUglify())
    .pipe(gulp.dest("./build/js"));
});

gulp.task("images", function () {
  return gulp.src(["./src/**/*.png", "./src/**/*.jpg"]).pipe(gulp.dest("./build"));
});

gulp.task("build", gulp.series("clean", gulp.parallel("html", "scss", "javascript", "images")));

gulp.task("server", function(){
  browserSync.init({
    server: "./build/"
  });
  gulp.watch("./src/**/*", gulp.series("build"));
  gulp.watch("./src/**/*", function(finalizar){
    browserSync.reload();
    finalizar();
  });
});