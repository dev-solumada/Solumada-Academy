const express = require('express');
const routeExp = express.Router()
const mongoose = require('mongoose')
// solumada-academy : academy123456

const UserSchema = require("../models/User");
const CoursModel = require("../models/CoursModel");
const nodemailer = require('nodemailer');

//Mailing
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'developpeur.solumada@gmail.com',
        pass: 'S0!um2d2'
    }
});
function sendEmail(receiver, subject, text) {
    var mailOptions = {
        from: 'Timesheets Optimum solution',
        to: receiver,
        subject: subject,
        html: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

//Function Random code for verification
function randomCode() {
    var code = "";
    let v = "012345678";
    for (let i = 0; i < 6; i++) { // 6 characters
        let char = v.charAt(Math.random() * v.length - 1);
        code += char;
    }
    return code;
}


//Function random password for new user
function randomPassword() {
    var code = "";
    let v = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!é&#";
    for (let i = 0; i < 8; i++) { // 6 characters
        let char = v.charAt(Math.random() * v.length - 1);
        code += char;
    }
    return code;
}

//Function html render
function htmlRender(username, password) {
    var html = '<center><h1>Your Timesheets Authentification</h1>' +
        '<table border="1" style="border-collapse:collapse;width:25%;border-color: lightgrey;">' +
        '<thead style="background-color: #619FCB;color:white;font-weight:bold;height: 50px;">' +
        '<tr>' +
        '<td align="center">Username</td>' +
        '<td align="center">Password</td>' +
        '</tr>' +
        '</thead>' +
        '<tbody style="height: 50px;">' +
        '<tr>' +
        '<td align="center">' + username + '</td>' +
        '<td align="center">' + password + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';
    return html;
}
//Page login
routeExp.route("/").get(async function (req, res) {
    session = req.session;
    if (session.type_util == "Professeur") {
        res.redirect("/cours");
    }
    else if (session.type_util == "Admin") {
        res.redirect('/admin');
    }
    else if (session.type_util == "Participant") {
        res.redirect('/mon_cours');
    }
    else {
        res.render("LoginPage.html", { erreur: "" });
    }

});

//List cours == professeur
routeExp.route("/cours").get(async function (req, res) {
    session = req.session;
    if (session.type_util == "Professseur") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var projects = await projectSchema.find({ status: 'In Progress' });
                res.render("Cours.html", { available_project: projects });
            });
    }
    else {
        res.redirect("/");
    }
});
//admin
routeExp.route("/admin").get(async function (req, res) {
    session = req.session;
    if (session.type_util == "Admin") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var projects = await projectSchema.find({ status: 'In Progress' });
                res.render("Admin.html", { available_project: projects });
            });
    }
    else {
        res.redirect("/");
    }
});
//Post login
routeExp.route("/login").post(async function (req, res) {
    session = req.session;
    var email = req.body.username;
    var password = req.body.pwd;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var logger = await UserSchema.findOne({ username: email, password: password });
            if (logger) {
                if (logger.type_util == "professeur") {
                    session.m_code = logger.m_code;
                    session.num_agent = logger.num_agent;
                    session.type_util = logger.type_util;
                    res.redirect("/accueilProf");
                } else if (logger.type_util == "participant") {
                    session.m_code = logger.m_code;
                    session.num_agent = logger.num_agent;
                    session.type_util = logger.type_util;
                    res.redirect("/accueilParticip");
                } else {
                    session.type_util = logger.type_util;
                    res.redirect("/accueilAdmin");
                }
            } else {
                res.render("LoginPage.html", {
                    erreur: "Email or password is wrong",
                });
            }
        });
});

//Add employee
routeExp.route("/addemp").post(async function (req, res) {
    var email = req.body.email;
    var mcode = req.body.mcode;
    var num_agent = req.body.num_agent;
    var type_util = req.body.type_util;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await UserSchema.findOne({ $or: [{ username: email }, { m_code: mcode }, { num_agent: num_agent }, { type_util: type_util }] })) {
                res.send("error");
            } else {
                var passdefault = randomPassword();
                var new_emp = {
                    username: email,
                    password: passdefault,
                    m_code: mcode,
                    num_agent: num_agent,
                    type_util: type_util
                };
                await UserSchema(new_emp).save();
                sendEmail(email, "Authentification Timesheets", htmlRender(email, passdefault));
                res.send(email);
            }
        });

});

//New employee
routeExp.route("/newemployee").get(async function (req, res) {
    // session = req.session;
    res.render("AvecBack/newemployee.html");
    // if (session.type_util == "admin") {
    //     res.render("newemployee.html");
    // }
    // else {
    //     res.redirect("/");
    // }
});

//liste cours
routeExp.route("/listeCours").get(async function (req, res) {
    session = req.session;
    // res.render("newemployee.html");
    if (session.type_util == "admin") {
        res.render("ListeCours.html");
    }
    else {
        res.redirect("/");
    }
});
//Accueil admin
routeExp.route("/accueilAdmin").get(async function (req, res) {
    session = req.session;
    // res.render("newemployee.html");
    if (session.type_util == "admin") {
        res.render("accueilAdmin.html");
    }
    else {
        res.redirect("/");
    }
});

//Accueil Professeur
routeExp.route("/accueilProf").get(async function (req, res) {
    session = req.session;
    // res.render("newemployee.html");
    if (session.type_util == "professeur") {
        res.render("accueilProf.html");
    }
    else {
        res.redirect("/");
    }
});

//Accueil Participant
routeExp.route("/accueilParticip").get(async function (req, res) {
    session = req.session;
    if (session.type_util == "participant") {
        res.render("accueilParticip.html");
    }
    else {
        res.redirect("/");
    }
});

//New Cours
routeExp.route("/newcours").get(async function (req, res) {
    // session = req.session;
    res.render("newCours.html");
    // if (session.type_util == "admin") {
    //     res.render("newCours.html");
    // }
    // else {
    //     res.redirect("/");
    // }
});

//Add new cours
routeExp.route("/addcours").post(async function (req, res) {
    var name_Cours = req.body.name_Cours;
    var date_Commenc = req.body.date_Commenc;
    var nbParticp = req.body.nbParticp;
    var professeur = req.body.professeur;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await CoursModel.findOne({ $or: [{ name_Cours: name_Cours }, { date_Commenc: date_Commenc }, { professeur: professeur }] })) {
                res.send("error");
            } else {
                // var passdefault = randomPassword();
                var new_cours = {
                    name_Cours: name_Cours,
                    date_Commenc: date_Commenc,
                    nbParticp: nbParticp,
                    professeur: professeur
                };
                console.log("new cours === ", new_cours)
                await CoursModel(new_cours).save();
                // sendEmail(email, "Authentification Timesheets", htmlRender(email, passdefault));
                // res.send(email);
            }
        });

});

module.exports = routeExp;