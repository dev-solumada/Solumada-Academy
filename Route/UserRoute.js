const express = require('express');
const routeExp = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
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
const DemandCours = require("../Models/DemandeCours");

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
        user: 'onisoa.solumada@gmail.com',
        pass: 'mtgbvuiinvwsplrx'
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
    if (session.occupation_prof == "Professeur") {
        res.redirect("/teacherHome");
    }
    else if (session.occupation_adm == "adm") {
        res.redirect('/accueilAdmin');
    }
    else if (session.occupation_particip == "Participant") {
        res.redirect('/studentHome');
    }
    else {
        res.render("LoginPage.html", { erreur: "" });
    }

});

//logout
routeExp.route("/logout").get(function (req, res) {
    var session = req.session;
    session.occupation_prof = null
    session.occupation_particip = null
    session.occupation_adm = null
    session.name = ""
    session.m_code = ""
    session.num_agent = ""
    session.username = ""
    res.redirect("/");
});

//Accueil admin
routeExp.route("/accueilAdmin").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
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


//reset password
routeExp.route("/resetPWD").get(async function (req, res) {
    //Reset password
    var session = req.session;
    if (session.mailconfirm) {
        res.redirect("/code");
    } else {
        res.render("resetPwd.html", { err: "" });
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
                await UserSchema.deleteMany({ _id: { $in: usersToDeleteId } });
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
                var cgn = await CGNModel.deleteMany({ username: email });
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
    //  login(email, password)
    // mongoose
    //     .connect(
    //         "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    //         {
    //             useUnifiedTopology: true,
    //             UseNewUrlParser: true,
    //         }
    //     )
    //     .then(async () => {
    //         var logger = await UserSchema.findOne({ username: email, password: password });
    //         if (logger) {
    //             if (logger.type_util == "Professeur") {
    //                 session.m_code = logger.m_code;
    //                 session.num_agent = logger.num_agent;
    //                 session.type_util = logger.type_util;
    //                 session.nomProf = logger.username;
    //                 res.redirect("/teacherHome");
    //             } else if (logger.type_util == "Participant") {
    //                 session.name = logger.name,
    //                 session.m_code = logger.m_code;
    //                 session.num_agent = logger.num_agent;
    //                 session.type_util = logger.type_util;
    //                 session.username = logger.username;
    //                 res.redirect("/studentHome");
    //             } else {
    //                 session.type_util = logger.type_util;
    //                 res.redirect("/accueilAdmin");
    //             }
    //         } else {
    //             res.render("LoginPage.html", {
    //                 erreur: "Email or password is wrong",
    //             });
    //         }
    //     });



    await login(email, password, session, res);
});

async function login(username, pwd, session, res) {
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            //let hash = crypto.createHash('md5').update(pwd).digest("hex");
            var logger = await UserSchema.findOne({
                username: username,
                password: pwd,
            });
            if (logger) {
                if (logger.occupation.length > 1) {
                    for (let i = 0; i < logger.occupation.length; i++) {
                        const element = logger.occupation[i];
                        if (element == "Professeur") {
                            session.occupation_prof = element;
                            session.nomProf = logger.username;
                            session.m_code = logger.m_code;
                            session.num_agent = logger.num_agent;
                        } else if (element == "Participant") {
                            session.occupation_particip = element;
                            session.nomProf = logger.username;
                            session.name = logger.name;
                            session.username = logger.username;
                            session.m_code = logger.m_code;
                            session.num_agent = logger.num_agent;
                        }
                    }
                    res.redirect("/teacherHome")//, { prof_occ: prof_occ, part_occ: part_occ });
                } else
                    if (logger.type_util == "Professeur") {
                        session.occupation_prof = logger.type_util;
                        session.m_code = logger.m_code;
                        session.nomProf = logger.username;
                        session.num_agent = logger.num_agent;
                        res.redirect("/teacherHome");
                    } else if (logger.type_util == "Participant") {
                        session.occupation_particip = logger.type_util;
                        session.name = logger.name,
                        session.m_code = logger.m_code;
                        session.num_agent = logger.num_agent;
                        session.username = logger.username;
                        res.redirect("/studentHome");
                    }
                    else {
                        session.occupation_adm = "adm";
                        res.redirect("/accueilAdmin");
                    }
            } else {
                res.render("LoginPage.html", {
                    erreur: "Email ou mot de passe incorrect",
                });
            }
        });
}
//Add employee
routeExp.route("/addemp").post(async function (req, res) {
    var name = req.body.name;
    var firstname = req.body.firstname;
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
                    firstname: firstname,
                    username: email,
                    password: passdefault,
                    m_code: m_code,
                    num_agent: num_agent,
                    type_util: type_util
                };
                await UserSchema(new_emp).save();
                sendEmail(email, "Authentification Academy solumada", htmlRender(email, passdefault));
                res.send(email);
            }
        });

});

//New employee
routeExp.route("/newemployee").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
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
    if (session.occupation_prof == "Professeur") {
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
                if (session.occupation_particip) {
                    var particip = session.occupation_particip
                } else {
                    var particip = ""
                }
                res.render("./teacherView/teacherHome.html", { particip: particip, cours: cours });
            });
    }
    else {
        res.redirect("/");
    }
});

// Cours professeur
routeExp.route("/teacherCours/:cours").get(async function (req, res) {
    var session = req.session;
    var cours = req.params.cours;
    if (session.occupation_prof == "Professeur") {
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

                res.render("./teacherView/teacherCours.html", { listUser: listUser, membre: membre, listgroupe: listgroupe, listcours: listcours, cours: cours });
            });
    }
    else {
        res.redirect("/");
    }
});

// Timetable Proffesseur Ajax
routeExp.route("/teacherTimeTable/:cours").get(async function (req, res) {
    var session = req.session;
    var cours = req.params.cours;
    if (session.occupation_prof == "Professeur" || session.occupation_adm == "adm") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var time = await EmplTemp.find({ cours: cours });
                res.send(JSON.stringify(time));
            });
    }
    else {
        res.redirect("/");
    }
});



class Parcours {
    constructor(cour_name, group_name, start_time, end_time, date, present, absent) {
        this.cour_name = cour_name;
        this.group_name = group_name;
        this.start_time = start_time;
        this.end_time = end_time;
        this.date = date;
        this.present = present;
        this.absent = absent;
    }
}
// Parcours Proffesseur Ajax
routeExp.route("/teacherParcours/:cours").get(async function (req, res) {
    var session = req.session;
    var cours = req.params.cours;
    if (session.occupation_prof == "Professeur" || session.occupation_adm == "adm") {
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
                    var ParcoursAbsent = await ParcoursModel.aggregate([
                        { $match: { $or: [{ cours: cours }] } },
                        {
                            $group: {
                                _id:
                                    { weed: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                                tabl: { $push: { user: "$user", presence: "$presence", name: "$name", _id: "$_id" } }
                            }
                        }
                    ]);
                    data = [];

                    ParcoursAbsent.forEach(parcours => {
                        var coursName = parcours._id.cours;
                        var groupName = parcours._id.groupe;
                        var startTime = parcours._id.heureStart;
                        var endTime = parcours._id.heureFin;
                        var date = new Date(parcours._id.date);
                        date = date.toLocaleDateString("fr");
                        var memberAbsence = parcours.tabl;
                        var absents = [];
                        var presents = [];

                        memberAbsence.forEach(abs => {
                            if (abs.presence == true) { presents.push({ "name": abs.name, "email": abs.user }); }
                            else { absents.push({ "name": abs.name, "email": abs.user }); }
                        });

                        var prcs = new Parcours(coursName, groupName, startTime, endTime, date, presents, absents);
                        data.push(prcs);
                    });
                    console.log(JSON.stringify(data));
                    res.send(data);
                } catch (error) {
                    console.log(error);
                }

            });
    }
    else {
        res.redirect("/");
    }
});


// Parcours admin Ajax
routeExp.route("/adminParcours/:cours").get(async function (req, res) {
    var session = req.session;
    var cours = req.params.cours;
    if (session.occupation_prof == "Professeur" || session.occupation_adm == "adm") {
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
                    var ParcoursAbsent = await ParcoursModel.aggregate([
                        { $match: { $or: [{ cours: cours }] } },
                        {
                            $group: {
                                _id:
                                    { weed: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                                tabl: { $push: { user: "$user", presence: "$presence", name: "$name", _id: "$_id" } }
                            }
                        }
                    ]);
                    data = [];

                    ParcoursAbsent.forEach(parcours => {
                        var coursName = parcours._id.cours;
                        var groupName = parcours._id.groupe;
                        var startTime = parcours._id.heureStart;
                        var endTime = parcours._id.heureFin;
                        var date = new Date(parcours._id.date);
                        date = date.toLocaleDateString("fr");
                        var memberAbsence = parcours.tabl;
                        var absents = [];
                        var presents = [];

                        memberAbsence.forEach(abs => {
                            if (abs.presence == true) {
                                presents.push({ "name": abs.name, "email": abs.user });
                            }
                            else {
                                absents.push({ "name": abs.name, "email": abs.user });
                            }
                        });

                        var prcs = new Parcours(coursName, groupName, startTime, endTime, date, presents, absents);
                        data.push(prcs);
                    });
                    res.send(JSON.stringify(data));
                } catch (error) {
                    console.log(error);
                }

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
            var membre = await CGNModel.find({ cours: cours, groupe: groupe })

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

    if (session.occupation_adm == "adm" || session.occupation_prof == "Professeur") {
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
                    { $match: { $or: [{ professeur: cours[0].professeur }] } },
                    {
                        $group: {
                            _id:
                                { username: "$username", m_code: "$mcode", num_agent: "$num_agent", professeur: "$professeur" },
                            tabl: { $push: { id: "$_id", cours: "$cours", niveau: "$niveau", point: "$point", graduation: "$graduation" } }
                        }
                    }
                ])

                var point = await Point.find({ validation: true });
                var grad = await Graduation.find({ validation: true });
                res.render("./teacherView/teacherGlobalView.html", { point: point, grad: grad, membre: membre, cours: cours });
            });
    }
    else {
        res.redirect("/");
    }
});

//Accueil Participant
routeExp.route("/studentHome").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_particip == "Participant") {

        if (session.occupation_prof) {
            var prof = session.occupation_prof

        } else {
            var prof = ""

        }

        res.render("./StudentView/studentHome.html", { prof: prof });
    }
    else {
        res.redirect("/");
    }
});




// student Group
routeExp.route("/studentGroup").get(async function (req, res) {
    var session = req.session;

    if (session.occupation_particip == "Participant") {
        var name = session.name
        var groupeEt = await CGNModel.aggregate([
            { $match: { $or: [{ username: session.username }] } },
            {
                $group: {
                    _id:
                        { username: "$username", m_code: "$mcode", num_agent: "$num_agent", point: "$point", graduation: "$graduation" },
                    tabl: { $push: { id: "$_id", cours: "$cours", niveau: "$niveau" } }
                }
            }
        ])
        res.render("./StudentView/studentGroup.html", { groupe: groupeEt, name });
    }
    else {
        res.redirect("/");
    }
});


// student TimeTable
routeExp.route("/studentTimeTable").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_particip == "Participant") {
        var cgn = await CGNModel.find({ $or: [{ username: session.username }] });
        var groupe = []
        for (let i = 0; i < cgn.length; i++) {
            const element = cgn[i];
            groupe.push(element.groupe)
        }

        var time = []
        for (let j = 0; j < groupe.length; j++) {
            const element = groupe[j];
            time.push(await EmplTemp.find({ $or: [{ groupe: element }] }));

        }

        res.render("./StudentView/studentTimeTable.html", { time: time });
    }
    else {
        res.redirect("/");
    }
});

// student Info
routeExp.route("/studentInfo").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_particip == "Participant" ) {
        var name = session.name;
        var m_code = session.m_code
        var user = await CGNModel.findOne({ $or: [{ mcode: m_code }] })

        console.log("user", user);
        res.render("./StudentView/studentInfo.html", { user: user, name: name, m_code: m_code, num: session.num_agent });
    } else {
        res.redirect("/");
    }
});


// Thierry All cours
routeExp.route("/allCours").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var allCours = await CoursModel.find({ validation: true });
                res.send(JSON.stringify(allCours));
            });


    } else {
        res.redirect("/");
    }
});


//New Cours
routeExp.route("/newcours").get(async function (req, res) {
    var session = req.session;
    var professeur = 'Professeur'
    if (session.occupation_adm == "adm") {
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
                    professeur: professeur,
                    nbrePart: 0
                };
                var user = await UserSchema.findOne({ $or: [{ username: professeur }] })


                if (user.occupation.indexOf('Professeur') === -1) {
                    await UserSchema.findOneAndUpdate({ username: professeur }, { $push: { occupation: "Professeur" } })
                }
                await CoursModel(new_cours).save();
                res.send(name_Cours);
            }
        });

});


//Liste cours
routeExp.route("/listeCours").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
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
                var coursM = await CoursModel.aggregate([
                    {
                        $lookup: {
                            from: "usercgns",
                            localField: "name_Cours",
                            foreignField: "cours",
                            as: "nbrePartic"
                        }
                    },
                    {
                        $addFields: {
                            countDishes: {
                                $size: "$nbrePartic"
                            }
                        }
                    },
                    {
                        $match: {
                            countDishes: {
                                $gt: 5
                            }
                        }
                    }
                ])
                for (let j = 0; j < coursM.length; j++) {
                    const element2 = coursM[j];
                    c = await CoursModel.findOneAndUpdate({ name_Cours: element2.name_Cours }, { nbrePart: element2.countDishes })
                }

                var coursliste1 = await CoursModel.find({ validation: true })
                var cours = JSON.stringify(coursliste1)
                res.render("AllCours.html", { cours: cours, listuser: listUser, listcourOblig: listcourOblig, listcourFac: listcourFac, coursM: coursM })

            });
    } else {
        res.redirect("/");
    }
});

routeExp.route("/allCoursLists").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var listcourOblig = await CoursModel.find({ type: 'obligatoire' }).select("name_Cours");
                var listcourFac = await CoursModel.find({ type: 'facultatif' }).select("name_Cours");
                data = { listcourOblig: listcourOblig, listcourFac: listcourFac };
                var data = JSON.stringify(data);
                res.send(data);
            });


    } else {
        res.redirect("/");
    }
});

//Liste User
routeExp.route("/listeUser").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
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
    if (session.occupation_adm == "adm") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var allusers = await UserSchema.find().select("username name m_code num_agent type_util");
                users = JSON.stringify(allusers);
                res.send(users);
            });
    }
    else {
        res.redirect("/");
    }
});

//Liste User
routeExp.route("/adminGraduation").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
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
    if (session.occupation_adm == "adm") {
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
                                { username: "$username", firstname: "$firstname", m_code: "$mcode", num_agent: "$num_agent", point: "$point", graduation: "$graduation" },
                            tabl: { $push: { id: "$_id", niveau: "$niveau", cours: "$cours" } }
                        }
                    }
                ])

                var point = await Point.find({ validation: true });
                var grad = await Graduation.find({ validation: true });
                res.render("adminGlobalview.html", { grad: grad, point: point, membre: membre, listcourOblig: listcourOblig, listcourFac: listcourFac });
            });

    }
    else {
        res.redirect("/");
    }
});

// Class for format data
class Employee {
    constructor(email, m_code, number, coursAndlevel, empoint, grade) {
        this.emp_email = email;
        this.emp_m_code = m_code;
        this.emp_number = number;
        this.emp_courslevel = coursAndlevel;
        this.emp_point = empoint;
        this.emp_grade = grade;
    }
};

// Get GlobalViewData From Ajax
routeExp.route("/adminGlobalViewAjax").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_adm == "adm") {
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
                    var members = await CGNModel.aggregate([
                        {
                            $group: {
                                _id: { username: "$username", firstname: "$name", m_code: "$mcode", num_agent: "$num_agent", point: "$point", graduation: "$graduation" },
                                tabl: { $push: { id: "$_id", niveau: "$niveau", cours: "$cours" } }
                            }
                        }
                    ]);

                    var points = await Point.find({ validation: true });
                    var grades = await Graduation.find({ validation: true });

                    var data = [];
                    members.forEach(member => {
                        console.log("member._id ", member._id);
                        var member_email = member._id.firstname;
                        var member_m_code = member._id.m_code;
                        var member_number = member._id.num_agent;
                        var member_point = member._id.point;
                        var member_gradudation = member._id.graduation;
                        var member_courslevel = [];
                        var member_userpoints = [];
                        var member_grades = [];

                        if (member_point != null) { member_userpoints.push(member_point); }
                        else { member_userpoints.push("None"); }
                        if (member_gradudation != null) { member_grades.push(member_gradudation); }
                        else { member_grades.push("None"); }
                        var coursLevelsData = member.tabl;
                        coursLevelsData.forEach(courLevel => {
                            var str = '';
                            if (courLevel.cours) { str = str + courLevel.cours + ' - ' };
                            if (courLevel.niveau) { str = str + courLevel.niveau };
                            member_courslevel.push(str);
                        });

                        points.forEach(point => { member_userpoints.push(point.point) });
                        grades.forEach(grade => { member_grades.push(grade.graduation) });

                        var personne = new Employee(email = member_email, number = member_number, m_code = member_m_code, coursAndlevel = member_courslevel, emp_point = member_userpoints, emp_grade = member_grades);
                        data.push(personne);
                    });
                    data = JSON.stringify(data);
                    res.send(data);
                } catch (error) {
                    console.log(error);
                }
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
            try {
                await UserSchema.findOneAndUpdate({ _id: id }, { m_code: m_code, num_agent: num_agent, name: username, type_util: type_util, username: email })
                res.send(email);
            } catch (err) {
                console.log(err);
                res.send("error");
            }
        })
})

//get cours
routeExp.route("/getCours").post(async function (req, res) {
    var name_Cours = req.body.name_Cours;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var cours = await CoursModel.findOne({ name_Cours: name_Cours });
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
            try {
                await CoursModel.findOneAndUpdate({ _id: id }, { name_Cours: name_Cours, date_Commenc: date_Commenc, professeur: professeur, type: typeCours });
                res.send(name_Cours);
            } catch (error) {
                res.send('error');
            }
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
                res.send("success");
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

    if (session.occupation_adm == "adm") {
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
                                { cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                            tabl: { $push: { user: "$user", presence: "$presence", _id: "$_id" } }
                        }
                    }

                ])

                //coursM = [{ professeur: "Rojovola" }]
                res.render("ListeCours.html", { cours_prof: coursM, ParcoursAbsent: ParcoursAbsent, cours: nomCours, parcours: parcours, time: time, membre: membre, cours: nomCours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
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
                if (await CGNModel.findOne({ $or: [{ groupe: name_groupe, username: listeUser[index] }] })) {
                    res.send("error");
                } else {

                    var user = await UserSchema.find({ username: listeUser[index] });
                    var getProf = await CoursModel.find({ $or: [{ name_Cours: cours }] });
                    var mcode = ""
                    var num_agent = ""
                    var firstname = ""
                    for (let i = 0; i < user.length; i++) {
                        const element = user[i];
                        mcode = element.m_code
                        num_agent = element.num_agent
                        firstname = element.name

                        if (element.occupation.indexOf('Participant') === -1) {
                            await UserSchema.findOneAndUpdate({ m_code: mcode }, { $push: { occupation: "Participant" } })
                        }

                    }

                    var new_membre = {
                        cours: cours,
                        groupe: name_groupe,
                        username: listeUser[index],
                        num_agent: num_agent,
                        mcode: mcode,
                        name: firstname,
                        professeur: getProf[0].professeur
                    };

                    //await UserSchema.findOneAndUpdate({ username: listeUser[index] }, { type_util: "Participant" })
                    await CGNModel(new_membre).save();
                }
            }
            res.send("new membre ok");
        })

});

// thierry Add new Member to group
routeExp.route("/newmembreajax").post(async function (req, res) {
    var name_groupe = req.body.groupeName;
    var listeUser = req.body.newMemberList;
    var cours = req.body.coursName;
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
                if (await CGNModel.findOne({ $or: [{ groupe: name_groupe, username: listeUser[index] }] })) {
                    res.send("error");
                } else {

                    var user = await UserSchema.find({ username: listeUser[index] });
                    var getProf = await CoursModel.find({ $or: [{ name_Cours: cours }] });
                    var mcode = ""
                    var num_agent = ""
                    var firstname = ""
                    for (let i = 0; i < user.length; i++) {
                        const element = user[i];
                        mcode = element.m_code
                        num_agent = element.num_agent
                        firstname = element.firstname

                        if (element.occupation.indexOf('Participant') === -1) {
                            await UserSchema.findOneAndUpdate({ m_code: mcode }, { $push: { occupation: "Participant" } })
                        }

                    }

                    var new_membre = {
                        cours: cours,
                        groupe: name_groupe,
                        username: listeUser[index],
                        num_agent: num_agent,
                        mcode: mcode,
                        firstname: firstname,
                        professeur: getProf[0].professeur
                    };

                    //await UserSchema.findOneAndUpdate({ username: listeUser[index] }, { type_util: "Participant" })
                    await CGNModel(new_membre).save();
                    res.send("success");
                }
            }
        })
});


// thierry Add new Member to group
routeExp.route("/newmembreadmin").post(async function (req, res) {
    var name_groupe = req.body.groupeName;
    var listeUser = req.body.newMemberList;
    var cours = req.body.coursName;
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
                if (await CGNModel.findOne({ $or: [{ groupe: name_groupe, username: listeUser[index] }] })) {
                    res.send("error");
                } else {

                    var user = await UserSchema.find({ username: listeUser[index] });
                    var getProf = await CoursModel.find({ $or: [{ name_Cours: cours }] });
                    var mcode = ""
                    var num_agent = ""
                    var firstname = ""

                    for (let i = 0; i < user.length; i++) {
                        const element = user[i];
                        mcode = element.m_code
                        num_agent = element.num_agent
                        firstname = element.name

                        if (element.occupation.indexOf('Participant') === -1) {
                            await UserSchema.findOneAndUpdate({ m_code: mcode }, { $push: { occupation: "Participant" } })
                        }

                    }
                    var new_membre = {
                        cours: cours,
                        groupe: name_groupe,
                        username: listeUser[index],
                        num_agent: num_agent,
                        mcode: mcode,
                        name: firstname,
                        professeur: getProf[0].professeur
                    };

                    //await UserSchema.findOneAndUpdate({ username: listeUser[index] }, { type_util: "Participant" })
                    await CGNModel(new_membre).save();
                    res.send("success");
                }
            }
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
            res.render("ListeCours.html", { ParcoursAbsent: ParcoursAbsent, coursM: coursM, membre: membre, time: time, parcours: parcours, cours: cours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });

        });

});


// Member group Thierry
routeExp.route("/groupemember/:cours/:groupe").get(async function (req, res) {
    var groupe = req.params.groupe;
    var cours = req.params.cours;
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
                var members = await CGNModel.find({ cours: cours, groupe: groupe })
                res.send(members);
            } catch (error) {
                console.log(error);
                res.send(error);
            }
        });

});

// Thierry get selected user member and list of all users
routeExp.route("/getMemberAndAllUserList").post(async function (req, res) {
    var groupe = req.body.groupe;
    var cours = req.body.cours;
    // console.log(req.body);
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
                var members = await CGNModel.find({ cours: cours, groupe: groupe });
                var listUser = await UserSchema.find({ cours: cours });

                var memberList = [];
                var allUserList = [];

                members.forEach(member => {
                    memberList.push(member.name);
                });
                listUser.forEach(user => { allUserList.push(user.username); });

                var exitsValues = memberList.filter(value => allUserList.includes(value));
                exitsValues.forEach(val => {
                    var index = allUserList.indexOf(val);
                    allUserList.splice(index, 1);
                });

                res.send(allUserList);
            } catch (error) {
                console.log(error);
                res.send(error);
            }
        });

});


//Add emploie du temps
routeExp.route("/EmplTemp").post(async function (req, res) {
    var jours = req.body.jours;
    var group = req.body.groupe;
    var cours = req.body.cours;
    var heurdebut = req.body.timeStart;
    var heurfin = req.body.timeEnd;
    var date_time = req.body.date_time;

    try {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                if ((await EmplTemp.findOne({ $or: [{ cours: cours, groupe: group, jours: jours, heureStart: heurdebut, heureFin: heurfin, date_time: date_time }] })) || jours == "" || group == "" || heurdebut == "" || date_time == "" || heurfin == "" || cours == "") {
                    res.send("error");
                } else {
                    var new_emploi = {
                        cours: cours,
                        groupe: group,
                        jours: jours,
                        heureStart: heurdebut,
                        heureFin: heurfin,
                        date: date_time
                    };
                    await EmplTemp(new_emploi).save();
                    res.send('success');

                }
            });
    } catch (error) {
        console.log(error);
        res.send('error');
    }

});


//Add parcours
routeExp.route("/addparcours").post(async function (req, res) {
    var date = req.body.date;
    var group = req.body.group;
    var cours = req.body.cours;
    var heurdebut = req.body.timeStart;
    var heurfin = req.body.heurfin;
    var present = req.body.present;
    var absent = req.body.absent;
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
                        user: absentArray[index]
                    };
                    await ParcoursModel(new_parcours).save();

                }
                res.send(new_parcours.cours + " at " + new_parcours.heureStart + " is successfuly saved");

            }
        });

});

//Add parcours Admin
routeExp.route("/Adminaddparcours").post(async function (req, res) {
    var date = req.body.dateNewParcours;
    var group = req.body.groupParcoursName;
    var cours = req.body.cours;
    var heurdebut = req.body.timestartAt;
    var heurfin = req.body.timeEndAt;
    var presentArray = req.body.present;
    var absentArray = req.body.absent;
    //date = date.toLocaleDateString("fr");
    // console.log("absentArray ", JSON.stringify(absentArray));
    // console.log("presentArray ", JSON.stringify(presentArray));
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
                if ((await ParcoursModel.findOne({ $or: [{ cours: cours, groupe: group, date: date, heureStart: heurdebut, heureFin: heurfin }] })) || date == "" || group == "" || heurdebut == "" || heurfin == "" || cours == "") {

                    console.log("errreur");
                    res.send("exist");
                } else {

                    if (presentArray.length > 0) {
                        for (let index = 0; index < presentArray.length; index++) {
                            var new_parcours = {
                                cours: cours,
                                groupe: group,
                                date: date,
                                heureStart: heurdebut,
                                heureFin: heurfin,
                                presence: true,
                                user: presentArray[index].mail,
                                name: presentArray[index].name
                            };
                            await ParcoursModel(new_parcours).save();
                        }
                    }
                    if (absentArray.length > 0) {
                        for (let index = 0; index < absentArray.length; index++) {
                            var new_parcours = {
                                cours: cours,
                                groupe: group,
                                date: date,
                                heureStart: heurdebut,
                                heureFin: heurfin,
                                presence: false,
                                user: absentArray[index].mail,
                                name: absentArray[index].name
                            };
                            await ParcoursModel(new_parcours).save();
                        }
                    }
                    res.send("success");
                }
            } catch (error) {
                res.send(error);
            }
        });

});



//Add parcours Thierry
routeExp.route("/Teacheraddparcours").post(async function (req, res) {
    var date = req.body.dateNewParcours;
    var group = req.body.groupParcoursName;
    var cours = req.body.cours;
    var heurdebut = req.body.timestartAt;
    var heurfin = req.body.timeEndAt;
    var presentArray = req.body.present;
    var absentArray = req.body.absent;
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
                if ((await ParcoursModel.findOne({ $or: [{ cours: cours, groupe: group, date: date, heureStart: heurdebut, heureFin: heurfin }] })) || date == "" || group == "" || heurdebut == "" || heurfin == "" || cours == "") {

                    res.send("exist");
                } else {

                    if (presentArray.length > 0) {
                        for (let index = 0; index < presentArray.length; index++) {
                            var new_parcours = {
                                cours: cours,
                                groupe: group,
                                date: date,
                                heureStart: heurdebut,
                                heureFin: heurfin,
                                presence: true,
                                user: presentArray[index].email,
                                name: presentArray[index].name
                            };
                            await ParcoursModel(new_parcours).save();
                        }
                    }
                    if (absentArray.length > 0) {
                        for (let index = 0; index < absentArray.length; index++) {
                            var new_parcours = {
                                cours: cours,
                                groupe: group,
                                date: date,
                                heureStart: heurdebut,
                                heureFin: heurfin,
                                presence: false,
                                user: absentArray[index].email,
                                name: absentArray[index].name
                            };
                            await ParcoursModel(new_parcours).save();
                        }
                    }
                    res.send("success");
                }
            } catch (error) {
                res.send(error);
            }
        });

});


//Add parcours
routeExp.route("/presence").post(async function (req, res) {
    var groupe = req.body.gpe;
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
            coursM = await CGNModel.find({ cours: cours, groupe: groupe })
            res.send(coursM);
        });

});


//Add new membre
routeExp.route("/membre_new").post(async function (req, res) {
    var groupe = req.body.groupe;
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
    if (session.occupation_adm == "adm") {
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


// Thierry add Level
routeExp.route("/addLevelToMember").post(async function (req, res) {
    var id = req.body.id;
    var userLevel = req.body.level;
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
            res.send("success");
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
    // var point = req.body.point;
    var point = req.body.newpoint;

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
                res.send("success");
            }
        })
})


//Save Graduation
routeExp.route("/saveGrad").post(async function (req, res) {
    //var id = req.body.id;
    var grad = req.body.newgrad;
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

                res.send("success");
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


//delete membre admin
routeExp.route("/deleteMbAdmin").post(async function (req, res) {
    var id = req.body.id;
    var groupe = req.body.groupe;
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
                await CGNModel.findOneAndDelete({ mcode: id, groupe: groupe });
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });
})
//get time admin
routeExp.route("/gettimeadmin").post(async function (req, res) {
    var date = req.body.date;
    var day = req.body.day;
    var group = req.body.group;
    var startTim = req.body.startTim;
    var endTim = req.body.endTim;
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
            var temp = await EmplTemp.findOne({ jours: day, groupe: group, heureStart: startTim, heureFin: endTim, cours: cours })
            var datatemp = {}

            if (temp.date) {
                var date = new Date(temp.date);
                //temp.date = date.toLocaleDateString("fr"); 
                datatemp.groupe = temp.groupe
                datatemp._id = temp._id
                datatemp.jours = temp.jours
                datatemp.heureStart = temp.heureStart
                datatemp.heureFin = temp.heureFin
                datatemp.cours = temp.cours
                datatemp.date = date.toLocaleDateString("fr");
                //datatemp.jours = temp.jours
                //console.log("temp.date ", temp.date);
            } else {
                datatemp = temp
            }
            console.log("elment ", datatemp);
            // temp.forEach(elmt =>{
            //     var jours = elmt.jours
            //     var groupe = elmt.groupe
            // }

            //)
            res.send(datatemp);
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
            var temp = await EmplTemp.findOne({ _id: id })
            console.log(temp);
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
    var date = req.body.date;

    try {
        mongoose

            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin, date: date });
                res.send("success");
            });
    } catch (error) {
        console.log(error);
        res.send("error");
    }
})

//Update update_time
routeExp.route("/update_timeadmin").post(async function (req, res) {
    var id = req.body.id;
    var jours = req.body.jours;
    var group = req.body.group;
    var heurdebut = req.body.heurdebut;
    var heurfin = req.body.heurfin;
    var date = req.body.date;
    console.log("req.body ", req.body);

    try {
        mongoose

            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var emp
                if (date) {
                    emp = await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin, date: date });
                    console.log("date ", emp);
                } else {
                    emp = await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin });
                    console.log("non date ", emp);
                }
                console.log("emp ", emp);
                res.send("success");
            });
    } catch (error) {
        console.log(error);
        res.send("error");
    }

})

//Update update_parcours
routeExp.route("/update_parcours").post(async function (req, res) {

    //var week = req.body.week;
    var timeSUpd = req.body.timeSUpd;
    var timeEUpd = req.body.timeEUpd;
    var groupe = req.body.groupe;
    var presentUpd = req.body.presentUpd;
    var absentUpd = req.body.absentUpd;
    var dateUpd = req.body.dateUpd;

    const listeUserPres = presentUpd.split(",");
    const listeUserAbs = absentUpd.split(",");
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {

            for (let i = 0; i < listeUserPres.length; i++) {
                //console.log("listeUserPres[i]", listeUserPres[i]);
                await ParcoursModel.findOneAndUpdate({ _id: listeUserPres[i] }, { date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: true })

            }
            for (let j = 0; j < listeUserAbs.length; j++) {
                await ParcoursModel.findOneAndUpdate({ _id: listeUserAbs[j] }, { date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: false })

            }
            // await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin });
            res.send("Parcours updated successfully");
        })
})



//Update update_parcours admin
routeExp.route("/update_parcours_admin").post(async function (req, res) {

    //var week = req.body.week;
    var timeSUpd = req.body.timeSUpd;
    var timeEUpd = req.body.timeEUpd;
    var groupe = req.body.groupe;
    // var presentUpd = req.body.presentUpd;
    // var absentUpd = req.body.absentUpd;
    var dateUpd = req.body.dateUpd;

    const listeUserPres = req.body.presentUpd;
    const listeUserAbs = req.body.absentUpd;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {

            for (let i = 0; i < listeUserPres.length; i++) {
                //console.log("listeUserPres[i]", listeUserPres[i]);
                await ParcoursModel.findOneAndUpdate({ _id: listeUserPres[i] }, { date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: true })

            }
            for (let j = 0; j < listeUserAbs.length; j++) {
                if (listeUserAbs[j] != "") {
                    await ParcoursModel.findOneAndUpdate({ _id: listeUserAbs[j] }, { date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: false })
                }

            }
            // await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin });
            res.send("Parcours updated successfully");
        })
})

// update parcours Thierry
routeExp.route("/update_parcoursajax").post(async function (req, res) {

    // var week = req.body.week;
    var timeSUpd = req.body.timestartAt;
    var timeEUpd = req.body.timeEndAt;
    var groupe = req.body.groupParcoursName;
    var listeUserPres = req.body.present;
    var listeUserAbs = req.body.absent;
    var dateUpd = req.body.dateNewParcours;

    // console.log(req.body);

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
                if (listeUserPres.length > 0) {
                    for (let i = 0; i < listeUserPres.length; i++) {
                        await ParcoursModel.findOneAndUpdate({ _id: listeUserPres[i] }, { date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: true })

                    }
                }
                if (listeUserAbs.length > 0) {
                    for (let j = 0; j < listeUserAbs.length; j++) {
                        await ParcoursModel.findOneAndUpdate({ _id: listeUserAbs[j] }, { date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: false })

                    }
                }
                // await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin });
                res.send("success");
            } catch (error) {
                res.send(error);
            }
        });
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


//delete emploi admin
routeExp.route("/deleteEmploiAdmin").post(async function (req, res) {
    var id = req.body.id;
    var jours = req.body.day;
    var group = req.body.group;
    var startTim = req.body.startTim;
    var endTim = req.body.endTim;
    var cours = req.body.cours;
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
                var delet = []
                if (date) {
                    delet = await EmplTemp.findOneAndDelete({ _id: id })//date: date, groupe: group, heureStart: startTim, heureFin: endTim, cours: cours, day: jours  });
                } else {
                    delet = await EmplTemp.findOneAndDelete({ _id: id })// groupe: group, heureStart: startTim, heureFin: endTim, cours: cours, day: jours  });
                }

                res.send("success");
            } catch (err) {
                res.send(err);
            }
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

            var ParcoursAbsent = await ParcoursModel.aggregate([

                {
                    $match: { cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin }

                },
                {
                    $group: {
                        _id:
                            { cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin, date: date },
                        tabl: { $push: { user: "$user", presence: "$presence", name: "$name", id: "$_id" } }
                    }
                }

            ]);
            res.send(ParcoursAbsent);
        });
})


//get getParcours Ajax
routeExp.route("/getParcoursAjax").post(async function (req, res) {
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

            var ParcoursAbsent = await ParcoursModel.aggregate([

                {
                    $match: { cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin }

                },
                {
                    $group: {
                        _id:
                            { cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin, date: date },
                        tabl: { $push: { user: "$user", presence: "$presence", name: "$name", id: "$_id" } }
                    }
                }

            ]);

            var groupeMemberList = [];

            var parcoursData = ParcoursAbsent[0]._id;
            var parcoursAttendenceData = ParcoursAbsent[0].tabl;
            parcoursAttendenceData.forEach(member => { groupeMemberList.push(member) });
            data = { "cours": parcoursData.cours, "groupe": parcoursData.groupe, "timeStart": parcoursData.heureStart, "timeEnd": parcoursData.heureFin, "date": parcoursData.date, "attendence": groupeMemberList }
            console.log(JSON.stringify(data));
            res.send(data);
        });
})


//get getParcoursUpdate
routeExp.route("/getParcoursUpdate").post(async function (req, res) {
    var cours = req.body.cours;
    // var week = req.body.week;
    var groupe = req.body.groupe;
    var heureStart = req.body.heureStart;
    var heureFin = req.body.heureFin;
    var date = req.body.date;
    try {
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
                    { $match: { $or: [{ cours: cours }, { groupe: groupe }, { heureStart: heureStart }, { heureFin: heureFin }, { date: date }] } },
                    {
                        $group: {
                            _id:
                                { cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin, date: date },
                            tabl: { $push: { user: "$user", presence: "$presence" } }
                        }
                    }
                ])

                //console.log("Parcours ", ParcoursAbsent[0].tabl);
                res.send(ParcoursAbsent);
            });
    } catch (error) {
        console.log(error);
    }
})

//get getParcours Admin
routeExp.route("/getParcoursAdmin").post(async function (req, res) {
    var cours = req.body.cours;
    var groupe = req.body.groupe;
    var heureStart = req.body.heureStart;
    var heureFin = req.body.heureFin;
    var date = req.body.date;

    date = date = date.split('/').reverse().join('-');
    console.log("date ", date);
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

                {
                    $match: {
                        date: new Date(date), cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin
                    }
                    //$match: {  date: { $gte: ISODate("2022-02-03") } }//cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin}

                },
                {
                    $group: {
                        _id:
                            { date: date, cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin },
                        tabl: { $push: { user: "$user", presence: "$presence", name: "$name", id: "$_id" } }
                    }
                }

            ]);
            //console.log(moment(date).format("DD-MM-YYYY"));
            console.log("ParcoursAbsent ", ParcoursAbsent);
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
    //console.log("cours ****** ", cours, groupe, heureStart, date);
    //console.log(req.body);
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
                await ParcoursModel.deleteMany({ cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin, date: date });
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });
})

// Thierry delete parcours ajax
routeExp.route("/deleteParcoursajax").post(async function (req, res) {
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
                await ParcoursModel.deleteMany({ cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin, date: date });
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });
})


//delete parcours
routeExp.route("/point_grad").post(async function (req, res) {
    var value = req.body.point;
    //var todata = JSON.parse(value);
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
                for (let i = 0; i < value.length; i++) {
                    const element = value[i];
                    await CGNModel.updateMany({ username: element.mail }, { $set: { point: element.point, graduation: element.grad } })

                }
                res.send("success")
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });
})



//Backup DataBase

routeExp.route("/point_grad").get(async function (req, res) {
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
                var user = await UserSchema.find({ validation: true });
                var coursM = await CoursModel.find({ validation: true });
                var groupM = await GroupeModel.find({ validation: true });
                var niveauM = await NiveauModel.find({ validation: true });
                var parcours = await ParcoursModel.find({ validation: true });
                var emplDTp = await EmplTemp.find({ validation: true });
                var point = await Point.find({ validation: true });
                var grad = await Graduation.find({ validation: true });
                var cgnM = await CGNModel.find({ validation: true });


                //var data = fs.readFileSync("data.json");
                var myObject = []
                myObject.push({ "cours": coursM }, { "group": groupM },
                    { "user": user }, { "niveau": niveauM }, { "parcours": parcours },
                    { "emplDTp": emplDTp }, { "point": point }, { "grad": grad }, { "cgnM": cgnM });

                var newData2 = JSON.stringify(myObject);
                fs.writeFile("./Route/BackUpData/data.json", newData2, (err) => {
                    if (err) throw err;
                    //console.log("New data added");
                });
                console.log("finish backup");
            } catch (err) {
                console.log(err);
                res.send(data)
            }
        });
})




routeExp.route("/allGroupe").post(async function (req, res) {
    var session = req.session;
    var cours = req.body.cours
    if (session.occupation_adm == "adm") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {
                var coursM = await GroupeModel.find({ $or: [{ cours: cours }] })
                res.send(coursM);
            });


    } else {
        res.redirect("/");
    }
});


//Liste membre par groupe
routeExp.route("/groupe/:cours/:groupe").get(async function (req, res) {

    var groupe = req.params.groupe
    var cours = req.params.cours
    //res.send("date")
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
            //res.render("ListeCours.html", { ParcoursAbsent: ParcoursAbsent, coursM: coursM, membre: membre, time: time, parcours: parcours, cours: cours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
            //console.log("membre", JSON.stringify(membre));
            res.send(JSON.stringify(membre));
        });

});



// Thierry add Level
routeExp.route("/addLevelToMemberAdmin").post(async function (req, res) {
    var user = req.body.user;
    var groupe = req.body.groupe;
    var level = req.body.level;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            await CGNModel.findOneAndUpdate({ username: user, groupe: groupe }, { niveau: level });

            res.send("success");
        })
})

const XLSX = require('xlsx');
const { timeEnd } = require('console');
routeExp.route("/addnameCGN").get(async function (req, res) {
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
                liste.push(element.data)
            });

            var membre = await CGNModel.find({ $or: [{ cours: "Problem solving and decision making" }] })
            console.log("membre");
            for (let i = 0; i < liste[0].length; i++) {
                var elementliste = liste[0][i];
                for (let j = 0; j < membre.length; j++) {
                    const elementmb = membre[j];
                    //console.log(j, "elementmb", elementmb.name);
                    if (elementmb.name == undefined && (elementliste.EMAIL == elementmb.username)) {
                        console.log("file name", elementliste.NOM);
                        console.log("file", elementliste.EMAIL);
                        console.log('base de d', elementmb.username);
                        //console.log(i , "===  ", elementmb);
                        var cgn = await CGNModel.findOneAndUpdate({ username: elementmb.username, cours: "Problem solving and decision making" }, { name: elementliste.NOM })
                        console.log("cccc", cgn);
                        // }else{
                        //     console.log(j, "elementmb", elementmb.name);

                    }
                    // if (elementliste.EMAIL == elementmb.username && (elementmb.name == undefined)) {
                    //     console.log("file name", elementliste.NOM);
                    //     console.log("file", elementliste.EMAIL);
                    //     console.log('base de d', elementmb.username);
                    //     console.log(i , "===  ", elementmb);
                    //     //await CGNModel.findOneAndUpdate({ username: elementmb.username }, { name:  elementliste.NOM})
                    //     console.log("****************");
                    // }
                    //console.log(j , "element ", element);
                }
            }
            // console.log("membre", membre[9].username);
            // console.log("fffiiiin");
        });
})



var demand = ""
//Liste cours student
routeExp.route("/allCoursStudent").get(async function (req, res) {
    
    var session = req.session;
    if (session.occupation_particip == "Participant") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {


                var listcour = await CoursModel.aggregate([
                    {
                        $match: {
                            type: 'facultatif',
                        },
                    },
                    {

                        $lookup: {
                            from: "coursdemands",
                            localField: "name_Cours",
                            foreignField: "coursd",
                            as: "demande"
                        }
                    }, 
                    {
                        $lookup: {
                          from: "datausers",
                          localField: "professeur",
                          foreignField: "username",
                          as: "profInfo"
                        }
                      },
                ])
                var user = session.m_code
                //res.render("./StudentView/backAllCours.html", {listcourFac, demand, user})
                var coursSuivi = []
                var autreCours = []
                listcour.forEach(element => {
                   console.log("element ", element);
                    var list = element.demande

                    //console.log("list ", list);
                    if (list.length>0) {
                        list.forEach(element1 => {
                            var userelmt = element1.user
                            // console.log("element1 ", userelmt.trim());
                            // console.log("user ", user.trim());
                            // console.log("element1.demand ", element1.demand);
                            // console.log("************");
                            if ((userelmt.trim() == user) && (element1.demand == true) && (element1.valid == true)) {
                                //console.log("========element1 ", element);
                                
                                var coursS = {
                                    name_Cours: element.name_Cours,
                                    date_Commenc: element.date_Commenc,
                                    professeur: element.profInfo[0].name,
                                    description: element.description
                                }
                                coursSuivi.push(coursS)
                            } else if ((userelmt.trim() == user) && (element1.demand == false) && (element1.valid == false)) {
                                var coursD = {
                                    name_Cours: element.name_Cours,
                                    date_Commenc: element.date_Commenc,
                                    professeur: element.profInfo[0].name,
                                    description: element.description,
                                    autrecours: true
                                }
                                autreCours.push(coursD)
                            }

                        });

                    } else {
                        //console.log("eeeeeeeeeeeeeeeellllllllllllllllllsssssssssssssse");
                        var coursE = {
                            name_Cours: element.name_Cours,
                            date_Commenc: element.date_Commenc,
                            professeur: element.profInfo[0].name,
                            description: element.description,
                            autrecours: false
                        }
                        autreCours.push(coursE)
                    }
                });
                res.render("./StudentView/backAllCours.html", {  demand, user: session.m_code, coursSuivi, autreCours })//, { cours: cours, listuser: listUser, listcourOblig: listcourOblig, listcourFac: listcourFac, coursM: coursM })

                console.log("courSuivi", coursSuivi);
                console.log("autreCours", autreCours);
            });
    } else {
        res.redirect("/");
    }
});
//Liste cours student
routeExp.route("/listeCoursStudent").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_particip == "Participant") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {


                var listcour = await CoursModel.aggregate([
                    {
                        $match: {
                            type: 'facultatif',
                        },
                    },
                    {

                        $lookup: {
                            from: "coursdemands",
                            localField: "name_Cours",
                            foreignField: "coursd",
                            as: "demande"
                        }
                    }, 
                    {
                        $lookup: {
                          from: "datausers",
                          localField: "professeur",
                          foreignField: "username",
                          as: "profInfo"
                        }
                      },
                ])
                var user = session.m_code
                //res.render("./StudentView/backAllCours.html", {listcourFac, demand, user})
                var coursSuivi = []
                var autreCours = []
                listcour.forEach(element => {
                   // console.log("element ", element);
                    var list = element.demande
                    //console.log("list ", list);
                    if (list.length>0) {
                        list.forEach(element1 => {
                            var userelmt = element1.user
                            // console.log("element1 ", userelmt.trim());
                            // console.log("user ", user.trim());
                            // console.log("element1.demand ", element1.demand);
                            // console.log("************");
                            if ((userelmt.trim() == user) && (element1.demand == true) && (element1.valid == true)) {
                                //console.log("========element1 ", element);
                                var coursS = {
                                    name_Cours: element.name_Cours,
                                    date_Commenc: element.date_Commenc,
                                    professeur: element.profInfo[0].name,
                                    description: element.description
                                }
                                coursSuivi.push(coursS)
                            } else if ((userelmt.trim() == user) && (element1.demand == false) && (element1.valid == false)) {
                                var coursD = {
                                    name_Cours: element.name_Cours,
                                    date_Commenc: element.date_Commenc,
                                    professeur: element.profInfo[0].name,
                                    description: element.description,
                                    autrecours: true
                                }
                                autreCours.push(coursD)
                            }

                        });

                    } else {
                        //console.log("eeeeeeeeeeeeeeeellllllllllllllllllsssssssssssssse");
                        var coursE = {
                            name_Cours: element.name_Cours,
                            date_Commenc: element.date_Commenc,
                            professeur: element.profInfo[0].name,
                            description: element.description,
                            autrecours: false
                        }
                        autreCours.push(coursE)
                    }
                });
                console.log("autreCours", demand);
                console.log("courSuivi", coursSuivi);
                console.log("autreCours", coursSuivi);
                console.log("courSuivi", session.m_code);
                res.render("./StudentView/studentAllCoursDesigned.html", {  demand, user: session.m_code, coursSuivi, autreCours })//, { cours: cours, listuser: listUser, listcourOblig: listcourOblig, listcourFac: listcourFac, coursM: coursM })

                
            });
    } else {
        res.redirect("/");
    }
});


// Demande envoye
routeExp.route("/createDemand").post(async function (req, res) {
    var user = req.body.user;
    var cours = req.body.cours;
    var demand = req.body.demand;
    console.log("req ", req.body);
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            if (await DemandCours.findOne({ user: user, coursd: cours})) {
                //console.log("errrro");
                res.send("error");
            } else {
                //await DemandCours.findOneAndUpdate({ username: user, groupe: groupe }, { niveau: level });
                //if (demand == false) {
                var new_demand = {
                    coursd: cours,
                    user: user,
                    demand: demand,
                    valid: false
                }
                var d = await DemandCours(new_demand).save();
                //res.send("success");
                console.log("create", d);

            }
        })
})


// Demande delete
routeExp.route("/deleteDemand").post(async function (req, res) {
    var user = req.body.user;
    var cours = req.body.cours;
    // var demand = req.body.demand;
    console.log("req ", req.body);
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
                await DemandCours.findOneAndDelete({ user: user, coursd: cours });
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        })
})


// Demande Accepté
routeExp.route("/validDemand").post(async function (req, res) {
    var user = req.body.user;
    var cours = req.body.cours;
    // var demand = req.body.demand;
    console.log("req ", req.body);
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
                await DemandCours.findOneAndUpdate({ user: user, coursd: cours }, { demand: true, valid: true});
                res.send("success");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        })
})




//Liste demande de validation
routeExp.route("/demandeValid").get(async function (req, res) {
    var session = req.session;
    //if (session.occupation_particip == "Participant") {
        mongoose
            .connect(
                "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
                {
                    useUnifiedTopology: true,
                    UseNewUrlParser: true,
                }
            )
            .then(async () => {

                var membreDemand = await DemandCours.aggregate([
                    { 
                        $match: { 
                            demand: false, 
                            valid: false 
                        }
                    },
                    {

                        $lookup: {
                            from: "datausers",
                            localField: "user",
                            foreignField: "m_code",
                            as: "demande"
                        }
                    }, 
                ])

                var listeCoursD = []
                //console.log("membre Demande", membreDemand);
                membreDemand.forEach(element => {
                    console.log("element ", element);
                    var newData = {
                        coursd: element.coursd,
                        mcode: element.user,
                        nameuser: element.demande[0].name,
                        numuser: element.demande[0].num_agent
                    }
                    listeCoursD.push(newData)
                });

                console.log("new ", listeCoursD);






                
            });
    // } else {
    //     res.redirect("/");
    // }
});