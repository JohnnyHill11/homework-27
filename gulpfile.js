const {src, dest, series, watch, parallel} = require('gulp')
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();

function cleanDist() {
  return src('./dist/',{read: false})
    .pipe(clean());
}

function copyHtml() {
  return src('./src/index.html')
    .pipe(dest('./dist'));
}

function copyCss() {
  return src('./src/styles/styles.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('./dist'));
}

function copyJs() {
  return src('./src/**/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('./dist'));
}

function server(cb) {
      browsersync.init({
          server: {
              baseDir: './dist',
          },
      });
  
      watch('./src/**/*.js', series(copyJs, reloadBrowser));
      watch('./src/**/*.css', series(copyCss, reloadBrowser));
      cb();
  }
  
  function reloadBrowser(cb) {
      browsersync.reload();
      cb();
  }

module.exports = {
  build: series(cleanDist, parallel (copyHtml, copyCss, copyJs)),
  serve: series(cleanDist, parallel (copyHtml, copyCss, copyJs), server)
}