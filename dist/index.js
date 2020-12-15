"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var User_1 = __importDefault(require("./models/User"));
var config_1 = require("./utils/config");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var upload_1 = __importDefault(require("./utils/upload"));
var Post_1 = __importDefault(require("./models/Post"));
var app = express_1.default();
app.use(cors_1.default({
    origin: 'http://localhost:3000'
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
mongoose_1.default.connect(config_1.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () { return console.log('MongoDB connected successfully'); }).catch(function (err) { return console.log(err); });
app.get('/users', function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).send;
                return [4 /*yield*/, User_1.default.find({})];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
app.post('/users', upload_1.default.single('image'), function (req, res) {
    User_1.default.create(__assign(__assign({}, JSON.parse(req.body.data)), { image: req.file.filename })).then(function (user) {
        res.send(jsonwebtoken_1.default.sign({ id: user._id }, config_1.SECRET));
    }).catch(function (err) { return console.log(err); });
});
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, _b, e_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password) {
                    res.send(null);
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                return [4 /*yield*/, User_1.default.findOne({ username: username }).select('password')];
            case 2:
                user = _c.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 4];
                return [4 /*yield*/, user.matchesPassword(password)];
            case 3:
                _b = !(_c.sent());
                _c.label = 4;
            case 4:
                if (_b) {
                    res.send(null);
                    return [2 /*return*/];
                }
                else {
                    res.send(jsonwebtoken_1.default.sign({ id: user._id }, config_1.SECRET));
                }
                return [3 /*break*/, 6];
            case 5:
                e_1 = _c.sent();
                console.log(e_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
var verifyToken = function (req, res, next) {
    var auth = req.headers.authorization || null;
    if (!auth || !auth.startsWith("Bearer "))
        return res.status(401).send("Access Denied");
    try {
        var token = jsonwebtoken_1.default.verify(auth.substring(7), config_1.SECRET);
        req.user_id = token.id;
        next();
    }
    catch (e) {
        res.status(401).send('Not Authorized');
    }
};
app.get('/me', verifyToken, function (req, res) {
    User_1.default.findById(req.user_id).then(function (user) { return res.send(user); }).catch(function (error) { return console.log(error); });
});
app.post('/posts', upload_1.default.array('files'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, newPost;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = JSON.parse(req.body.data);
                newPost = new Post_1.default({
                    category: body.category,
                    text: body.text,
                    user: body.user_id,
                });
                if (req.files.length > 0) {
                    newPost.files = req.files.map(function (file) {
                        return ({ name: file.filename, fileType: file.mimetype.startsWith('image') ? 'image' : 'video' });
                    });
                }
                if (/#[\p{L}]+/ugi.test(body.text)) {
                    newPost.tags = body.text.match(/#[\p{L}]+/ugi);
                }
                return [4 /*yield*/, newPost.save()];
            case 1:
                _a.sent();
                newPost.populate('user', (function (e, p) { return res.send(p); }));
                return [2 /*return*/];
        }
    });
}); });
app.get('/posts', function (_, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).send;
                return [4 /*yield*/, Post_1.default.find({}).sort({ _id: 'desc' }).populate('user', 'image name username')];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
app.delete('/posts/:id', function (req, res) {
    Post_1.default.findByIdAndDelete(req.params.id).then(function () { return res.send('Deleted'); }).catch(function (error) { return console.log(error); });
});
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "build")));
app.use(express_1.default.static("build"));
app.use(function (_, res) {
    res.sendFile(path_1.default.join(__dirname, "..", "build", 'index.html'));
});
app.listen(config_1.PORT, function () {
    console.log('App is listening on ' + config_1.PORT);
});
