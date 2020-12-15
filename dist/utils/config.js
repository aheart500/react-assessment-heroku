"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.MONGODB_URI = exports.PORT = void 0;
require("dotenv/config");
exports.PORT = process.env.PORT || 3001;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.SECRET = process.env.SECRET || 'SECRET';
