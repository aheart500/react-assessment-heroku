import {Schema, model, Document, Model} from 'mongoose'
import { UserDocument } from './User'

export interface fileType {
    name: string, 
    fileType: 'image'| 'video'
}

export interface PostDocument extends Document {
    user: UserDocument,
    text: string,
    files?: fileType,
    category: string,
    likers?: [UserDocument]
    tags?: Array<string> 
}

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    likers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    category: String,
    text: String,
    files: [{
        name: String,
        fileType: String
    }],
    tags: [{type: String}]
})

  
const Post = model<PostDocument, Model<PostDocument>>('Post', PostSchema)
export default Post
