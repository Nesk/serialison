/*
 * Requirements
 */

var gulp = require('gulp');

/*
 * Gulp plugins
 */

var concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    to5 = require('gulp-6to5');

/*
 * Paths
 */

var paths = {

    src: 'lib/{*,**/*}',
    dest: 'client'

};

/*
 * Tasks
 */

gulp.task('default', function() {
    return gulp.src(paths.src)
        .pipe(sourcemaps.init())
        .pipe(to5())
        .pipe(concat('json-api-linker.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest));
});