var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var sass = plugins.sass;
var plumber = plugins.plumber;
var connect = plugins.connect;
var rename = plugins.rename;
var path = require("path");

var buildRoot = "build";
var SASS_OUTPUT_STYLES = {
    NESTED: "nested",
    EXPANDED: "expanded",
    COMPACT: "compact",
    COMPRESSED: "compressed"
};
var sassOptions = {outputStyle: SASS_OUTPUT_STYLES.NESTED};
var stylesheetsSrc = "app/styles/custom/**/*.scss";


gulp.task("html", function () {
    return gulp.src("app/**/*.{htm,html}", {base: "app"})
        .pipe(gulp.dest(buildRoot))
        .pipe(connect.reload());
});

gulp.task("images", function () {
    return gulp.src("app/img/**/*.{svg,png,jpeg,jpg,gif}")
        .pipe(gulp.dest(buildRoot + "/img"))
        .pipe(connect.reload());
});

gulp.task("w:images", ["images"], function () {
    return gulp.watch("app/img/**/*.{svg,png,jpeg,jpg,gif}", ["images"]);
});

gulp.task("fonts", function () {
    return gulp.src("app/**/*.{eot,otf,ttf,woff}")
        .pipe(gulp.dest(buildRoot))
        .pipe(connect.reload());
});

gulp.task("w:fonts", ["fonts"], function () {
    return gulp.watch("app/**/*.{eot,woff,woff2}", ["fonts"]);
});

gulp.task("w:html", ["html"], function () {
    return gulp.watch("app/**/*.{htm,html}", ["html"]);
});

gulp.task("css:vendor", function () {
    return gulp.src("app/styles/vendor/**/*.css")
        .pipe(gulp.dest(buildRoot + "/styles/vendor/"))
        .pipe(connect.reload());
});

gulp.task("w:css:vendor", ["css:vendor"], function () {
    return gulp.watch("app/styles/vendor/**/*.css", ["css:vendor"]);
});

gulp.task("sass", function () {
    return gulp.src(stylesheetsSrc)
        .pipe(plumber())
        .pipe(sass(sassOptions).on("error", sass.logError))
        .pipe(gulp.dest(buildRoot + "/styles"))
        .pipe(connect.reload());
});

gulp.task("w:sass", ["sass"], function () {
    return gulp.watch(stylesheetsSrc, ["sass"]);
});

gulp.task("watch", ["w:sass", "w:css:vendor", "w:html", "w:fonts", "w:images"]);

gulp.task("s:static", function () {
    return connectServer({
        root: buildRoot,
        fallback: "build/panel-selectors.html"
    });
});

gulp.task("serve", ["s:static"]);

gulp.task("default", ["watch", "serve"]);

function extendObjProps(base, ext) {
    var allArgumentsAreObj = Array.prototype.slice.call(arguments).every(function (arg) {
        return arg !== null && typeof arg === "object";
    });
    if (arguments.length === 2 && allArgumentsAreObj) {
        var keys = Object.keys(ext);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            base[key] = ext[key];
        }
    }
}

function connectServer(opts) {
    var defaults = {root: "static", port: 8080, livereload: {port: 35729}};
    if (arguments.length && opts !== null && typeof opts === "object") extendObjProps(defaults, opts);
    connect.server(defaults);
}
