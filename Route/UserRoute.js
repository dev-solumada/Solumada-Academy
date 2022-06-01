const express = require('express');
const routeExp = express.Router()
const mongoose = require('mongoose')
// solumada-academy : academy123456

const UserSchema = require("../Models/User");
const CoursModel = require("../Models/CoursModel");
const nodemailer = require('nodemailer');
const GroupeModel = require("../Models/GroupeModel");
const NiveauModel = require("../Models/NiveauModel");
const CGNModel = require("../Models/CGNModel");
const EmplTemp = require("../Models/EmploiDuTemps");
const ParcoursModel = require("../Models/Parcours");
const session = require('express-session');
//const AbsentModel = require("../Models/ParcoursAbsent");
//const PresentModel = require("../Models/ParcoursPresent");

var membre = [{
    cours: '',
    groupe: '',
    username: ''
}]

var coursM = []
// var time = [{
//     jours: '',
//     groupe: '',
//     heureStart: '',
//     heureFin: '',
//     cours: ''
// }]
// var parcours = [{
//     date: '',
//     groupe: '',
//     heureStart: '',
//     heureFin: '',
//     cours: ''
// }]
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
        from: 'SOLUMADA ACADEMY',
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

function htmlVerification(code) {
    return (
        "<center><h1>YOUR ACADEMY SOLUMADA CODE AUTHENTIFICATION</h1>" +
        "<h3 style='width:250px;font-size:50px;padding:8px;background-color:#84E62A,; color:white'>" +
        code +
        "<h3></center>"
    );
}
//Function html render
function htmlRender(username, password) {
    var html = '<center><h1>SOLUMADA ACADEMY AUTHENTIFICATION</h1>' +
        '<table border="1" style="border-collapse:collapse;width:25%;border-color: lightgrey;">' +
        '<thead style="background-color: #84E62A,;color:white;font-weight:bold;height: 50px;">' +
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
        '</table>' +
        '<h4 style="color: rgba(202, 38, 17);">Une vision à 360 °</h4>';

    return html;
}
//Page login
routeExp.route("/").get(async function (req, res) {
    var session = req.session;
    //res.render("LoginPage.html", { erreur: "" });
    if (session.type_util == "Professeur") {
        res.redirect("/teacherHome");
    }
    else if (session.type_util == "Admin") {
        res.redirect('/accueilAdmin');
    }
    else if (session.type_util == "Participant") {
        res.redirect('/accueilParticip');
    }
    else {
        res.render("LoginPage.html", { erreur: "" });
    }

});

//logout
routeExp.route("/logout").get(function (req, res) {
    var session = req.session;
    session.type_util = null;
    res.redirect("/");
});

//Accueil admin
routeExp.route("/accueilAdmin").get(async function (req, res) {
    var session = req.session;
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

                //var listgroupe = await GroupeModel.find({ validation: true });
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });

                //console.log("liste " ,listgroupe)
                //console.log("obligatoire " , listcourOblig);
                //console.log("facultatif " , listcourFac);
                res.render("accueilAdmin.html", { listcourOblig: listcourOblig, listcourFac: listcourFac });
            });
    }
    else {
        res.redirect("/");
    }
});

//Accueil admin
routeExp.route("/accueilAdminBack").get(async function (req, res) {
    var session = req.session;
    //if (session.type_util == "Admin") {
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {

            //var listgroupe = await GroupeModel.find({ validation: true });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });

            listcourFac.forEach(function (listcourFac) {

                console.log("facultatif ", listcourFac.name_Cours);
            });
            //console.log("liste " ,listgroupe)
            //console.log("obligatoire " , listcourOblig);
            //console.log("facultatif " , listcourFac);
            res.render("./AvecBack/accueilAdmin.html", { listcourOblig: listcourOblig, listcourFac: listcourFac });
        });
    //}
    // else {
    //     res.redirect("/");
    // }
});

//Accueil participant
routeExp.route("/accueilParticip").get(async function (req, res) {
    var session = req.session;
    if (session.type_util == "Participant") {
        res.render("accueilParticip.html");
    }
    else {
        res.redirect("/");
    }
});

//reset password
routeExp.route("/resetPwd").get(async function (req, res) {
    //Reset password
    var session = req.session;
    if (session.mailconfirm) {
        res.redirect("/code");
    } else {
        res.render("resetPWD.html", { err: "" });
    }//

});


//New password
routeExp.route("/code").post(async function (req, res) {
    var session = req.session;
    var email = req.body.username;
    console.log("email == " + email);
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await UserSchema.findOne({ username: email })) {
                session.mailconfirm = email;
                session.code = randomCode();
                sendEmail(
                    session.mailconfirm,
                    "Verification code solumada academy",
                    htmlVerification(session.code)
                );
                res.redirect("/code");
            } else {
                res.render("resetPwd.html", { err: "Username does not exist" });
            }
        });
});

//code
routeExp.route("/code").get(async function (req, res) {
    var session = req.session;
    if (session.mailconfirm) {
        res.render("code.html", { err: "" });
    } else {
        res.redirect("/");
    }
});

//Check code
routeExp.route("/check").post(async function (req, res) {
    var session = req.session;
    if (session.code == req.body.code) {
        res.send("match");
    } else {
        res.send("not");
    }
});


//Change password
routeExp.route("/change").post(async function (req, res) {
    var newpass = req.body.pass;
    var session = req.session;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await UserSchema.findOneAndUpdate(
                { username: session.mailconfirm },
                { password: newpass }
            );
            session.mailconfirm = null;
            session.code = null;
            res.send("Ok");
        });
});


//Drop user 
routeExp.route("/dropuser").post(async function (req, res) {
    var names = req.body.fname;
    names = names.split(" ");
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await UserSchema.findOneAndDelete({ username: names[0] });
            res.send("User deleted successfully");
        })
})

//Post login
routeExp.route("/login").post(async function (req, res) {
    var session = req.session;
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
                if (logger.type_util == "Professeur") {
                    session.m_code = logger.m_code;
                    session.num_agent = logger.num_agent;
                    session.type_util = logger.type_util;
                    session.nomProf = logger.username;
                    res.redirect("/teacherHome");
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
    var name = req.body.name;
    var email = req.body.email;
    var m_code = req.body.m_code;
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
            if (await UserSchema.findOne({ $or: [{ username: email }, { m_code: m_code }, { num_agent: num_agent }] })) {
                res.send("error");
            } else {
                var passdefault = randomPassword();
                var new_emp = {
                    name: name,
                    username: email,
                    password: passdefault,
                    m_code: m_code,
                    num_agent: num_agent,
                    type_util: type_util
                };
                console.log("new _emp " + JSON.stringify(new_emp));
                await UserSchema(new_emp).save();
                sendEmail(email, "Authentification Academy solumada", htmlRender(email, passdefault));
                res.send(email);
            }
        });

});

//New employee
routeExp.route("/newemployee").get(async function (req, res) {
    var session = req.session;
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

                var listcour = await CoursModel.find({ validation: true });
                res.render("newemployee.html", { listcour: listcour });
            });
    } else {
        res.redirect("/");
    }
});


//Accueil Professeur
routeExp.route("/teacherHome").get(async function (req, res) {
    var session = req.session;

    if (session.type_util == "Professeur") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var cours = await CoursModel.find({ professeur: req.session.nomProf});
                res.render("./teacherView/teacherHome.html", { cours: cours });
            });
    }
    else {
        res.redirect("/");
    }
});

//Cours professeur
routeExp.route("/teacherCours/:cours").get(async function (req, res) {
    var session = req.session;
    var cours = req.params.cours;

    if (session.type_util == "Admin" || session.type_util == "Professeur") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var listcours = await CoursModel.find({ professeur: req.session.nomProf});
                var listgroupe = await GroupeModel.find({ cours: cours });
                //console.log("listcours == ",listcours );
            var listUser = await UserSchema.find({ cours: cours });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });

            var time = await EmplTemp.find({ cours: cours });
            var parcours = await ParcoursModel.find({ cours: cours });

            var ParcoursAbsent = await ParcoursModel.aggregate([
                {
                    $group: {
                        _id:
                            { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])
                res.render("./teacherView/teacherCours.html", {parcours: parcours, listUser: listUser, ParcoursAbsent:ParcoursAbsent, time:time, membre:membre, listgroupe:listgroupe, listcours: listcours, cours: cours });
            });
    }
    else {
        res.redirect("/");
    }
});


//Liste membre par groupe
routeExp.route("/groupeTeacher").post(async function (req, res) {
    var groupe = req.body.groupe
    var cours = req.body.cours// 'groupe A'//'groupe C'// req.body.name_groupe;
    //var trm = name_groupe.trim()
    //console.log("name_groupe***",trm.replace(/ /g,"_"));
    //replace(/^\s+/g, ''));
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {

            //groupe == "" ? delete session.request.groupe : (session.request.groupe = {'$regex':groupe,'$options' : 'i'});
            //if (await CGNModel.find({ $or: [{ cours: cours, groupe:  name_groupe}] })) {

            var listcours = await CoursModel.find({ professeur: req.session.nomProf});
            var listgroupe = await GroupeModel.find({ cours: cours });


            membre = await CGNModel.find({ cours: cours, groupe: groupe })
            
            var listUser = await UserSchema.find({ cours: cours });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });

            var time = await EmplTemp.find({ cours: cours });
            var parcours = await ParcoursModel.find({ cours: cours });

            var ParcoursAbsent = await ParcoursModel.aggregate([
                {
                    $group: {
                        _id:
                            { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])
            //console.log("parcours == ", ParcoursAbsent);

            res.render("./teacherView/teacherCours.html", {parcours: parcours, listUser: listUser, ParcoursAbsent: ParcoursAbsent,time: time,membre: membre, listgroupe:listgroupe, listcours: listcours, cours: cours });//ParcoursAbsent: ParcoursAbsent, coursM: coursM, membre: membre, time: time, parcours: parcours, cours: cours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
            //await CGNModel(new_membre).save();
            //}
        });

});
//Global view professeur
routeExp.route("/teacherGlobalView").get(async function (req, res) {
    var session = req.session;

    if (session.type_util == "Admin" || session.type_util == "Professeur") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var cours = await CoursModel.find({ professeur: req.session.nomProf});
                res.render("./teacherView/teacherGlobalView.html", { cours: cours });
            });
    }
    else {
        res.redirect("/");
    }
});
//Accueil Participant
routeExp.route("/accueilParticip").get(async function (req, res) {
    var session = req.session;
    if (session.type_util == "participant") {
        res.render("accueilParticip.html");
    }
    else {
        res.redirect("/");
    }
});

//New Cours
routeExp.route("/newcours").get(async function (req, res) {
    var session = req.session;
    var professeur = 'Professeur'
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

                var listuser = await UserSchema.find({ type_util: professeur });
                res.render("newCours.html", { listuser: listuser });
            });
        // res.render("newCours.html");
        // if (session.type_util == "Admin") {
        //     res.render("newCours.html");
    }
    else {
        res.redirect("/");
    }
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
            if (await CoursModel.findOne({ $or: [{ name_Cours: name_Cours }] })) {
                res.send("error");
            } else {
                var new_cours = {
                    name_Cours: name_Cours,
                    date_Commenc: date_Commenc,
                    nbParticp: nbParticp,
                    professeur: professeur
                };
                await CoursModel(new_cours).save();
            }
        });

});


//Liste cours
routeExp.route("/listeCours").get(async function (req, res) {
    var session = req.session;
    if (session.type_util == "Admin") {
        //console.log('listcours == ');
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {

                var listcour = await CoursModel.find({ validation: true });
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });

                res.render("ListeCours.html", { listcour: listcour, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });


    } else {
        res.redirect("/");
    }
});

//Liste User
routeExp.route("/listeUser").get(async function (req, res) {
    var session = req.session;
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
                var listuser = await UserSchema.find({ validation: true });
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });
                res.render("ListeUser.html", { listuser: listuser, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });



    }
    else {
        res.redirect("/");
    }
});

//Liste User
routeExp.route("/listeUserBack").get(async function (req, res) {
    var session = req.session;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var listuser = await UserSchema.find({ validation: true });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            res.render("./AvecBack/listeUser.html", { listuser: listuser, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });


});


//Liste User
routeExp.route("/adminGraduation").get(async function (req, res) {
    var session = req.session;
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
                var listuser = await UserSchema.find({ validation: true });
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });
                res.render("adminGraduation.html", { listuser: listuser, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });
    }
    else {
        res.redirect("/");
    }
});
//Global view
routeExp.route("/adminGlobalview").get(async function (req, res) {
    var session = req.session;
    //if (session.type_util == "Admin") {
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var listuser = await UserSchema.find({ validation: true });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            var membre = await CGNModel.find({ validation: true })
            res.render("adminGlobalview.html", { membre: membre, listuser: listuser, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });

    // }
    // else {
    //     res.redirect("/");
    // }
});

//getuser
routeExp.route("/getuser").post(async function (req, res) {
    var id = req.body.id;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var user = await UserSchema.findOne({ _id: id });
            res.send(user.username + "," + user.email + "," + user.m_code + "," + user.num_agent + "," + user.type_util);
        });
})

//Update User
routeExp.route("/updateuser").post(async function (req, res) {
    var id = req.body.id;
    var m_code = req.body.m_code;
    var num_agent = req.body.num_agent;
    var username = req.body.username;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await UserSchema.findOneAndUpdate({ _id: id }, { m_code: m_code, num_agent: num_agent, username: username });
            res.send("User updated successfully");
        })
})

//get cours
routeExp.route("/getCours").post(async function (req, res) {
    var id = req.body.id;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var cours = await CoursModel.findOne({ _id: id });
            console.log("cours == ", cours);
            res.send(cours.name_Cours + "," + cours.date_Commenc + "," + cours.nbParticp + "," + cours.professeur);
        });
})

//Update User
routeExp.route("/updatecours").post(async function (req, res) {
    var id = req.body.id;
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
            // var user = await UserSchema.findOne({ _id: id });
            // await TimesheetsSchema.updateMany({ m_code: user.m_code }, { m_code: m_code, num_agent: num_agent });
            await CoursModel.findOneAndUpdate({ _id: id }, { name_Cours: name_Cours, date_Commenc: date_Commenc, nbParticp: nbParticp, professeur: professeur });
            // await archiveSchema.findOneAndUpdate({ m_code: m_code }, { m_code: m_code, first_name: first, last_name: last });

            res.send("Cours updated successfully");
        })
})
//Drop user 
routeExp.route("/dropcours").post(async function (req, res) {
    var names = req.body.fname;
    names = names.split(" ");
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await CoursModel.findOneAndDelete({ name_Cours: names[0] });
            res.send("Cours deleted successfully");
        })
})




//nouveau

//New Group et new niveau ==> Get
routeExp.route("/newgroupe").get(async function (req, res) {
    var session = req.session;
    //var professeur = 'Professeur'
    var type = "obligatoire"
    var cours = "cours"
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {


            var listgroupe = await GroupeModel.find({ validation: true });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });

            //console.log("liste " ,listgroupe)
            //console.log("obligatoire " , listcourOblig);
            //console.log("facultatif " , listcourFac);
            res.render("AvecBack/newGroup.html", { listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });
    // res.render("newCours.html");
    // if (session.type_util == "Admin") {
    //     res.render("newCours.html");
    // }
    // else {
    //     res.redirect("/");
    // }
});

//Post Add new groupe
routeExp.route("/addgroupe").post(async function (req, res) {
    var name_Groupe = req.body.newgroupe;
    var cours = req.body.cours;
    console.log("newgroupe ", name_Groupe, cours);
    //var type = "obligatoire"
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await GroupeModel.findOne({ $or: [{ name_Groupe: name_Groupe, cours: cours }] })) {
                res.send("error");
            } else {
                var new_gpe = {
                    name_Groupe: name_Groupe,
                    cours: cours
                };
                console.log("new groupe ", new_gpe);
                await GroupeModel(new_gpe).save();
                res.send(new_gpe.name_Groupe);
            }
        });

});


//New Niveau
routeExp.route("/newniveau").get(async function (req, res) {
    var session = req.session;
    //var professeur = 'Professeur'
    var type = "obligatoire"
    var cours = "cours"
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {


            var listgroupe = await GroupeModel.find({ validation: true });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });

            //console.log("liste " ,listgroupe)
            //console.log("obligatoire " , listcourOblig);
            //console.log("facultatif " , listcourFac);
            res.render("AvecBack/newGroup.html", { listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });
    // res.render("newCours.html");
    // if (session.type_util == "Admin") {
    //     res.render("newCours.html");
    // }
    // else {
    //     res.redirect("/");
    // }
});

//Post Add new niveau
routeExp.route("/addniveau").post(async function (req, res) {
    var name_niveau = req.body.newniveau;
    //console.log("newgroupe ", name_niveau);
    var cours = req.body.cours
    //var type = "obligatoire"
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await NiveauModel.findOne({ $or: [{ name_niveau: name_niveau, cours: cours }] })) {
                res.send("error");
            } else {
                var new_niveau = {
                    name_niveau: name_niveau,
                    cours: cours
                };
                console.log("new niveau ", new_niveau);
                await NiveauModel(new_niveau).save();
            }
        });

});


//Liste cours
routeExp.route("/listeCours/:cours").get(async function (req, res) {
    var session = req.session;
    var nomCours = req.params.cours;
    if (session.type_util == "Admin") {
        //console.log('listcours == ', req.params.cours);
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {

                var listgroupe = await GroupeModel.find({ cours: nomCours });
                var listUser = await UserSchema.find({ cours: nomCours });
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });
                var cours = listgroupe[0].cours

                var time = await EmplTemp.find({ cours: nomCours });
                parcours = await ParcoursModel.find({ cours: nomCours });

                // var ParcoursAbsent = await ParcoursModel.aggregate([
                //     { 
                //         $group : { _id : 
                //             {cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date", presence: "$presence"}, 
                //         user: { $push: "$user" } }
                //     }
                //   ])
                var ParcoursAbsent = await ParcoursModel.aggregate([
                    {
                        $match: {
                            cours: { $in: [nomCours] }
                        }
                    },
                    {
                        $group: {
                            _id:
                                { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                            tabl: { $push: { user: "$user", presence: "$presence" } }
                        }
                    }
                ])
                console.log("nom ", ParcoursAbsent);
                res.render("ListeCours.html", { ParcoursAbsent: ParcoursAbsent, coursM: coursM, parcours: parcours, time: time, membre: membre, cours: cours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });
    } else {
        res.redirect("/");
    }
});

//Liste cours
routeExp.route("/listeCoursBack/:cours").get(async function (req, res) {
    var session = req.session;
    var nomCours = req.params.cours;
    //if (session.type_util == "Admin") {
    //console.log('listcours == ', req.params.cours);
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {

            var listgroupe = await GroupeModel.find({ cours: nomCours });
            var listUser = await UserSchema.find({ cours: nomCours });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            var cours = listgroupe[0].cours
            var time = await EmplTemp.find({ cours: nomCours });
            var parcours = await ParcoursModel.find({ cours: nomCours });

            var ParcoursAbsent = await ParcoursModel.aggregate([
                {
                    $group: {
                        _id:
                            { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])

            //console.log("parcours == ", ParcoursAbsent);

            res.render("./AvecBack/ListeCours.html", { coursM: coursM, ParcoursAbsent: ParcoursAbsent, membre: membre, cours: cours, time: time, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });
    // } else {
    //     res.redirect("/");
    // }
});

//Post Add new membre in groupe
routeExp.route("/newmembre").post(async function (req, res) {
    var name_groupe = req.body.groupeVal
    var username = req.body.username
    var cours = req.body.cours
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await CGNModel.findOne({ $or: [{ cours: cours, groupe: name_groupe, username: username }] })) {
                res.send("error");
            } else {

                var user = await UserSchema.find({ username: username });
                var mcode = ""
                var num_agent = ""
                user.forEach(function (user) {
                    mcode = user.m_code
                    num_agent = user.num_agent
                });
                var new_membre = {
                    cours: cours,
                    groupe: name_groupe,
                    username: username,
                    num_agent: num_agent,
                    mcode: mcode
                };
                //console.log("new niveau ", new_membre);
                await CGNModel(new_membre).save();
                res.send(new_membre.username);
            }
        });

});

//Liste membre par groupe
routeExp.route("/groupe").post(async function (req, res) {
    var groupe = req.body.groupe
    var cours = req.body.cours// 'groupe A'//'groupe C'// req.body.name_groupe;
    //var trm = name_groupe.trim()
    //console.log("name_groupe***",trm.replace(/ /g,"_"));
    //replace(/^\s+/g, ''));
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {

            //groupe == "" ? delete session.request.groupe : (session.request.groupe = {'$regex':groupe,'$options' : 'i'});
            //if (await CGNModel.find({ $or: [{ cours: cours, groupe:  name_groupe}] })) {

            membre = await CGNModel.find({ cours: cours, groupe: groupe })

            ///console.log("membre == ", membre);
            var listgroupe = await GroupeModel.find({ cours: cours });
            var listUser = await UserSchema.find({ cours: cours });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });

            var time = await EmplTemp.find({ cours: cours });
            var parcours = await ParcoursModel.find({ cours: cours });

            var ParcoursAbsent = await ParcoursModel.aggregate([
                {
                    $group: {
                        _id:
                            { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])
            //console.log("parcours == ", ParcoursAbsent);

            res.render("ListeCours.html", { ParcoursAbsent: ParcoursAbsent, coursM: coursM, membre: membre, time: time, parcours: parcours, cours: cours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
            //await CGNModel(new_membre).save();
            //}
        });

});

//Accueil admin
routeExp.route("/listeMembre1").get(async function (req, res) {
    var session = req.session;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var listcourOblig = await CGNModel.find({ type: 'obligatoire' });
            console.log("liste ", listcourOblig)
        });
});


//Add emploi du temps
routeExp.route("/EmplTemp").post(async function (req, res) {
    var jours = req.body.jours
    var group = req.body.group
    var cours = req.body.cours
    var heurdebut = req.body.heurdebut
    var heurfin = req.body.heurfin


    console.log("emploi du temps == ", jours, group, heurdebut, heurfin, cours);
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if ((await EmplTemp.findOne({ $or: [{ cours: cours, groupe: group, jours: jours, heureStart: heurdebut, heureFin: heurfin }] })) || jours == "" || group == "" || heurdebut == "" || heurfin == "" || cours == "") {
                res.send("error");
            } else {
                var new_emploi = {
                    cours: cours,
                    groupe: group,
                    jours: jours,
                    heureStart: heurdebut,
                    heureFin: heurfin
                };
                console.log("new emploi ", new_emploi);
                await EmplTemp(new_emploi).save();
                res.send(new_emploi.groupe + " at " + new_emploi.heureStart + " is successfuly saved");
            }
        });

});


//Add parcours
routeExp.route("/addparcours").post(async function (req, res) {
    var date = req.body.date
    var group = req.body.group
    var cours = req.body.cours
    var heurdebut = req.body.heurdebut
    var heurfin = req.body.heurfin
    var present = req.body.present
    var absent = req.body.absent
    const presentArray = present.split(",");
    const absentArray = absent.split(",");
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if ((await ParcoursModel.findOne({ $or: [{ cours: cours, groupe: group, date: date, heureStart: heurdebut, heureFin: heurfin }] })) || date == "" || group == "" || heurdebut == "" || heurfin == "" || cours == "") {
                res.send("error");
            } else {
                for (let index = 0; index < presentArray.length; index++) {
                    var new_parcours = {
                        cours: cours,
                        groupe: group,
                        date: date,
                        heureStart: heurdebut,
                        heureFin: heurfin,
                        presence: true,
                        user: presentArray[index]
                    };
                    //console.log("new parc ", new_parcours);
                    await ParcoursModel(new_parcours).save();
                    //res.send( new_parcours.cours+ " at " + new_parcours.heureStart + " is successfuly saved");
                }
                for (let index = 0; index < absentArray.length; index++) {
                    var new_parcours = {
                        cours: cours,
                        groupe: group,
                        date: date,
                        heureStart: heurdebut,
                        heureFin: heurfin,
                        presence: false,
                        user: absentArray[index]
                    };
                    //console.log("new parc ", new_parcours);
                    await ParcoursModel(new_parcours).save();

                }
                res.send(new_parcours.cours + " at " + new_parcours.heureStart + " is successfuly saved");

            }
        });

});


//Add parcours
routeExp.route("/presence").post(async function (req, res) {
    var groupe = req.body.gpe
    var cours = req.body.cours
    //console.log("gpe ", gpe, cours);
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            //if( coursM = await CoursModel.findOne({ $or: [{ cours: cours, groupe: gpe}] })) {
            //     res.send("error");
            // } else {

            //membre = await CGNModel.find({ cours: cours, groupe: groupe })

            coursM = await CGNModel.find({ cours: cours, groupe: groupe })
            //var coursM = await CoursModel.find({ name_Cours: cours, groupe: gpe})
            console.log("cours");

            res.send(coursM);

            //}
        });

});


//admin Point
routeExp.route("/adminPoint").get(async function (req, res) {
    var session = req.session;
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

                //var listgroupe = await GroupeModel.find({ validation: true });
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });

                //console.log("liste " ,listgroupe)
                //console.log("obligatoire " , listcourOblig);
                //console.log("facultatif " , listcourFac);
                var listuser = await UserSchema.find({ validation: true });
                res.render("adminPoint.html", { listuser: listuser, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });
    }
    else {
        res.redirect("/");
    }
});


//get membre
routeExp.route("/getmembre").post(async function (req, res) {
    var id = req.body.id;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var user = await CGNModel.findOne({ _id: id });
            res.send(user.username + "," + user.m_code + "," + user.num_agent + "," + user.groupe + "," + user.niveau);
        });
})

//Liste User
routeExp.route("/adminGlobalviewBack").get(async function (req, res) {
    var session = req.session;
    //if (session.type_util == "Admin") {
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var listuser = await UserSchema.find({ validation: true });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            var membre = await CGNModel.find({ validation: true })
            res.render("./AvecBack/adminGlobalview.html", { membre: membre, listuser: listuser, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });

    // }
    // else {
    //     res.redirect("/");
    // }
});
module.exports = routeExp;


