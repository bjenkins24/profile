var gulp = require('gulp');
imagemin = require('gulp-imagemin'),
del = require('del'),
usemin = require('gulp-usemin'),
rev = require('gulp-rev'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
browserSync = require('browser-sync').create();

let distFolder = 'docs';

gulp.task('previewDist', function() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: distFolder
        }
    });
});

gulp.task('deleteDistFolder', ['icons'], function() {
    return del('./'+distFolder);
});

gulp.task('copyGeneralFiles', ['deleteDistFolder'], function() {
    let pathsToCopy = [
        './app/**/*', 
        '!./app/index.html',
        '!./app/assets/images/**',
        '!./app/assets/styles/**',
        '!./app/assets/scripts/**',
        '!./app/temp',
        '!./app/temp/**'
    ];

    return gulp.src(pathsToCopy)
        .pipe(gulp.dest('./'+distFolder));
});

gulp.task('optimizeImages', ['deleteDistFolder', 'styles', 'scripts'], function() {
    return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest('./'+distFolder+'/assets/images'));
});

gulp.task('useminTrigger', ['deleteDistFolder'], function() {
    gulp.start('usemin');
});

gulp.task('usemin', ['deleteDistFolder'], function() {
    return gulp.src('./app/index.html')
        .pipe(usemin({
           css: [rev, cssnano],
           js: [rev, uglify]
        }))
        .pipe(gulp.dest('./'+distFolder));
});

gulp.task('build', ['deleteDistFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger']);