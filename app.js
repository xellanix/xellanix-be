var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
dotenv.config();

//library
var flash = require("express-flash");
var session = require("express-session");
// Middleware to parse JSON bodies
var bodyParser = require("body-parser");
var cors = require("cors");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var productRouter = require("./routes/product");
var memberRouter = require("./routes/member");
var apiRouter = require("./routes/api");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware setup
app.use(
	cors({
		origin: "http://127.0.0.1:5501", // Specify the frontend's origin,
		credentials: true,
	})
); // Enable CORS for all routes
app.use(bodyParser.json());

app.use(
	session({
		cookie: {
			maxAge: 60000,
		},
		store: new session.MemoryStore(),
		saveUninitialized: true,
		resave: "true",
		secret: "secret",
	})
);

app.use(flash());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/member", memberRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
