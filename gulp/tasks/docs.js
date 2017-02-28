var gulp = require('gulp');
jsdoc = require('gulp-jsdoc3'),

gulp.task('docs', function (cb) {
    gulp.src(['README.md', './app/assets/scripts/**/*.js'], {read: false})
        .pipe(jsdoc(cb));
});