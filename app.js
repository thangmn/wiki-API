const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", { useNewUrlParser: true });

const articleShcema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleShcema);

////////////////////////////////////////////////// Request Targetting All Articles ////////////////////////////////////////////////
app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("deleted successfully");
            } else {
                res.send(err);
            }
        });
    });
////////////////////////////////////////////////// Request Targetting A Articles ////////////////////////////////////////////////
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })
    .put(function (req, res) {
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully update article");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Successfully update article.");
                } else {
                    res.send(err);
                }
            }
        );

    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("Successfully delete article.");
                } else {
                    res.send(err);
                }
            }
        )
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});