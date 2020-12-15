"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PostSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    likers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    category: String,
    text: String,
    files: [{
            name: String,
            fileType: String
        }],
    tags: [{ type: String }]
});
var Post = mongoose_1.model('Post', PostSchema);
exports.default = Post;
