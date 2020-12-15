import {Schema, model, Document, Model} from 'mongoose'
import {hash, compare} from 'bcrypt'
import { PostDocument } from './Post'
export interface UserDocument extends Document {
    name: string
    email: string
    username: string
    password: string
    description: string
    age: number,
    image: string,
    posts: [PostDocument],
    matchesPassword: (password: string) => Promise<boolean>
}

export interface UserModel extends Model<UserDocument> {
  hash: (password: string) => Promise<string>
}

const UserSchema = new Schema({
    username: String,
    email: String,
    name: String,
    password: String,
    description: String,
    age: Number, 
    image: String,
    posts: [{type: Schema.Types.ObjectId,ref:'Post'}]
})

UserSchema.pre('save', async function(this: UserDocument) {
    if (this.isModified('password')) {
      this.password = await User.hash(this.password)
    }
  })
UserSchema.statics.hash = (password: string): Promise<string> => hash(password, 10)

UserSchema.methods.matchesPassword = function(
    this: UserDocument,
    password: string
  ): Promise<boolean> {
    return compare(password, this.password)
  }
  
const User = model<UserDocument, UserModel>('User', UserSchema)
export default User
