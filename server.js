var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var app = express();
var path = require("path")
var SERVER_SECRET = process.env.SECRET || "1234";
var jwt = require('jsonwebtoken')
var { userModel, tweetmodel } = require('./dbcon/modeles');
var authRoutes = require('./route/auth')
var http = require("http");
var socketIO = require("socket.io");
var server = http.createServer(app);
var io = socketIO(server);
var fs = require("fs")
var multer = require("multer")
// var admin = require("firebase-admin")



const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})

var upload = multer({ storage: storage })

const admin = require("firebase-admin");

// var serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
var serviceAccount = {
    "type": "service_account",
    "project_id": "tweeter-f44e3",
    "private_key_id": "306c1e4b1b6c5f720754374f02dae26c6774d036",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/Xy0Sg6+Is99H\nIzn2xcvFGrYAwWpU8AS9hrHNDzVDCcP3NnseLK3jcaXPgaTYXQDwvpYIMGPCvTCw\nUULPr7SBydo3rSQIBXbMgCE2+qJoGeoKLv1P9W6rINn6unqQNg1LOFrChPpgUCdD\nUDATgpnFxy/UXDCvprq0ZEvmKgxr483eeDFAF6JvS527DzkoO9h6mrFtw4e4Yv7o\nEaxWrKuRjzQuk9TQ2gciXs4b99YkPg7544VlEKCfxH3lYiFGCj9RMZTmkwcHRxBt\nTmQct+2va6eGUNKKSV6ZWR9k42d32A35kwyHGcaUQ+VEVtpLpTXXTweASAx7KzM+\nGNgXfbdxAgMBAAECggEACDWll+hsKaKxQLKOOlPPhzbrUT6a4JZMFsMSKjJFgjjn\nVinpN9D5+/KIdt2YeDNrrpg3dJYaVnyiG8M9qO4QQdvaW5Z27+znlPPncN3JRSrc\n7VdJFMK6LtdNwJW6u6hk8znRe2wj10lC+O5WBKU+8mMGTk9u438lHedaUe8yeZeQ\n8ywmltzUPM5miopT9M/DBJDkMTZilxpLAaKspHgpHseshai8jdh22NvPSJGHTOIj\nPUUkraiIFfP3Rv7DWPQnwWtlY0igJpdHJhrTDQYme29JA9CyJKLYwkkQRKEW2J0L\nSNtfQp2pxL74kf+jUjpI8QEe9kFpHvaEoxIQRIqf4QKBgQDwkkUe0+p0BCC7RyGY\n/hhNXJtKNxM81fQJexHdId2+wSVnqzPYQNrfm0snDT8pQxbz0dp1HXZa+vHcZkzA\nyHWAPFNpWp1e7S2rcjWlSWsb665tWhV54dMKWDfhOaUQYAu293dCFH0QTYsF/LQZ\nVWwlt5rI2cVsTuvYfKUUNVWv0QKBgQDLpSQqgvK1SiQnk228pxJJYmDJmLcmr1aq\nQ9qJR14dZH12XbX7RNJ03i/FOymqb0fdKTIYUQIDuGJEzegKEzzv+NwduVDiYCO9\n38mtUQUCYY+8111sIBVFtpG4qwU0VKmYD2TtVETRmf0bfmj9MlVX6xz64C73nxjY\ndPsEG84VoQKBgGhErWq4JNUV+O3S3bAG6ZeWPMRE7LSgcv4s9kgm5opIAqNVI8pm\nCbeDAmaxqh+DMY6J9Spvk53JSEzjlf60o6DqBKkUGkNLf1Dg1nmGQcM/OkGxGr/R\n7ft80vNuXamkR0+NIIZmhPIs+cWlipW0XYRXeOH26UeRSU1ycMY6e6IRAoGBAIbD\n0H05jzidyfNOwy43OgjKS9bdc0bsfePLZ5G1Yvj8iXKNbWLNFqE0cFSLZHVfkyUu\nn/IrmbOwj4eM4+PW+1qrS6939aj5im2a7TH/DduXiLGlrDNjv/AUc7bLpnQNGvaA\nKYBNZgV3bGKHcx8r8gJumw0C0tIXvS9xqrP7WpRBAoGBAKGGusLfh+xnOCiO38PY\nxNqum6juxCo6zk+tnntHAnEOBmG8zTCI/Q6NuAPUfxU4h6PWCa0NPwD/WUg9F84v\nS6YzrFYqzwRkWAAF6NwZz5oYvv1nnPWKyjbKdlirjx+IOWi0OI8hgeviFOpOHMyr\n5ksR8zQ1MZxuJx0JqQlVTSqE\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-q22hu@tweeter-f44e3.iam.gserviceaccount.com",
    "client_id": "117753434392719288675",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q22hu%40tweeter-f44e3.iam.gserviceaccount.com"
  }
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tweeter-f44e3-default-rtdb.firebaseio.com/"
});
const bucket = admin.storage().bucket("gs://tweeter-f44e3.appspot.com");

//==============================================


io.on("connection", () => {
    console.log("user Connected")
})


app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(morgan('dev'));

app.use("/", express.static(path.resolve(path.join(__dirname, "public"))))

app.use('/', authRoutes);
// app.use('/',authRoutes);

app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies.jToken);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 300000000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    userModel.findById(req.body.jToken.id, 'name email phone gender  createdOn profilePic',
        function (err, doc) {
            if (!err) {
                res.send({
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})
app.post(`/tweet`, (req, res, next)=>{

    
    userModel.findOne({ email: req.body.userEmail }, (err, user) => {
        // console.log("khsajhfkjdha" + user)
        if (!err) {
            tweetmodel.create({
                "name": req.body.userName,
                "tweet": req.body.tweet,
                "profilePic": user.profilePic
            }).then((data) => {
                // console.log( "jdjhkasjhfdk" +  data)
                res.send({
                    status: 200,
                    message: "Post created",
                    data: data
                })
                
                console.log(data)
                io.emit("NEW_POST", data)
                
            }).catch(() => {
                console.log(err);
                res.status(500).send({
                    message: "user create error, " + err
                })
            })
        }
        else {
            console.log(err)
        }
    })
    
})

// app.post('/tweet', (req, res, next) => {
//     // console.log(req.body)

//     if (!req.body.userName && !req.body.tweet || !req.body.userEmail) {
//         res.status(403).send({
//             message: "please provide email or tweet/message"
//         })
//     }
//     var newTweet = new tweetmodel({
//         "name": req.body.userName,
//         "tweet": req.body.tweet
//     })
//     newTweet.save((err, data) => {
//         if (!err) {
//             res.send({
//                 status: 200,
//                 message: "Post created",
//                 data: data
//             })
//             console.log(data.tweet)
//             io.emit("NEW_POST", data)
//         } else {
//             console.log(err);
//             res.status(500).send({
//                 message: "user create error, " + err
//             })
//         }
//     });
// })

app.get('/getTweets', (req, res, next) => {

    console.log(req.body)
    tweetmodel.find({}, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
            // data = data[data.length -1]
            res.send(data)
        }
    })
})

/////////////////////////////// profile

app.post("/upload", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    bucket.upload(
        req.files[0].path,
        // {
        //     destination: `${new Date().getTime()}-new-image.png`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        // },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        userModel.findOne({ email: req.body.email }, (err, users) => {
                            console.log(users)
                            if (!err) {
                                users.update({ profilePic: urlData[0] }, {}, function (err, data) {
                                    console.log(users)
                                    res.send({
                                        status: 200,
                                        message: "image uploaded",
                                        picture: users.profilePic
                                    });
                                })
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)

                        } catch (err) {
                            console.error(err)
                        }


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})