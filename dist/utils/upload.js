"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var fs_1 = __importDefault(require("fs"));
var saveFolder = 'uploads';
if (!fs_1.default.existsSync(saveFolder)) {
    fs_1.default.mkdirSync(saveFolder);
}
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, saveFolder);
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, Date.now() + "-" + fileName);
    },
});
var upload = multer_1.default({
    storage: storage,
});
exports.default = upload;
