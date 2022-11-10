const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass')(require('sass'));

const distServer = 'C:/MAMP/htdocs/apanel/admin';
// const dist = 'dist/admin'

gulp.task('copy-html', () => {
    return gulp.src('./src/index.html').pipe(gulp.dest(distServer));
});

gulp.task('build-js', () => {
    return gulp
        .src('./src/script.js')
        .pipe(
            webpack({
                mode: 'development',
                output: {
                    filename: 'script.js',
                },
                watch: false,
                devtool: 'source-map',
                module: {
                    rules: [
                        {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        [
                                            '@babel/preset-env',
                                            {
                                                debug: true,
                                                corejs: 3,
                                                useBuiltIns: 'usage',
                                            },
                                        ],
                                        '@babel/react',
                                    ],
                                },
                            },
                        },
                    ],
                },
            })
        )
        .pipe(gulp.dest(distServer));
});

gulp.task('buld-sass', () => {
    return gulp
        .src('./src/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(distServer));
});

gulp.task('copy-api', () => {
    gulp.src('./src/api/**/.*').pipe(gulp.dest(distServer + '/api'));
    return gulp.src('./src/api/**/*.*').pipe(gulp.dest(distServer + '/api'));
});

gulp.task('copy-assets', () => {
    return gulp
        .src('./src/assets/**/*.*')
        .pipe(gulp.dest(distServer + '/assets'));
});

gulp.task('watch', () => {
    gulp.watch('./src/index.html', gulp.parallel('copy-html'));
    gulp.watch('./src/**/*.js', gulp.parallel('build-js'));
    gulp.watch('./src/scss/**/*.*', gulp.parallel('buld-sass'));
    gulp.watch('./src/api/**/*.*', gulp.parallel('copy-api'));
    gulp.watch('./src/assets/**/*.*', gulp.parallel('copy-assets'));
});

gulp.task(
    'build',
    gulp.parallel(
        'copy-html',
        'build-js',
        'buld-sass',
        'copy-api',
        'copy-assets'
    )
);

gulp.task('default', gulp.parallel('watch', 'build'));
