
const express = require("express");
const mongoose = require("mongoose");

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


main().catch(err => console.log(err));

async function main() {
  const { Schema, model } = mongoose;
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DATABASE_AUTHENTIFICATION}`);

    const contentsSchema = new Schema({
      title: String,
      content: String
    })

    const postsSchema = new Schema({
      postTitle: String,
      postBody: String
    })

    const Content = model("Content", contentsSchema);
    const Post = model("Post", postsSchema)
    
    const homePage = new Content({
      title: "Home", content: `Ejs and Node.js Challenge for Daily Journal ! Lorem ipsum dolor sit amet consectetur adipisicing elit. In modi dicta pariatur! Vitae placeat quasi sed tenetur similique illum omnis officiis quia fuga, nam numquam ratione culpa impedit commodi ut! Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed.`})

    const aboutPage = new Content({
      title: "About", content: `Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut.Cursus mattis molestie a iaculis at eratpellentesque adipiscing.`})

    const contactPage = new Content({
      title: "Contact", content: `Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enimneque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.`})
      

    app.get("/", async (req, res) => {
      try {
        const result = await Content.findOne({ title: "Home" }).exec();
        const postResult = await Post.find({});
        if (!result) {
          homePage.save(function (err) {
            if(!err) {
              res.redirect("/")
            }
          });
        } else {
          res.render("home", { homeTitle: result.title,
                               homeContent: result.content, 
                               postContents: postResult })
        }
      } catch (err) {
        console.log(err)
      }
    })

    app.get("/about", async (req, res) => {
      try {
        const result = await Content.findOne({ title: "About" }).exec();
        if (!result) {
          aboutPage.save(function (err) {
            if(!err) {
              res.redirect("/about")
            }
          });
        } else {
          res.render("about", { aboutTitle: result.title,
                                aboutPage: result.content })
        }
      } catch (err) {
        console.log(err)
      }
    })

    app.get("/contact", async (req, res) => {
      try {
        const result = await Content.findOne({ title: "Contact" }).exec();
        if (!result) {
          contactPage.save(function (err) {
            if(!err) {
              res.redirect("/contact")
            }
          });
        } else {
          res.render("contact", { contactTitle: result.title, 
                                  contactPage: result.content })
        }
      } catch (err) {
        console.log(err)
      }
    })


    app.get("/compose", (req, res) => {
      res.render("compose")
    })


    app.post("/compose", (req, res) => {
      const titleName = req.body.postTitle
      const postContent = req.body.post

      const newPost = new Post({ postTitle: titleName, postBody: postContent })
      newPost.save(function (err) {
        if (!err) {
          res.redirect("/")
        }
      });
    })

    app.get("/posts/:id", async (req, res) => {
      const requestId = req.params.id
      try {
        const result = await Post.findById(requestId).exec();

        if (result) {
          res.render("post", {title: result.postTitle, content: result.postBody })
        }
      } catch(err) {
        console.log(err)
      }
    })

  
  } catch (err) {
    console.log(`Process failed... ${err}`);
    process.exit(1)
  }

}



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000
}

app.listen(port, () => {
  console.log(`app is running on port ${port}`)
})
