var gulp = require('gulp'),
    //jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    del = require('del'),
    filter = require('gulp-filter'),
    babel = require('gulp-babel'),
    rollup = require('gulp-rollup');




function styles(source, filename) {
    return gulp.src(source)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(rename(filename))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(filter('**/*.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
}

// Styles
gulp.task('styles-app', function() {styles('src/sass/app/index.scss', 'style.css')});
gulp.task('styles-plugins', function(){styles('src/sass/plugin/plugins.scss', 'plugins.css')});
gulp.task('styles', ['styles-app', 'styles-plugins']);


// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        //.pipe(babel({
        //    presets: ['es2015']
        //}))
        .pipe(rollup({
            // any option supported by Rollup can be set here.
            "format": "iife",
            "plugins": [
                require("rollup-plugin-babel")({
                    "presets": [["es2015", { "modules": false }]],
                    "plugins": ["external-helpers"]
                })
            ],
            allowRealFiles: true,
            entry: './src/js/app.js'
        }))
        //.pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/js'))
        .pipe(filter('**/*.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
    return del(['dist/styles', 'dist/scripts', 'dist/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('src/sass/app/**/*.scss', ['styles-app']);
    gulp.watch('src/sass/plugin/**/*.scss', ['styles-plugins']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});