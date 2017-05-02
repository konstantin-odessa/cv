import gulp from 'gulp';
//jshint = require('gulp-jshint'),
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import notify from 'gulp-notify';
import livereload from 'gulp-livereload';
import plumber from 'gulp-plumber';
import del from 'del';
import filter from 'gulp-filter';
import babel from 'gulp-babel';
import rollup from 'gulp-rollup';
import imagemin from 'gulp-imagemin';
// assetCache = require('gulp-asset-cache');
import assetCache from 'gulp-asset-cache';


 var styles = (source, filename) => {
    return gulp.src(source)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename(filename))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(filter('**/*.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({message: 'Styles task complete'}));
};

// Styles
gulp.task('styles-app', () => {
    styles('src/sass/app/index.scss', 'style.css')
});
gulp.task('styles-plugins', () => {
    styles('src/sass/plugin/plugins.scss', 'plugins.css')
});
gulp.task('styles', ['styles-app', 'styles-plugins']);


// Scripts
gulp.task('scripts', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(rollup({
            // any option supported by Rollup can be set here.
            "format": "iife",
            "plugins": [
                require("rollup-plugin-babel")({
                    babelrc: false,
                    "presets": [["es2015", {"modules": false}]],
                    "plugins": ["external-helpers"]
                })
            ],
            allowRealFiles: true,
            entry: './src/js/app.js'
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/js'))
        .pipe(filter('**/*.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

// Images
gulp.task('images', () => {
    return gulp.src('assets/img/**/*')
        .pipe(assetCache.filter())
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('dist/img'))
        .pipe(assetCache.cache())
        .pipe(notify({message: 'Images task complete'}));
});

// Clean
gulp.task('clean', () => {
    return del(['dist/styles', 'dist/scripts', 'dist/images']);
});

// Default task
gulp.task('default', ['clean'], () => {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', () => {

    // Watch .scss files
    gulp.watch('src/sass/app/**/*.scss', ['styles-app']);
    gulp.watch('src/sass/plugin/**/*.scss', ['styles-plugins']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

    // Watch images
    gulp.watch('assets/img/**/*', ['imagemin']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});