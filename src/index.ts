import express, { NextFunction, RequestHandler } from 'express'
import mongoose from 'mongoose'
import User from './models/User'
import { MONGODB_URI, PORT, SECRET } from './utils/config'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import path from 'path'
import upload from './utils/upload'
import Post, { PostDocument } from './models/Post'
const app = express()
app.use(cors({
    origin: ['https://tender-euler-c623cf.netlify.app', 'https://nasser-react.herokuapp.com']
}) as RequestHandler)

app.use(express.json())
app.use('/uploads', express.static('app/uploads'))

mongoose.connect(MONGODB_URI!, {useNewUrlParser: true ,useUnifiedTopology: true})
.then(()=> console.log('MongoDB connected successfully')).catch(err=> console.log(err))

app.get('/users', async(_,res)=>{
    res.send(await User.find({}))
})
app.post('/users',upload.single('image') ,(req,res)=>{
    let newUser = JSON.parse(req.body.data)
    if(req.file && req.file.filename){
        newUser.image= req.file.filename
    }
    User.create(newUser).then(user=>{
        res.send(jwt.sign({id : user._id}, SECRET))
    }).catch(err=> console.log(err)) 
  
})
app.post('/login', async (req,res)=>{
    const {username, password} = req.body
    if(!username || !password){res.send(null); return}
    try{
        const user = await User.findOne({username}).select('password')
        if(!user|| !(await user.matchesPassword(password))){ 
            res.send(null)
            return
        }else{ 
            res.send(jwt.sign({id : user._id}, SECRET))
        }
    }catch(e){
        console.log(e)
    }
})

const verifyToken = (req: any,res: any, next: NextFunction)=>{
    const auth = req.headers.authorization || null;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).send("Access Denied");
    try {
        const token = jwt.verify(auth.substring(7), SECRET) as {id: string};
        req.user_id = token.id;
        next();
    } catch (e) {
        res.status(401).send('Not Authorized');
  }
}
app.get('/me', verifyToken, (req:any, res)=>{
    User.findById(req.user_id).then(user=> res.send(user)).catch(error=> console.log(error))
})

app.post('/posts', upload.array('files'),async(req,res)=>{
    const body = JSON.parse(req.body.data)
    let newPost= new Post({
        category: body.category,
        text: body.text,
        user: body.user_id,
    })
    if(req.files.length > 0){
        newPost.files = (req as any).files.map((file: Express.Multer.File)=> 
        ({name: file.filename, fileType: file.mimetype.startsWith('image')? 'image': 'video'}) )
    }  
    if(/#[\p{L}]+/ugi.test(body.text)){
        newPost.tags = body.text.match(/#[\p{L}]+/ugi)
    }
    await newPost.save()
    newPost.populate('user',((e,p) => res.send(p)))
})
app.get('/posts', async(_,res)=>{
    res.send(await Post.find({}).sort({_id: 'desc'}).populate('user','image name username'))
})
app.delete('/posts/:id',(req,res)=>{
    Post.findByIdAndDelete(req.params.id).then(()=> res.send('Deleted')).catch(error=> console.log(error))
})
app.use(express.static(path.join(__dirname, "build")));
app.use(express.static("app/build"));
app.use((_, res) => {
    res.sendFile(path.join(__dirname,"build", 'index.html'));
});
app.listen(PORT, ()=>{
    console.log('App is listening on '+ PORT)
})