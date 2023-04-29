const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
//const sass = require('gulp-sass');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
//const csso = require('postcss-csso');
//const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const sync = require('browser-sync').create();
//const webp = require('gulp-webp');
//const del = require('del');
const svgstore = require('gulp-svgstore');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const clean = require('gulp-clean');

const cleanOldMinCss = () => {
  return gulp.src('css/style.min.css', {read: false, allowEmpty: true})
    .pipe(clean());
}

exports.cleanOldMinCss = cleanOldMinCss;

// svg sprite

const svgSprite = () => {
  return gulp
    .src('img/svgs/*.svg')
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename('sprite-big.svg'))
    .pipe(gulp.dest('img/sprite'));
};

exports.svgSprite = svgSprite;

// Styles

const minifyStyles = () => {
    return gulp.src('css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest('css'));
};

exports.minifyStyles = minifyStyles;

// HTML

// const minifyHTML = () => {
//   return gulp
//     .src("source/*.html")
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(gulp.dest("build"));
// };

// exports.minifyHTML = minifyHTML;

// Scripts



// const minifyScripts = () => {
//     return gulp
//         .src("js/main.js")
//         .pipe(minify())
//         .pipe(rename("main.min.js"))
//         .pipe(gulp.dest('js'))
// };

const minifyScripts = () => {
  return gulp
    .src("js/main.js")
    .pipe(terser())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("js"))
    .pipe(sync.stream());
};

exports.minifyScripts = minifyScripts;

// Styles not minified to source folder, just in case
// const notMinStyles = () => {
//   return gulp
//     .src("source/sass/style.scss")
//     .pipe(plumber())
//     .pipe(sourcemap.init())
//     .pipe(sass())
//     .pipe(postcss([autoprefixer()]))
//     .pipe(sourcemap.write("."))
//     .pipe(gulp.dest("source/css"))
//     .pipe(sync.stream());
// };

// exports.notMinStyles = notMinStyles;

// Copy images

// const copyImages = () => {
//   return gulp.src("source/img/**/*.{png,jpg,svg}").pipe(gulp.dest("build/img"));
// };

// exports.copyImages = copyImages;

// CopyFiles

// const copyFiles = (done) => {
//   gulp
//     .src(
//       [
//         "source/fonts/*.{woff2,woff}",
//         "source/*.ico",
//         "source/img/**/*.svg",
//         "source/manifest.*",
//       ],
//       {
//         base: "source",
//       }
//     )
//     .pipe(gulp.dest("build"));
//   done();
// };

// exports.copyFiles = copyFiles;

// Clean

// const clean = () => {
//   return del("build");
// };

// exports.clean = clean;

// Server

// const server = (done) => {
//   sync.init({
//     server: {
//       baseDir: "build",
//     },
//     cors: true,
//     notify: false,
//     ui: false,
//   });
//   done();
// };

// exports.server = server;

// Watcher

// const watcher = () => {
//   gulp.watch(
//     "source/sass/**/*.scss",
//     gulp.series("minifyStyles", "notMinStyles")
//   );
//   gulp.watch("source/js/main.js", gulp.series("minifyScripts"));
//   gulp
//     .watch("source/*.html", gulp.series("minifyHTML"))
//     .on("change", sync.reload);
// };

// Build

// const build = gulp.series(
//   clean,
//   copyFiles,
//   optimizeImages,
//   svgSprite,
//   gulp.parallel(minifyHTML, minifyStyles, minifyScripts, createWebp)
// );

// exports.build = build;

// Default

// exports.default = gulp.series(
//   clean,
//   copyFiles,
//   copyImages,
//   svgSprite,
//   gulp.parallel(minifyHTML, minifyStyles, minifyScripts, createWebp),
//   gulp.series(server, watcher)
// );

// Default

exports.default = gulp.series(cleanOldMinCss, svgSprite, minifyStyles, minifyScripts);
