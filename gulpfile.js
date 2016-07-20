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


gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port:8081
        }));
});

/*
* copy and Concatenate the template to the angular-tag.js in dist
*
gulp.task('concatenate',function () {
    return gulp.src(['.'])
        .pipe(rename('angular-tag.css'))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.src(['angular-tag.js','templates.js']))
        .pipe(concat('angular-tag.js'))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.src('dist/angular-tag.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/angular-tag.min.js'));
});
*/
gulp.task('build', function (callback) {
    runSequence('clean',
      //build in parallel
        ['build-css', 'build-js','template-build'
            //,'concatenate'
            ],
        callback
    )
});

gulp.task('template-build', function () {
    return gulp.src('templates/**/*.html')
        .pipe(templateCache())
        .pipe(gulp.dest('.'));
});

gulp.task('build-css-files', function() {
    console.info("Build css");
    return gulp.src(['angular-tag.css'])
        .pipe(cssnano().on('error', gutil.log))
        .pipe(gulp.dest('dist'))
        .pipe(rename('angular-tag.min.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-js-files', function() {
    console.info("Build Our js");
    return gulp.src(['angular-tag.js'])
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist'))
        .pipe(rename('angular-tag.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('build-js', function (callbacks) {
    runSequence('build-js-files','clean-js',
        callbacks
    )
});

gulp.task('build-css', function (callbacks) {
    runSequence('build-css-files','clean-css',
        callbacks
    )
});

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('clean-js', function () {
    return del.sync('dist/angular-tag.js');
});

gulp.task('clean-css', function () {
    return del.sync('dist/angular-tag.css');
});



gulp.task('watch', function(){
    gulp.watch('*.js', ['build-js']);
    gulp.watch('*.css', ['build-css']);
    gulp.watch('templates/*.css',['template-build']);
});

gulp.task("serve",['watch','webserver']);