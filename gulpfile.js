/*global -$ */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var inquirer = require('inquirer');
var minifyHTML = require('gulp-minify-html');
var browserSync = require('browser-sync');
var del = require('del');
var reload = browserSync.reload;
var livereload = require('gulp-livereload');

// variables
var production = !!(argv.production);  
var dev = !!(argv.dev);  
var move = !!(argv.move); 
var app = 'GulpWithSass';
var dist = 'dist';
var src = {
  scss : app+'/style.scss',  
  scripts:{
  headerscripts:'bower_components/modernizr/modernizr.js',
  vendor:['bower_components/jquery/dist/jquery.js',
  'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
  ],
  main:'scripts/main.js'
  }
};

gulp.task('styles', function () {
  return gulp.src(src.scss)    
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 2 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(app+'/'))
    //------------------
    // CSS Minification
    // -----------------
    //.pipe(csso())    
    //.pipe(rename('style.min.css'))
    //.pipe(gulp.dest(app+'/'))
    .pipe(livereload());
});

// Main Js
gulp.task('mainScripts', function(){
  return gulp.src(src.scripts.main)
    .pipe(concat('main.js'))    
    .pipe(gulp.dest(app+'/js/'))
    //------------------
    // JS Minification
    // -----------------
    // .pipe(rename('main.min.js'))
    // .pipe(uglify())
    // .pipe(gulp.dest(app+'/js/'))
    .pipe(livereload());
});

// Vendor js
gulp.task('vendorScripts', function(){
  return gulp.src(src.scripts.vendor)
    .pipe(concat('vendor.js'))    
    .pipe(gulp.dest(app+'/js/vendor/'))
});

// FeaturesDetection
gulp.task('headerscripts', function(){
  return gulp.src(src.scripts.headerscripts)
    .pipe(concat('headscripts.js'))   
    .pipe(uglify())
    .pipe(gulp.dest(app+'/js/vendor/'))
});

// Gulp Clean Compiled Files and Folder
gulp.task('clean', function(){
  del([
    app+'/js',
    app+'/style.css',
    app+'/style.min.css'
    ])
});




gulp.task('serve', function() {
 livereload.listen();
  gulp.watch(app+'/**/*.scss', ['styles']);
  gulp.watch('scripts/*.js', ['mainScripts']);
});

gulp.task('default', ['styles','headerscripts','vendorScripts','mainScripts','serve']);