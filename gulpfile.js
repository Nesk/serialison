/*
 * Requirements
 */

var browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    exorcist = require('exorcist'),
    gulp = require('gulp')
    source = require('vinyl-source-stream')
    to5Browserify = require('6to5-browserify');

/*
 * Gulp plugins
 */

var rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

/*
 * Paths
 */

var paths = {
    src: './entry-points/browser.js',
    dest: 'client/'
};

var names = {
    base: 'serialison.js',
    min: 'serialison.min.js'
};

/*
 * Tasks
 * Without source map for the minified version, UglifyJS drove me mad. I will work on it later.
 */

gulp.task('default', function() {
    return browserify({
        entries: paths.src,
        standalone: 'SerialiSON',
        debug: true
    })
        .transform(to5Browserify)
        .bundle()
        .pipe(exorcist(paths.dest + names.base + '.map'))
        .pipe(source(names.base))
        .pipe(gulp.dest(paths.dest))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename(names.min))
        .pipe(gulp.dest(paths.dest));
});
