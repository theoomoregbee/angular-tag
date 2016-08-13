/**
 * Created by SQ04 Theophilus Omorebgee <theo4u@ymail.com> on 6/30/2016.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename= require('gulp-rename');
var gutil = require('gulp-util');//to help log any error found in our .js file
var runSequence = require('run-sequence');
var cssnano = require('gulp-cssnano');
var del = require('del');
var webserver = require('gulp-webserver');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');


function handleError (err) {
    gutil.log(err);
    process.exit(1);
}


gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port:8081
        }));
});


/**
 * Copy necessary files to dist folder
 */
gulp.task('copy-js',function () {
    return gulp.src(['angular-tag.js'])
        .pipe(rename(function(path){  }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-css',function () {
    return gulp.src(['angular-tag.css'])
        .pipe(rename(function(path){  }))
        .pipe(gulp.dest('dist'));
});


gulp.task('build', function (callback) {
    runSequence('clean','template-build',
      //build in parallel
        ['build-css', 'build-js'],
        callback
    )
});

gulp.task('build-css', function (callbacks) {
    runSequence('copy-css','build-css-script',
        callbacks
    )
});

gulp.task('build-css-script', function() {
    console.info("Build css");
    return gulp.src(['dist/angular-tag.css'])
        .pipe(rename('angular-tag.min.css'))
        .pipe(cssnano('angular-tag.min.css').on('error', handleError))
        .pipe(gulp.dest('dist'));
});

/*
 *  Concatenate the template to the angular-tag.js in dist
 **/
gulp.task('concatenate',function () {
    return gulp.src(['dist/angular-tag.js','templates.js'])
        .pipe(concat('angular-tag.js'))
        .pipe(gulp.dest('dist'));
});


gulp.task('build-js', function (callbacks) {
    runSequence('copy-js','concatenate','build-js-script',
        callbacks
    )
});
gulp.task('build-js-script', function() {
    console.info("Build Our js");
    return gulp.src(['dist/angular-tag.js'])
        .pipe(rename('angular-tag.min.js'))
        .pipe(uglify().on('error', handleError))
        .pipe(gulp.dest('dist'));
});


gulp.task('template-build', function (callbacks) {
    runSequence('build-template-files','build-js',
        callbacks
    )
});

gulp.task('build-template-files', function () {
    return gulp.src('templates/**/*.html')
        .pipe(templateCache({module:'angular-tag/templates', transformUrl:function (url) {
            return "angular-tag/templates/"+url;
        }, standalone:true}))
        .pipe(gulp.dest('.'));
});

gulp.task('clean', function () {
    return del.sync('dist');
});


gulp.task('watch', function(){
    gulp.watch('*.js', ['build-js']);
    gulp.watch('*.css', ['build-css']);
    gulp.watch('templates/*.html',['template-build']);
});

gulp.task("serve",['build','watch','webserver']);