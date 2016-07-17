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


gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            port:8081
        }));
});


gulp.task('build', function (callback) {
    runSequence('clean',
      //build in parallel
        ['build-css', 'build-js'],
        callback
    )
});

gulp.task('build-css-files', function() {
    console.info("Build css");
    return gulp.src(['angular-tag.css'])
        .pipe(cssnano().on('error', gutil.log))
        .pipe(gulp.dest('min'))
        .pipe(rename('angular-tag.min.css'))
        .pipe(gulp.dest('min'));
});
gulp.task('build-js-files', function() {
    console.info("Build Our js");
    return gulp.src(['angular-tag.js'])
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('min'))
        .pipe(rename('angular-tag.min.js'))
        .pipe(gulp.dest('min'));
});

gulp.task('clean', function () {
    return del.sync('min');
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
    return del.sync('min');
});

gulp.task('clean-js', function () {
    return del.sync('min/angular-tag.js');
});

gulp.task('clean-css', function () {
    return del.sync('min/angular-tag.css');
});



gulp.task('watch', function(){
    gulp.watch('*.js', ['build-js']);
    gulp.watch('*.css', ['build-css']);
    gulp.watch('**/*.html', ['webserver']);
});

gulp.task("serve",['watch','webserver']);