/*global require, console, process */
/*jshint strict:false */

var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    fs          = require('fs'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    rename      = require("gulp-rename"),
    sass        = require('gulp-ruby-sass'),
    spawn       = require('child_process').spawn
    notify      = require('gulp-notify'),
    filter      = require('gulp-filter');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('browser-sync--reload', function() {
    browserSync.reload();
});

gulp.task('sass', function () {
    // Prepare dependencies
    gulp.src('node_modules/normalize.css/normalize.css')
        .pipe(rename('_normalize.scss'))
        .pipe(gulp.dest('./css/src'));

    // Build source sass files
    return gulp.src('./css/src/**/*.scss')
        .pipe(sass({
            sourcemap: true,
            sourcemapPath: '../src',
            style: 'compressed'
        }))
        .pipe(gulp.dest('./css/build'))
        .pipe(filter('**/*.css'))
        .pipe(reload({stream:true}));
});

gulp.task('watch', function() {
    var process;
    function spawnChildren(e) {
        if(process) { process.kill(); }
        process = spawn('gulp', ['watching-task'], {stdio: 'inherit'});
    }

    gulp.watch('gulpfile.js', spawnChildren);
    spawnChildren();
});

gulp.task('watching-task', ['sass', 'browser-sync'], function(){
    notify({
        title: "Gulp is watching...",
        message: "Use the local BrowserSync proxy server (likley http://localhost:3000)"
    });

    /* Reload browser if files change */
    gulp.watch('./**/*.html', ['browser-sync--reload']);
    gulp.watch('./css/src/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);