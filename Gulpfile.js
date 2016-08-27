var source = require('vinyl-source-stream')
var gulp = require('gulp')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
var _if = require('gulp-if')
var streamify = require('gulp-streamify')
var sourcemaps = require('gulp-sourcemaps')
var livereload = require('gulp-livereload')
var inject = require('gulp-inject-string')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')

var paths = {
  js: 'src/js/**/*.js',
  html: 'src/html/**/*.html',
  scss: 'src/scss/**/*.scss'
}

var livereloadPort = process.env.LR_PORT ? process.env.LR_PORT : 3000
var dev = process.env.NODE_ENV !== 'production'
var sassOutput = dev ? 'nested' : 'compressed'

gulp.task('css', function () {
  return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: sassOutput })
      .on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload())
})

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(_if(dev, inject.append(`<script src="http://localhost:${livereloadPort}/livereload.js?snipver=1"></script>`)))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload())
})

gulp.task('watch', function () {
  gulp.watch(paths.scss, [ 'css' ])
  gulp.watch(paths.html, [ 'html' ])
})

function handleErrors (error) {
  console.log(error.message)
  this.emit('end')
}

function buildScript (file, watch) {
  var props = {
    entries: [ './src/js/entry.js' ],
    debug: dev
  }
  var bundler = watch ? watchify(browserify(props)) : browserify(props)
  bundler.transform(babelify, { presets: [ 'es2015' ] })
  function rebundle () {
    var stream = bundler.bundle()
    return stream.on('error', handleErrors)
      .pipe(source(file))
      .pipe(_if(!dev, streamify(uglify())))
      .pipe(gulp.dest('./dist/js'))
      .pipe(livereload())
  }

  bundler.on('update', function () {
    rebundle()
    console.log('Rebundle...')
  })
  return rebundle()
}

gulp.task('js', function () {
  return buildScript('main.js', false)
})

gulp.task('build', [ 'html', 'css', 'js' ])

gulp.task('default', [ 'build', 'watch' ], function () {
  livereload.listen({ port: livereloadPort })
  return buildScript('main.js', true)
})
