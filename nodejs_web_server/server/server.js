var express = require('express')
var bodyParser = require('body-parser')
const rp = require("request-promise-native")
var app = express()
var http = require('http').Server(app)
var io = require('socket.io').listen(http);
var port = 8003

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')

const PredictUrl = "https://fndtfidflg.herokuapp.com/predict";

// app.get('/', (req, res) => {
//   res.render('pages/index')
// })

app.get('/user/:username', (req, res) => {
    res.render('pages/user', {username : req.params.username} )
    //console.log(new Date() + ': New access user ' + req.params.username)
})

app.post('/newpost/', bodyParser.json(), async(req, res) => {
    let json = (req.body)
    //var querycmd = 'UPDATE public."contestants" SET (name, score) = (\'' + json[i].name + '\', ' + json[i].score + ') WHERE position = ' + position
    console.log(new Date() + ": New post from: " + json._user_name + " with title ''" + json._title + "'' and content ''" + json._content + "''.")
    if (json._title.trim() != '') {
        let titleLower = json._title.toLowerCase()
        let postContent = json._content.toLowerCase()
        if (titleLower.includes('corona virus')
            || titleLower.includes('coronavirus')
            || titleLower.includes('covid')
            || titleLower.includes('covid-19')
            || titleLower.includes('covid19')
            || titleLower.includes('corona')
            || titleLower.includes('corona disease')) {
            let prediction = await rp({ url: PredictUrl,
                body: {content_: json._content},
                json: true,
                method: 'POST',
                timeout: 180000})
            console.log(prediction)
            res.status(200).json({"result": prediction.result})
            if (prediction.result == 'TRUE') {
                io.emit('new post', {
                    user_id: "1608019690",
                    user_name: json._user_name,
                    user_full_name: json._user_full_name,
                    warning_text: '',
                    more_info: MoreInformationText,
                    timestamp: json._timestamp,
                    title: json._title,
                    content: json._content
                })
            }
            else if (prediction.result == 'FAKE') {
                io.emit('new post', {
                    user_id: "1608019690",
                    user_name: json._user_name,
                    user_full_name: json._user_full_name,
                    warning_text: FakeNewsWarningText,
                    more_info: '',
                    timestamp: json._timestamp,
                    title: json._title,
                    content: json._content
                })
            }
        }
        else if (json._content.trim() != '') {
            if (postContent.includes('corona virus')
                || postContent.includes('coronavirus')
                || postContent.includes('covid')
                || postContent.includes('covid-19')
                || postContent.includes('covid19')
                || postContent.includes('corona')
                || postContent.includes('corona disease')) {
                let prediction = await rp({ url: PredictUrl,
                    body: {content_: json._content},
                    json: true,
                    method: 'POST',
                    timeout: 180000})
                console.log(prediction)
                res.status(200).json({"result": prediction.result})
                if (prediction.result == 'TRUE') {
                    io.emit('new post', {
                        user_id: "1608019690",
                        user_name: json._user_name,
                        user_full_name: json._user_full_name,
                        warning_text: '',
                        more_info: MoreInformationText,
                        timestamp: json._timestamp,
                        title: json._title,
                        content: json._content
                    })
                }
                else if (prediction.result == 'FAKE') {
                    io.emit('new post', {
                        user_id: "1608019690",
                        user_name: json._user_name,
                        user_full_name: json._user_full_name,
                        warning_text: FakeNewsWarningText,
                        more_info: '',
                        timestamp: json._timestamp,
                        title: json._title,
                        content: json._content
                    })
                }
            }
            else {
                res.status(200).json({"result": "not applied"})
                io.emit('new post', {
                    user_id: "1608019690",
                    user_name: json._user_name,
                    user_full_name: json._user_full_name,
                    warning_text: '',
                    more_info: '',
                    timestamp: json._timestamp,
                    title: json._title,
                    content: json._content
                })
            }   
        }
        else {
            res.status(200).json({"result": "not applied"})
            io.emit('new post', {
                user_id: "1608019690",
                user_name: json._user_name,
                user_full_name: json._user_full_name,
                warning_text: '',
                more_info: '',
                timestamp: json._timestamp,
                title: json._title,
                content: json._content
            })
        }
    }
    else {
        res.status(400).json({"result": "bad request"})
    }
})

io.on('connection', function(socket){
    console.log(new Date() + ': a user has been connected')
    socket.on('disconnect', function(){
        console.log(new Date() + ': a user has been DISCONNECTED')
    })
})

var FakeNewsWarningText = "this might be fake news. For more information about COVID-19, <a href=\'https:\/\/www.who.int/emergencies/diseases/novel-coronavirus-2019\'>click here</a>"
var MoreInformationText = "For more information about COVID-19, <a href='https://www.who.int/emergencies/diseases/novel-coronavirus-2019'>click here</a>"

app.get('/getposts/', (req, res) => {
    res.status(200).json(
        [
            {user_id: "1608019690", user_name: "@GotamKyrieAnthonsen", user_full_name: "", warning_text: "", more_info: "", timestamp: "at 15:39 on 08/11/2020", title: "Texas-led anti-trust suit filed against Google", content: "Texas, backed by nine other US states, has filed an anti-trust lawsuit against Google, claiming the search-engine giant harms competition in the online advertising market. The Texas attorney-general says the state authorities filed the suit with a federal district court on Wednesday. Ken Paxton said, \"Google repeatedly used its monopolistic power to control pricing and engage in market collusions to rig auctions in a tremendous violation of justice.\". The plaintiffs say Google's actions harm the interests of businesses and consumers. The lawsuit seeks monetary damages and asks that competition be restored to the markets. A Google spokesperson says it will defend itself from \"baseless claims.\" It adds that digital ad prices have fallen over the last decades, proof that competition exists."},
            {user_id: "1608019690", user_name: "@AldonaVsevolodHayashi", user_full_name: "", warning_text: "", more_info: "", timestamp: "at 15:39 on 09/14/2020", title: "Fed vows to keep stimulus flowing", content: "The US Federal Reserve says it's going to keep buying bonds at its current pace to make ample funds available to the financial system, in a bid to support the economy amid a resurgence of coronavirus infections."},
            {user_id: "1608019690", user_name: "@BrendanCharonMacConmara", user_full_name: "", warning_text: "", more_info: "", timestamp: "at 15:39 on 10/12/2020", title: "UN environment chief calls for swift action on climate change", content: "The United Nations' environment chief says a handful of countries hold the key to averting climate disaster. Without significant progress from the biggest carbon emitters, including the US, China, and Japan, she warns that the world will soon pass the point of no return."},
            {user_id: "1608019690", user_name: "@DianaBlakeBachmann", user_full_name: "", warning_text: "", more_info: "For more information about COVID-19, <a href='https://www.who.int/emergencies/diseases/novel-coronavirus-2019'>click here</a>", timestamp: "at 15:39 on 11/13/2020", title: "Tokyo raises healthcare alert to top level", content: "The Tokyo Metropolitan Government has raised its healthcare alert to the highest level for the first time as coronavirus infections continue to spread."},
            {user_id: "1608019690", user_name: "@IngeLorenzoRowe", user_full_name: "", warning_text: "", more_info: "", timestamp: "at 15:39 on 12/10/2020", title: "US: Vietnam, Switzerland currency manipulators", content: "The US has formally accused Vietnam and Switzerland of currency manipulation. Washington says the countries are intervening against the dollar and hurting US trade interests. The designation comes after the Treasury Department submitted a report on the currency policies of US trade partners to Congress on Wednesday. The report says Vietnam is deliberately devaluing the dong to boost exports, an accusation the Trump administration has made in the past. The US Trade Representative's office is currently conducting a separate investigation into the country's trade practices."}
        ])
})

// http.listen(port, function(){
//     console.log(new Date() + ': listening on *:' + port)
//   })
  server = http.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to request on port ${process.env.PORT}`)
  })