var gulp = require('gulp');
jsdoc = require('gulp-jsdoc3'),

gulp.task('docClean', function() {
    return del(['./docs']);
});

gulp.task('docs', ['docClean'], function (cb) {
    gulp.src(['README.md', './app/assets/scripts/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});