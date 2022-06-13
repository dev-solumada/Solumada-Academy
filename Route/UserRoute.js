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
const Point = require("../Models/Point");
const Graduation = require("../Models/Graduation");

var membre = [{
    cours: '',
    groupe: '',
    username: ''
}]

var coursM = []

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
    if (session.type_util == "Professeur") {
        res.redirect("/teacherHome");
    }
    else if (session.type_util == "Admin") {
        res.redirect('/accueilAdmin');
    }
    else if (session.type_util == "Participant") {
        res.redirect('/studentHome');
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
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });
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
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            res.render("./AvecBack/accueilAdmin.html", { listcourOblig: listcourOblig, listcourFac: listcourFac });
        });
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


// Drop multiple users
routeExp.route("/dropusers").post(async function (req, res) {
    var usersToDeleteId = req.body.userlistToDelete;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            try {
                await UserSchema.deleteMany({ _id: { $in:usersToDeleteId } });
                res.send('success');
            } catch (error) {
                res.send('error');
            }
        });
})

//Drop user 
routeExp.route("/dropuser").post(async function (req, res) {
    var email = req.body.email;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            try {
                await UserSchema.findOneAndDelete({ username: email });
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
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
                } else if (logger.type_util == "Participant") {
                    session.name = logger.name,
                    session.m_code = logger.m_code;
                    session.num_agent = logger.num_agent;
                    session.type_util = logger.type_util;
                    session.username = logger.username;
                    res.redirect("/studentHome");
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
                await UserSchema(new_emp).save();
                sendEmail(email, "Authentification Academy solumada", htmlRender("onisoa.solumada@gmail.com", passdefault));
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
                var cours = await CoursModel.find({ professeur: req.session.nomProf });
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
                var listcours = await CoursModel.find({ professeur: req.session.nomProf });
                var listgroupe = await GroupeModel.find({ cours: cours });
                var listUser = await UserSchema.find({ cours: cours });

                var time = await EmplTemp.find({ cours: cours });
                var parcours = await ParcoursModel.find({ cours: cours });

                var ParcoursAbsent = await ParcoursModel.aggregate([
                    { $match: { $or: [{ cours: cours }] } },
                    {
                        $group: {
                            _id:
                                { weed: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                            tabl: { $push: { user: "$user", presence: "$presence" } }
                        }
                    }
                ])
                res.render("./teacherView/teacherCours.html", { parcours: parcours, listUser: listUser, ParcoursAbsent: ParcoursAbsent, time: time, membre: membre, listgroupe: listgroupe, listcours: listcours, cours: cours });
            });
    }
    else {
        res.redirect("/");
    }
});


//Liste membre par groupe
routeExp.route("/groupeTeacher").post(async function (req, res) {
    var groupe = req.body.groupe
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
            var listcours = await CoursModel.find({ professeur: req.session.nomProf });
            var listgroupe = await GroupeModel.find({ cours: cours });
            membre = await CGNModel.find({ cours: cours, groupe: groupe })

            var listUser = await UserSchema.find({ cours: cours });

            var time = await EmplTemp.find({ cours: cours });
            var parcours = await ParcoursModel.find({ cours: cours });

            var ParcoursAbsent = await ParcoursModel.aggregate([
                { $match: { $or: [{ cours: cours }] } },
                {
                    $group: {
                        _id:
                            { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])
            res.render("./teacherView/teacherCours.html", { parcours: parcours, listUser: listUser, ParcoursAbsent: ParcoursAbsent, time: time, membre: membre, listgroupe: listgroupe, listcours: listcours, cours: cours });
            
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
                var cours = await CoursModel.find({ professeur: req.session.nomProf });
                var membre = await CGNModel.aggregate([
                    { $match: { $or: [{ cours: cours[0].name_Cours }] } },
                    {
                        $group: {
                            _id:
                                { cours: "$cours", username: "$username", m_code: "$mcode", num_agent: "$num_agent" },
                            tabl: { $push: { id: "$_id", cours: "$cours",niveau: "$niveau", point: "$point", graduation: "$graduation" } }
                        }
                    }
                ])
                var point =  await Point.find({ validation: true });
                var grad =  await Graduation.find({ validation: true });
                res.render("./teacherView/teacherGlobalView.html", { point:point, grad:grad, membre: membre, cours: cours});
            });
    }
    else {
        res.redirect("/");
    }
});

//Accueil Participant
routeExp.route("/studentHome").get(async function (req, res) {
    var session = req.session;
    if (session.type_util == "Participant") {
        res.render("./StudentView/studentHome.html");
    }
    else {
        res.redirect("/");
    }
});



// student Group
routeExp.route("/studentGroup").get(async function (req, res) {
    var session = req.session;
    if (session.type_util == "Participant") {
        var groupeEt = await CGNModel.aggregate([
            { $match: { $or: [{ username: session.username }] } },
            {
                $group: {
                    _id:
                        {username: "$username", m_code: "$mcode", num_agent: "$num_agent", point: "$point", graduation: "$graduation" },
                    tabl: { $push: { id: "$_id", cours: "$cours",niveau: "$niveau" } }
                }
            }
        ])
        res.render("./StudentView/studentGroup.html", {groupe: groupeEt});
    }
    else {
        res.redirect("/");
    }
});


// student TimeTable
routeExp.route("/studentTimeTable").get(async function (req, res) {
    var session = req.session;
    if (session.type_util == "Participant") {
        var cgn = await CGNModel.find({  $or: [{ username: session.username }]  });
        var groupe = []
        for (let i = 0; i < cgn.length; i++) {
            const element = cgn[i];
            groupe.push(element.groupe)
        }
        var time = []
        for (let j = 0; j < groupe.length; j++) {
            const element = groupe[j];
            time = await EmplTemp.find({ $or: [{ groupe: element }]  });
            
        }
        res.render("./StudentView/studentTimeTable.html", {time: time});
    }
    else {
        res.redirect("/");
    }
});

// student Info
routeExp.route("/studentInfo").get(async function (req, res) {
    var session = req.session;
    if (session.type_util == "Participant") {
        var name = session.name;
        var m_code = session.m_code
        res.render("./StudentView/studentInfo.html", { name: name, m_code: m_code, num: session.num_agent });
    } else {
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
    }
    else {
        res.redirect("/");
    }
});

//Add new cours
routeExp.route("/addcours").post(async function (req, res) {
    var name_Cours = req.body.nameCours;
    var date_Commenc = req.body.date_Commenc;
    var typeCours = req.body.typeCours;
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
                    type: typeCours,
                    professeur: professeur
                };

                await UserSchema.findOneAndUpdate({ username: professeur }, { type_util: "Professeur"})
                await CoursModel(new_cours).save();
                res.send(name_Cours);
            }
        });

});


//Liste cours
routeExp.route("/listeCours").get(async function (req, res) {
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
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            var listUser = await UserSchema.find({ validation: true });
            var allCours = await CoursModel.find({ validation: true });

            res.render("AllCours.html", { listuser: listUser,listcourOblig, listcourFac, allCours })

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
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });
                res.render("ListeUser.html", { listcourOblig: listcourOblig, listcourFac: listcourFac });
            });
    }
    else {
        res.redirect("/");
    }
});

// Custom URL
routeExp.route("/allUsers").get(async function (req, res) {
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
                var allusers = await UserSchema.find().select("username m_code num_agent type_util");
                users = JSON.stringify(allusers);
                res.send(users);
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
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            //var membre = await CGNModel.find({ validation: true })
            var membre = await CGNModel.aggregate([
                {
                    $group: {
                        _id:
                            { username: "$username", m_code: "$mcode", num_agent: "$num_agent" , point: "$point", graduation: "$graduation"},
                        tabl: { $push: { id: "$_id", niveau: "$niveau", cours: "$cours" } }
                    }
                }
            ])
            var point =  await Point.find({ validation: true });
            var grad =  await Graduation.find({ validation: true });
            res.render("adminGlobalview.html", {grad: grad, point: point, membre: membre, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });

    }
    else {
        res.redirect("/");
    }
});

//getuser
routeExp.route("/getuser").post(async function (req, res) {
    var email = req.body.email;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var user = await UserSchema.findOne({ username: email }).select('_id name username m_code num_agent type_util');
            user = JSON.stringify(user);
            res.send(user);
        });
})

//Update User
routeExp.route("/updateuser").post(async function (req, res) {
    var id = req.body.id;
    var m_code = req.body.m_code;
    var num_agent = req.body.num_agent;
    var email = req.body.email;
    var type_util = req.body.type_util;
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
            try{
                await UserSchema.findOneAndUpdate({ _id: id }, { m_code: m_code, num_agent: num_agent, name: username, type_util:type_util, username: email })
                res.send(email);
            } catch(err){
                console.log(err);
                res.send("error");
            }
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
            res.send(JSON.stringify(cours));
        });
})


//Update User
routeExp.route("/updatecours").post(async function (req, res) {
    var id = req.body.id;
    var name_Cours = req.body.name_Cours;
    var date_Commenc = req.body.date_Commenc;
    var typeCours = req.body.typeCours;
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
            await CoursModel.findOneAndUpdate({ _id: id }, { name_Cours: name_Cours, date_Commenc: date_Commenc, professeur: professeur, type: typeCours });
            res.send(name_Cours);
        })
})

//Drop user 
routeExp.route("/dropcours").post(async function (req, res) {
    var names = req.body.name_Cours;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await CoursModel.findOneAndDelete({ name_Cours: names });
            res.send(names);
        })
})


//Post Add new groupe
routeExp.route("/addgroupe").post(async function (req, res) {
    var name_Groupe = req.body.newgroupe;
    var cours = req.body.cours;
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
                await GroupeModel(new_gpe).save();
                res.send(new_gpe.name_Groupe);
            }
        });

});



//Post Add new niveau
routeExp.route("/addniveau").post(async function (req, res) {
    var name_niveau = req.body.newniveau;
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
            if (await NiveauModel.findOne({ $or: [{ name_niveau: name_niveau, cours: cours }] })) {
                res.send("error");
            } else {
                var new_niveau = {
                    name_niveau: name_niveau,
                    cours: cours
                };
                await NiveauModel(new_niveau).save();
            }
        });

});


//Liste cours
routeExp.route("/listeCours/:cours").get(async function (req, res) {
    var session = req.session;
    var nomCours = req.params.cours;

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

            var listgroupe = await GroupeModel.find({ cours: nomCours });
            var listUser = await UserSchema.find({ cours: nomCours });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });
            var time = await EmplTemp.find({ cours: nomCours });
            var coursM = await CoursModel.find({ $or: [{ name_Cours: nomCours }] })
            parcours = await ParcoursModel.find({ cours: nomCours });
            var ParcoursAbsent = await ParcoursModel.aggregate([
                { $match: { $or: [{ cours: nomCours }] } },
                {
                    $group: {
                        _id:
                            { week: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])
            res.render("ListeCours.html", { cours_prof:coursM, ParcoursAbsent: ParcoursAbsent, coursM: coursM, parcours: parcours, time: time, membre: membre, cours: nomCours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
        });
    } else {
        res.redirect("/");
    }
});

//Liste cours
routeExp.route("/listeCoursBack/:cours").get(async function (req, res) {
    var session = req.session;
    var nomCours = req.params.cours;
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

                var listgroupe = await GroupeModel.find({ cours: nomCours });
                var listUser = await UserSchema.find({ cours: nomCours });
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });
                var time = await EmplTemp.find({ cours: nomCours });

                parcours = await ParcoursModel.find({ cours: nomCours });

            var coursM = await CoursModel.find({ $or: [{ name_Cours: nomCours }] })
                var ParcoursAbsent = await ParcoursModel.aggregate([
                    { $match: { $or: [{ cours: nomCours }] } },
                    {
                        $group: {
                            _id:
                                { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                            tabl: { $push: { user: "$user", presence: "$presence" } }
                        }
                    }
                ])
                res.render("./AvecBack/ListeCours.html", { cours_prof: coursM, ParcoursAbsent: ParcoursAbsent, coursM: coursM, parcours: parcours, time: time, membre: membre, cours: nomCours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });
    } else {
        res.redirect("/");
    }
});

//Post Add new membre in groupe
routeExp.route("/newmembre").post(async function (req, res) {
    var name_groupe = req.body.groupeVal
    var username = req.body.username
    var cours = req.body.cours
    const listeUser = username.split(",");
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            for (let index = 0; index < listeUser.length; index++) {
                if (await CGNModel.findOne({ $or: [{ cours: cours, groupe: name_groupe, username: listeUser[index] }] })) {
                    res.send("error");
                } else {

                    var user = await UserSchema.find({ username: listeUser[index] });
                    var mcode = ""
                    var num_agent = ""
                    user.forEach(function (user) {
                        mcode = user.m_code
                        num_agent = user.num_agent
                    });

                    var new_membre = {
                        cours: cours,
                        groupe: name_groupe,
                        username: listeUser[index],
                        num_agent: num_agent,
                        mcode: mcode
                    };
                    await UserSchema.findOneAndUpdate({ username: listeUser[index] }, { type_util: "Participant"})
                    await CGNModel(new_membre).save();
                }
            }
            res.send("new membre ok");
        })

});

//Liste membre par groupe
routeExp.route("/groupe").post(async function (req, res) {
    var groupe = req.body.groupe
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
            membre = await CGNModel.find({ cours: cours, groupe: groupe })
            var listgroupe = await GroupeModel.find({ cours: cours });
            var listUser = await UserSchema.find({ cours: cours });
            var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
            var listcourFac = await CoursModel.find({ type: 'facultatif' });

            var time = await EmplTemp.find({ cours: cours });
            var parcours = await ParcoursModel.find({ cours: cours });

            var ParcoursAbsent = await ParcoursModel.aggregate([
                { $match: { $or: [{ cours: cours }] } },
                {
                    $group: {
                        _id:
                            { week: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])
            var coursM = await CoursModel.find({ $or: [{ name_Cours: cours }] })
            res.render("ListeCours.html", { cours_prof:coursM, ParcoursAbsent: ParcoursAbsent, coursM: coursM, membre: membre, time: time, parcours: parcours, cours: cours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
            
        });

});


//Add emploi du temps
routeExp.route("/EmplTemp").post(async function (req, res) {
    var jours = req.body.jours
    var group = req.body.group
    var cours = req.body.cours
    var heurdebut = req.body.heurdebut
    var heurfin = req.body.heurfin
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
    var week = req.body.week
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
                        user: presentArray[index],
                        week: week
                    };
                    await ParcoursModel(new_parcours).save();
                }
                for (let index = 0; index < absentArray.length; index++) {
                    var new_parcours = {
                        cours: cours,
                        groupe: group,
                        date: date,
                        heureStart: heurdebut,
                        heureFin: heurfin,
                        presence: false,
                        user: absentArray[index],
                        week: week
                    };
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
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            coursM = await CGNModel.find({ cours: cours, groupe: groupe })
            res.send(coursM);
        });

});


//Add new membre
routeExp.route("/membre_new").post(async function (req, res) {
    var groupe = req.body.gpe
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
            coursM = await CGNModel.find({ cours: cours, groupe: groupe })
            res.send(coursM);
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
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' });
                var listcourFac = await CoursModel.find({ type: 'facultatif' });
                var listuser = await UserSchema.find({ validation: true });
                res.render("adminPoint.html", { listuser: listuser, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });
    }
    else {
        res.redirect("/");
    }
});



const XLSX = require('xlsx')
routeExp.route("/addxlsx").get(async function (req, res) {
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

            const parseExcel = (filename) => {

                const excelData = XLSX.readFile(filename);

                return Object.keys(excelData.Sheets).map(name => ({
                    name,
                    data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
                }));
            };
            var liste = []
            parseExcel("./Vue/assets/listeUser.xls").forEach(element => {
                console.log(element.data);
                liste.push(element.data)
            });

            var listUser = await UserSchema.find({ validation: true });
            var passdefault = "solumada0000";
            var value = liste[0]
            // for (let i = 0; i < value.length; i++) {

            //     var user = value[i];
            //     //console.log("name: ",user.NOM);
            //     var new_emp = {
            //         name: user.NOM,
            //         username: user.MAIL,
            //         password: passdefault,
            //         m_code: user.CODE,
            //         num_agent: user.NUMBERING,
            //         type_util: ""
            //     };
            //     await UserSchema(new_emp).save();

            // }
            //sendEmail(email, "Authentification Academy solumada", htmlRender(email, passdefault));
            //res.send(email);
            //}

        });
});


//Update Membre
routeExp.route("/updatemembre").post(async function (req, res) {
    var id = req.body.id;
    var userLevel = req.body.userLevel;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await CGNModel.findOneAndUpdate({ _id: id }, { niveau: userLevel });
            res.send("Level updated successfully");
        })
})


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
            res.send(user.niveau);
        });
})

//get point
routeExp.route("/getpoint").post(async function (req, res) {
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
            res.send("user.point");
        });
})
//Add point
routeExp.route("/addpoint").post(async function (req, res) {
    var id = req.body.id;
    var point = req.body.point;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await CGNModel.findOneAndUpdate({ _id: id }, { point: point });
            res.send("Level updated successfully");
        })
})

//Update Point
routeExp.route("/updatePoint").post(async function (req, res) {
    var id = req.body.id;
    var point = req.body.point;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await CGNModel.findOneAndUpdate({ _id: id }, { point: point });
            res.send("Point updated successfully");
        })
})


//get grad
routeExp.route("/getgrad").post(async function (req, res) {
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
            // var user = await CGNModel.findOne({ _id: id });
            // console.log("user == ", user);
            res.send("user.point");
        });
})

//Update Point
routeExp.route("/updateGrad").post(async function (req, res) {
    var id = req.body.id;
    var graduation = req.body.grad;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await CGNModel.findOneAndUpdate({ _id: id }, { graduation: graduation });
            res.send("Graduation updated successfully");
        })
})


//Save point
routeExp.route("/savePoint").post(async function (req, res) {
    //var id = req.body.id;
    var point = req.body.point;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await Point.findOne({ $or: [{ point: point }] })) {
                res.send("error");
            } else {
                var new_point = {
                    point: point
                };
                await Point(new_point).save();
                
                res.send(point);
            }
        })
})


//Save Graduation
routeExp.route("/saveGrad").post(async function (req, res) {
    //var id = req.body.id;
    var grad = req.body.grad;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await Graduation.findOne({ $or: [{ graduation: grad }] })) {
                res.send("error");
            } else {
                var new_graduation = {
                    graduation: grad
                };
                await Graduation(new_graduation).save();
                
                res.send(grad);
            }
        })
})

module.exports = routeExp;



//get membre
routeExp.route("/getmembreD").post(async function (req, res) {
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
            res.send(user);
        });
})

//delete membre
routeExp.route("/deleteMb").post(async function (req, res) {
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
            try {
                await CGNModel.findOneAndDelete({ _id: id });
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });
})


//get time
routeExp.route("/gettime").post(async function (req, res) {
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
            var temp = await EmplTemp.findOne({ _id: id})
            res.send(temp);
        });
})

//Update update_time
routeExp.route("/update_time").post(async function (req, res) {
    var id = req.body.id;
    var jours = req.body.jours;
    var group = req.body.group;
    var heurdebut = req.body.heurdebut;
    var heurfin = req.body.heurfin;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe:group, heureStart: heurdebut, heureFin:heurfin});
            res.send("Time updated successfully");
        })
})


//get membre
routeExp.route("/gettimedelete").post(async function (req, res) {
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
            var emploi = await EmplTemp.findOne({ _id: id });
            res.send(emploi);
        });
})


//delete emploi
routeExp.route("/deleteEmploi").post(async function (req, res) {
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
            try {
                await EmplTemp.findOneAndDelete({ _id: id });
                res.send("success");
            } catch (err) {
                res.send(err);
            }
        });
})


//get getParcours
routeExp.route("/getParcours").post(async function (req, res) {
    var cours = req.body.cours;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {

            var ParcoursAbsent = await ParcoursModel.aggregate([
                { $match: { $or: [{ cours: cours }] } },
                {
                    $group: {
                        _id:
                            { week: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])
            res.send(ParcoursAbsent);
        });
})


//delete parcours
routeExp.route("/deleteParcours").post(async function (req, res) {
    var cours = req.body.cours;
    var groupe = req.body.groupe;
    var heureStart = req.body.heureStart;
    var heureFin = req.body.heureFin;
    var date = req.body.date;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            try {
                await ParcoursModel.deleteMany({ cours: cours, groupe:groupe, heureStart: heureStart, heureFin:heureFin, date:date});
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });
})
