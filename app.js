import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import _ from 'lodash';
import ejs from 'ejs';
import bcrypt from 'bcrypt';
const saltRounds = 10;



const homeStartingContent = "Blogspot is an INDIAN online content management system . which enables its users to write blogs with time-stamped entries. my Labs developed it. Google hosts the blogs, which can be accessed through a subdomain of blogspot.com. Blogs can also be accessed from a user-owned custom domain (such as www.example.com) by using DNS facilities to direct a domain to Google's servers.[1][3][4] A user can have up to 100 blogs or websites per account.Google Blogger also enabled users to publish blogs and websites to their own web hosting server via FTP until May 1, 2010. All such blogs and websites had to be redirected to a blogspot.com  servers via DNS.";
const aboutContent = "Since 1999, millions of people have expressed themselves on Blogger. From detailed posts about almost every apple variety you could ever imagine to a blog dedicated to the art of blogging itself, the ability to easily share, publish and express oneself on the web is at the core of Blogger’s mission. As the web constantly evolves, we want to ensure anyone using Blogger has an easy and intuitive experience publishing their content to the web.  That’s why we’ve been slowly introducing an improved web experience for Blogger. Give the fresh interface a spin by clicking “Try the New Blogger” in the left-hand navigation pane. ";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://0.0.0.0:27017/projectDB');
  
  };
 
  const postSchema=new mongoose.Schema({
    title:String,
    content:String

  });
  const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

  const User=mongoose.model("User",userSchema);
const Post=mongoose.model("Post",postSchema);





app.get("/",(req,res)=>{
    pos().catch(err=> console.log(err));
  async function pos(){
    const posts=await Post.find({});
    res.render("home", {
 
      startingContent: homeStartingContent,
 
      posts: posts  
  });
}
});

app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
  });
  
  app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
  });
  app.get("/login",(req,res)=>{
    res.render("login.ejs");
  })
  app.post("/login",(req,res)=>{
    const username=req.body.username;
    const Password=req.body.password;
    User.findOne({email:username}).then((data)=>{
        if(data){
            bcrypt.compare(Password, data.password, function(err, result) {
                // result == true
                if(result===true){
                    res.render("compose");
                }
                else{
                    console.log(err);
                }
            });
        }
    }).catch((err)=>{
        console.log(err);
    })
  })

  app.get("/register",(req,res)=>{
    res.render("register.ejs");
  });
  app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      const newUser=new User({
          email:req.body.username,
          password:hash
      });
      newUser.save().then(()=>{
          res.render("compose");
          console.log("registered user succesfully");
      }).catch((err)=>{
          console.log(err);
      })
  });
  })
  
  app.get("/compose", function(req, res){
    if(req.isAuthenticated()){
      res.render("compose");
    }
    else{
      res.redirect("login");
    }
  });

  app.post("/compose", function(req, res){
     const post=new Post({
       title:req.body.postTitle,
       content:req.body.postBody
     });
     post.save();
     //posts.push(post);
     res.redirect("/");
   });

   app.get("/posts/:postId", function(req, res){
    //const requestedTitle = _.lowerCase(req.params.postName);
    const requestPostId=req.params.postId;
     Post.findOne({_id:requestPostId}).then((post)=>{
        res.render("post",{
            title:post.title,
            content:post.content
     })
      }).catch((err)=>{
        console.log(err);
      });
    });


app.listen(3000,()=>{
    console.log("Server running on port 3000");
});