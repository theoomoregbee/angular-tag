/**
 * Created by SQ04 Theophilus Omorebgee <theo4u@ymail.com> on 6/30/2016.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename= require('gulp-rename');
var gutil = require('gulp-util');//to help log any error found in our .js file
var cssnano = require('gulp-cssnano');
var del = require('del');
var webserver = require('gulp-webserver');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');


function handleError (err) {
    /*gutil.log(err);*/
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


gulp.task('clean', function () {
    return del('dist');
});

gulp.task('build-css-script', function() {
    console.info("Build css");
    return gulp.src(['dist/angular-tag.css'])
        .pipe(rename('angular-tag.min.css'))
        .pipe(cssnano('angular-tag.min.css').on('error', gutil.log))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-css', gulp.series('copy-css','build-css-script', function (done) {
    done();
} ) );



/*
 *  Concatenate the template to the angular-tag.js in dist
 **/
gulp.task('concatenate',function () {
    return gulp.src(['dist/angular-tag.js','templates.js'])
        .pipe(concat('angular-tag.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-js-script', gulp.series(function(done) {
    console.info("Build Our js");
    return gulp.src(['dist/angular-tag.js'])
        .pipe(rename('angular-tag.min.js'))
        .pipe(uglify().on('error', handleError))
        .pipe(gulp.dest('dist'));
}));

gulp.task('build-js', gulp.series('copy-js','concatenate','build-js-script',function(done){
    done();
}));



gulp.task('build-template-files', function () {
    return gulp.src('templates/**/*.html')
        .pipe(templateCache({module:'angular-tag/templates', transformUrl:function (url) {
            return "angular-tag/templates/"+url;
        }, standalone:true}))
        .pipe(gulp.dest('.'));
});

gulp.task('template-build', gulp.series('build-template-files','build-js', function(done){
    done();
}));



gulp.task('build', gulp.series('clean','build-css','template-build','build-js', function(done){
    done();
}));


gulp.task('watch', function() {
    gulp.watch('*.js', gulp.parallel('build-js'));
    gulp.watch('*.css', gulp.parallel('build-css'));
    gulp.watch('templates/*.html', gulp.parallel('template-build'));
});

gulp.task("serve",gulp.parallel('build','watch','webserver'));
