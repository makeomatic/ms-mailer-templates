import assert from 'assert';
import gulp from 'gulp';
import inlinesource from 'gulp-inline-source';
import inlineCss from 'gulp-inline-css';
import gulpConnect from 'gulp-connect';
import gulpImagemin from 'gulp-imagemin';
import pngcrush from 'imagemin-pngcrush';
import del from 'del';
import preprocess from 'gulp-preprocess';
import htmlmin from 'gulp-htmlmin';
// eslint-disable-next-line import/extensions
import Datauri from 'datauri/sync.js';

const {
  dest, src, series, parallel, watch: gulpWatch,
} = gulp;

const __dirname = import.meta.dirname;
assert(__dirname, '__dirname must be defined');

const paths = {
  styles: 'styles/*.css',
  images: 'images/*',
  dist: 'build/',
  preview: 'preview/',
  tmp: 'tmp/',
  templates: 'src/templates/**.html',
  filesToMove: 'src/css/**.css',
};

// data uri part
function toBase64(path, env) {
  return env === 'production' ? new Datauri(`${__dirname}/path`).content : path;
}

// clean
export const clean = del.bind(null, [paths.dist, paths.preview]);

// move css
export const css = series(clean, function moveStyles() {
  return src(paths.filesToMove)
    .pipe(dest(`${paths.dist}css`))
    .pipe(dest(`${paths.preview}css`));
});

// minify images
export const imagemin = series(clean, function minifyImages() {
  return src(paths.images)
    .pipe(gulpImagemin({
      use: [pngcrush()],
    }))
    .pipe(dest(`${paths.preview}images`));
});

// preview templates
export const templates = series(clean, function buildTemplates() {
  return src(paths.templates)
    .pipe(preprocess({ context: { NODE_ENV: 'development', toBase64 }, extension: '.html' }))
    .pipe(inlinesource({ swallowErrors: false }))
    .pipe(dest(`${paths.preview}templates`))
    .pipe(gulpConnect.reload());
});

// production templates
export const templatesProduction = series(
  parallel(clean, css),
  function buildProdTemplates() {
    return src(paths.templates)
      .pipe(preprocess({ context: { NODE_ENV: 'production', toBase64 }, extension: '.html' }))
      .pipe(inlinesource({
        swallowErrors: false,
        rootpath: `${__dirname}/src`,
      }))
      .pipe(inlineCss({
        removeLinkTags: false,
        preserveMediaQueries: true,
      }))
      .pipe(htmlmin({ removeComments: true, collapseWhitespace: true, minifyCSS: true }))
      .pipe(dest(`${paths.dist}templates`));
  }
);

// reload connect
export const reload = function reloadConnect() {
  return src(paths.templates)
    .pipe(gulpConnect.reload());
};

export const production = parallel(templatesProduction, css, imagemin);

export const defaultTask = parallel(templates, templatesProduction, imagemin, css);

// dev server
export function connect() {
  gulpConnect.server({
    livereload: true,
    root: 'build',
  });

  return gulpWatch([paths.filesToMove, paths.templates], defaultTask);
}

export const watch = parallel(defaultTask, connect);
