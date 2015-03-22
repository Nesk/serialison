/*
 * Requirements
 */

var argv = require('yargs').argv,
    babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    exorcist = require('exorcist'),
    gulp = require('gulp'),
    npm = require('npm'),
    source = require('vinyl-source-stream');

/*
 * Gulp plugins
 */

var bump = require('gulp-bump'),
    git = require('gulp-git'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

/*
 * Paths
 */

var paths = {
    src: './entry-points/browser.js',
    dest: 'client/',

    versioning: ['bower.json', 'package.json'],
    release: ['client/*', 'bower.json', 'package.json']
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
        .transform(babelify)
        .bundle()
        .pipe(exorcist(paths.dest + names.base + '.map'))
        .pipe(source(names.base))
        .pipe(gulp.dest(paths.dest))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename(names.min))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dest));
});

/*
 * Releasing tasks
 */

gulp.task('release', ['default', 'bump', 'commit', 'tag']);

gulp.task('bump', function() {
    return gulp.src(paths.versioning)
        .pipe(bump({version: argv.v}))
        .pipe(gulp.dest('./'));
});

gulp.task('commit', ['default', 'bump'], function() {
    return gulp.src(paths.release)
        .pipe(git.add())
        .pipe(git.commit('Bump to v' + argv.v));
});

gulp.task('tag', ['default', 'bump', 'commit'], function(cb) {
    var version = 'v' + argv.v;
    git.tag(version, 'Release ' + version, cb);
});

/*
 * Publishing taks
 */

gulp.task('publish', ['publish-git', 'publish-npm']);

gulp.task('publish-git', function(cb) {
    git.push('origin', 'master', {
        args: '--tags'
    }, cb);
});

gulp.task('publish-npm', function(cb) {
    npm.load(function() {
        npm.commands.publish(cb);
    });
});
