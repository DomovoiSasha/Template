const gulp = require('gulp');
const watch = require('gulp-watch');
const bs = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const comb = require('gulp-csscomb');
const minify = require('gulp-minify-css');
const pug = require('gulp-pug');
const del = require('del');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');
const gcmq = require('gulp-group-css-media-queries');
const stylus = require('gulp-stylus');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');


gulp.task('img', function(){
	return gulp.src('app/img/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('sprite', function(){
	var spriteData = 
        gulp.src('app/img/sprite/png/*')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.styl',
			cssFormat: 'stylus',
			algorithm: 'binary-tree',
			padding: 2
		}));

spriteData.img.pipe(gulp.dest('dist/img'));
spriteData.css.pipe(gulp.dest('app/styles'));
	
	return spriteData;
});

gulp.task('icon', function(){
	return gulp.src('app/img/sprite/svg/*')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						styl: {
							dest:'../../../app/styles/svg_sprite.styl'
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('dist/img/'))
});

gulp.task('css', function(){
	return gulp.src('app/styles/style.styl')
		.pipe(stylus())
		.pipe(comb())
		.pipe(gcmq())
		.pipe(minify())
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('csscopy', function(){
	return gulp.src('app/styles/normalize.css')
		.pipe(minify())
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('html', function(){
	return gulp.src('app/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('dist'));
});

gulp.task('copy', function(){
	return gulp.src('app/fonts/*/*.*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('js', function() {
	return gulp.src('app/js/*')
		.pipe(gulp.dest('dist/js'));
});

gulp.task('build', gulp.series('img', 'css', 'csscopy', 'html', 'copy', 'js'));

gulp.task('clean', function(){
	return del('dist');
});

gulp.task('watch', function(){
	gulp.watch(('app/index.pug'), gulp.series('html'));
	gulp.watch(('app/styles/*.styl'), gulp.series('css', 'html'));
	gulp.watch(('app/js/*'), gulp.series('js', 'html'));
});

gulp.task('server', function(){
	bs.init({
		server: 'dist'
	});
	bs.watch('dist/**/*.*').on('change', bs.reload);
});

gulp.task('dev', gulp.series('clean', 'build', gulp.parallel('watch', 'server')));