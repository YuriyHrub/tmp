//terser_____   plagin for minification of code
//babelify___ use for browserify
//source_____ browserify transform stream

//src(path/to/file, {since: lastRun('task')})___check unchanged files and skip them

const {src, dest, watch, parallel, series, lastRun} = require('gulp'),
      fileInclude  = require('gulp-file-include'),
      relines      = require('gulp-remove-empty-lines'),
      sass         = require('gulp-sass')(require('sass')),
      sourcemaps   = require('gulp-sourcemaps'),
      browserSync  = require('browser-sync').create(),
      autoprefixer = require('gulp-autoprefixer'),
      rename       = require('gulp-rename'),
      cleanCss     = require('gulp-cleancss'),
      size         = require('gulp-size'),
      terser       = require('gulp-terser'),
      browserify   = require('browserify'),
      babelify     = require('babelify'),
      source       = require('vinyl-source-stream'),
      buffer       = require('vinyl-buffer'),
      babel        = require('gulp-babel'),
      plumber      = require('gulp-plumber'),
      cache        = require('gulp-cache'),
      imagemin     = require('gulp-imagemin'),
      svgsprite    = require('gulp-svg-sprite'),
      cheerio      = require('gulp-cheerio'),
      woff         = require('gulp-ttf2woff'),
      woff2        = require('gulp-ttf2woff2'),
      del          = require('del'),
      fs           = require('fs');

const app  = 'app',
      dist = 'dist';

const path = {
  app: {
    html:     `${app}/**/*.html`,
    scss:     `${app}/scss/**/*.scss`,
    libsCss:  `${app}/libs/css/**/*`,
    js:       `${app}/js/**/*.js`,
    libsJs:   `${app}/libs/js/**/*`,
    img:      `${app}/img/**/*.{jpeg,jpg,png,svg,ico}`,
    svg:      `${app}/svg/**/*`,
    font:     `${app}/font/**/*.{ttf,woff,woff2}`
  },
  dist: {
    img:      `${dist}/img`,
    css:      `${dist}/css`,
    js:       `${dist}/js`,
    font:     `${dist}/font`
  },
  watch: {
    html:     `${app}/**/*.html`,
    scss:     `${app}/scss/**/*.scss`,
    js:       `${app}/js/**/*.js`,
    lib:      `${app}/libs/**/*`,
  }
}

/* ===========================
  #HTML
============================= */
function html() {
  return src([path.app.html, `!${app}/html/**/*.html`])
          .pipe(plumber())
          .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file',
          }))
          .pipe(relines({
            removeComments: true,
            // removeSpaces: true
          }))
          .pipe(dest(dist))
          .pipe(browserSync.stream());

}

exports.html = html;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #SCSS
============================= */
function scss() {
  return src(path.app.scss)
          .pipe(sourcemaps.init())
          .pipe(sass.sync().on('error', sass.logError))
          .pipe(autoprefixer())
          .pipe(sourcemaps.write())
          .pipe(dest(path.dist.css)).pipe(browserSync.stream());
}

exports.scss = scss;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #LIB CSS
============================= */
function libCss() {
  return src(path.app.libsCss)
          .pipe(plumber())
          .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
          })).pipe(rename({
            suffix: '.min',
          })).pipe(dest(path.dist.css))
}

exports.libcss = libCss;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #PRODACTION CSS
============================= */
function prodCss() {
  return src([`${path.dist.css}/**/*.css`, `!${path.dist.css}/**/*.min.css`], {since: lastRun('prodCss')})
          .pipe(size())
          .pipe(plumber())
          .pipe(cleanCss({
            format: 'beautify',
            level: 2,
          }))
          .pipe(rename({
            suffix: '.min',
          }))
          .pipe(size())
          .pipe(dest(path.dist.css)).pipe(browserSync.stream());
}

exports.prodcss = prodCss;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #BROWSERIFY
============================= */
function bundle() {
  return browserify('app/js/script.js', {
          debug: true
         })
         .transform('babelify', {
           presets: ['@babel/preset-env', '@babel/preset-react']
         })
         .bundle()
         .pipe(source('bundle.js'))
         .pipe(dest(path.dist.js)).pipe(browserSync.stream());
}

exports.bundle = bundle;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #JS
============================= */
function js() {
  return browserify('app/js/script.js', {debug: true})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(plumber())
        .pipe(babel({
          presets: ['@babel/preset-env'],
        }))
        .pipe(dest(path.dist.js)).pipe(browserSync.stream());
}

exports.js = js;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #PRODACTION JS
============================= */
function prodJs() {
  return src([`${path.dist.js}/**/*`, `!${path.dist.js}/**/*.min.js`], {since: lastRun('prodJs')})
          .pipe(plumber())
          //terser param obj {keep_fnames: true, mangle: false}
          .pipe(terser())
          .pipe(size())
          .pipe(rename({
            suffix: '.min'
          }))
          .pipe(dest(path.dist.js)).pipe(browserSync.stream());
}

exports.prodjs = prodJs;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #LIB JS
============================= */
function vendorJs() {
  return src(path.app.libsJs)
          .pipe(plumber())
          .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
          }))
          .pipe(dest(path.dist.js)).pipe(browserSync.stream());
}

exports.vendorjs = vendorJs;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #IMG
============================= */
function img() {
  return src(path.app.img, {since: lastRun(img)})
          .pipe(size())
          .pipe(cache(
            imagemin([
            // imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
              plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
              ]
            })
            ])))
          .pipe(size())
          .pipe(dest(path.dist.img))
          .pipe(browserSync.stream());
}

exports.img = img;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #SVG
============================= */

function svgSprite() {
  const config = {
    mode: {
      symbol: {
        bust: false,
        dest: 'svg/',
        sprite: 'sprite.symbol.svg',
        render: false,
        inline: true,
        },
      /*stack: {
        bust: false,
        dest: 'svg/',
        sprite: 'sprite.svg',
      }*/
      /*css: {
        dest: '',
        bust: false,
        dimensions: true,
        prefix: '.%s',
        render: {
          scss: {
            dest: '../_sprite.scss'
          }
        // }
      },
      view: {
        dest: '',
        bust: false,
        render: {
          scss: {
            dest: '../_sprite.view.scss'
          }
        }
      }*/
    }
  }
    return src(path.app.svg)
          .pipe(plumber())
          .pipe(svgsprite(config))
          .pipe(cheerio({
             run: function($){
              $('[fill]').removeAttr('fill');
              $('[stroke]').removeAttr('stroke');
              $('[style]').removeAttr('style');
              $('symbol').each(function() {
                $(this).attr('id', $(this).attr('id').toLowerCase());
              })
            }}))
          .pipe(dest(`${app}/img`))
          .pipe(dest(`${dist}/img`))
}

exports.svgsprite = svgSprite;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #FONT
============================= */
function toWoff() {
  return src(path.app.font)
  .pipe(woff())
  .pipe(dest(path.dist.font));
}
function toWoff2() {
  return src(path.app.font)
          .pipe(woff2())
          .pipe(dest(path.dist.font));
}
exports.woff = toWoff;
exports.woff = toWoff2;
exports.font = series(toWoff, toWoff2);
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #DELETE DIR
============================= */
exports.del = function(done) {
  del(dist);
  cache.clearAll();
  done()
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


/* ===========================
  #Reload
============================= */
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: `dist`
    },
    notify: false
  });

  watch(path.app.html, html);
  watch(path.app.scss, scss);
  watch(path.app.js, js);
  watch(path.app.img, img);
  watch(path.dist.font, browserSync.reload());
}

exports.watch = watchFiles;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

exports.default = series(html, scss, libCss, js, vendorJs, watchFiles);
exports.prod    = series(html, 
                  parallel(series(scss, prodCss), libCss),
                  parallel(series(js, prodJs), vendorJs), img, svgSprite);