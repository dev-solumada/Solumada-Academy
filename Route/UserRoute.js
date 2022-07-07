const express = require('express');
const routeExp = express.Router();
const mongoose = require('mongoose');
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

const ForeignK = require("../Models/WithForeignK");

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
                    console.log("superieur à 0", logger.occupation.length);
                    var prof_occ = ""
                    var part_occ = ""
                    for (let i = 0; i < logger.occupation.length; i++) {
                        const element = logger.occupation[i];
                        if (element == "Professeur") {
                            session.occupation_prof = element;
                        }else if (element == "Participant"){
                            session.occupation_particip = element;
                        }
                    }
                    res.redirect("/teachParticipHome")//, { prof_occ: prof_occ, part_occ: part_occ });
                } else
                if (logger.type_util == "Professeur") {
                    session.occupation_prof = logger.type_util;;
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
                console.log("email", email);
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
                var time = await EmplTemp.find({ cours: cours });
                res.send(JSON.stringify(time));
            });
    }
    else {
        res.redirect("/");
    }
});

class Parcours {
    constructor(cour_name, group_name, start_time, end_time, date, present, absent)
    {
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

                try {
                    var ParcoursAbsent = await ParcoursModel.aggregate([
                        { $match: { $or: [{ cours: cours }] } },
                        {
                            $group: {
                                _id:
                                    { weed: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                                tabl: { $push: { user: "$user", presence: "$presence", _id: "$_id" } }
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
                        date = date.toLocaleDateString();
                        var memberAbsence = parcours.tabl;
                        var absents = [];
                        var presents = [];

                        memberAbsence.forEach(abs => {
                            if(abs.presence == true){ presents.push(abs.user); }
                            else { absents.push(abs.user); }
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

                //await CGNModel.updateMany({ cours: "Problem solving and decision making" }, { professeur: req.session.nomProf})

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
        res.render("./StudentView/studentHome.html");
    }
    else {
        res.redirect("/");
    }
});


//Accueil Utilisateur qui est Participant et Professeur en même temps
routeExp.route("/teachParticipHome").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_particip == "Participant" && session.occupation_prof == "Professeur") {
        res.render("./StudentProf.html", {part_occ: session.occupation_particip, prof_occ: session.occupation_prof });
    }
    // if (session.occupation_particip == "Participant") {
    //     res.render("./StudentView/studentHome.html");
    // }
    else {
        res.redirect("/");
    }
});


// student Group
routeExp.route("/studentGroup").get(async function (req, res) {
    var session = req.session;
    if (session.occupation_particip == "Participant") {
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
        res.render("./StudentView/studentGroup.html", { groupe: groupeEt });
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
    if (session.occupation_particip == "Participant") {
        var name = session.name;
        var m_code = session.m_code
        var user = await CGNModel.findOne({ $or: [{ mcode: m_code }] })
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
                console.log("user ", user.occupation.length);


                if (user.occupation.indexOf('Professeur') === -1) {
                    await UserSchema.findOneAndUpdate({ username: professeur },   { $push: { occupation: "Professeur" } })
                } 
                // else {
                //     console.log('⛔️ value is in array');
                //   }

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
                            _id:{ username: "$username", firstname: "$firstname", m_code: "$mcode", num_agent: "$num_agent" , point: "$point", graduation: "$graduation"},
                            tabl: { $push: { id: "$_id", niveau: "$niveau", cours: "$cours" } }
                        }
                    }
                ]);

                var points =  await Point.find({ validation: true });
                console.log(points);
                var grades =  await Graduation.find({ validation: true });
                console.log(grades);
                
                var data = [];
                members.forEach(member => {
                    var member_email = member._id.username;
                    var member_m_code = member._id.m_code;
                    var member_number = member._id.num_agent;
                    var member_point = member._id.point;
                    var member_gradudation = member._id.graduation;
                    var member_courslevel = [];
                    var member_userpoints = [];
                    var member_grades = [];

                    if(member_point != null)
                        {member_userpoints.push(member_point);}
                    else 
                        {member_userpoints.push("None");}
                    if(member_gradudation!=null)
                        {member_grades.push(member_gradudation);}
                    else 
                        {member_grades.push("None");}
                    var coursLevelsData = member.tabl;
                    coursLevelsData.forEach(courLevel => {
                        var str = '';
                        if(courLevel.cours){str = str + courLevel.cours + ' - '};
                        if(courLevel.niveau){str = str + courLevel.niveau};
                        member_courslevel.push(str);
                    });

                    points.forEach(point => {member_userpoints.push(point.point)});
                    grades.forEach(grade => {member_grades.push(grade.graduation)});

                    var personne = new Employee(email=member_email, number=member_number, m_code=member_m_code, coursAndlevel=member_courslevel, emp_point=member_userpoints, emp_grade=member_grades);
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
                            { week: "$week", cours: "$cours", groupe: "$groupe", heureStart: "$heureStart", heureFin: "$heureFin", date: "$date" },
                        tabl: { $push: { user: "$user", presence: "$presence", _id: "$_id"  } }
                    }
                }

            ])

            coursM = [{ professeur: "Rojovola" }]
            res.render("ListeCours.html", { cours_prof: coursM, ParcoursAbsent: ParcoursAbsent, coursM: coursM, parcours: parcours, time: time, membre: membre, cours: nomCours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });
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
                    console.log("get", getProf[0].professeur);
                    var mcode = ""
                    var num_agent = ""
                    var firstname = ""
                    for (let i = 0; i < user.length; i++) {
                        const element = user[i];
                        mcode = element.m_code
                        num_agent = element.num_agent
                        firstname = element.firstname

                        if (element.occupation.indexOf('Participant') === -1) {
                            await UserSchema.findOneAndUpdate({ m_code: mcode },   { $push: { occupation: "Participant" } })
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
            res.render("ListeCours.html", { ParcoursAbsent: ParcoursAbsent, coursM: coursM, membre: membre, time: time, parcours: parcours, cours: cours, listUser: listUser, listgroupe: listgroupe, listcourOblig: listcourOblig, listcourFac: listcourFac });

        });

});


//Add emploie du temps
routeExp.route("/EmplTemp").post(async function (req, res) {
    var jours = req.body.jours;
    var group = req.body.group;
    var cours = req.body.cours;
    var heurdebut = req.body.timeStart;
    var heurfin = req.body.timeEnd;
    
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
    var date = req.body.date
    var group = req.body.group
    var cours = req.body.cours
    var heurdebut = req.body.timeStart
    var heurfin = req.body.heurfin
    var present = req.body.present
    var absent = req.body.absent
    const presentArray = present.split(",");
    const absentArray = absent.split(",");
    console.log("date ", date,  group, cours, heurdebut, heurfin, present, absent  );
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



// const XLSX = require('xlsx')
// routeExp.route("/addxlsx").get(async function (req, res) {
//     var session = req.session;
//     //if (session.type_util == "Admin") {
//     mongoose
//         .connect(
//             "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
//             {
//                 useUnifiedTopology: true,
//                 UseNewUrlParser: true,
//             }
//         )
//         .then(async () => {

//             const parseExcel = (filename) => {

//                 const excelData = XLSX.readFile(filename);

//                 return Object.keys(excelData.Sheets).map(name => ({
//                     name,
//                     data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
//                 }));
//             };
//             var liste = []
//             parseExcel("./Vue/assets/listeUser.xls").forEach(element => {

//                 liste.push(element.data)
//             });

//             var listUser = await UserSchema.find({ validation: true });
//             var passdefault = "solumada0000";
//             var value = liste[0]

//             for (let i = 137; i < value.length; i++) {

//                 var user = value[i];
//                 //console.log("name: ",user.NOM);
//                 var new_emp = {
//                     name: user.NOM,
//                     username: user.MAIL,
//                     password: passdefault,
//                     m_code: user.CODE,
//                     num_agent: user.NUMBERING,
//                     type_util: ""
//                 };
//                 var list = await UserSchema.find({ validation: true })
//                 if (list[i + 4].name == user.NOM) {

//                     // console.log("liste ", list[i].name);
//                     // console.log("new_emp ", user.NOM);
//                     // console.log("new_emp ", user.PRENOM);
//                     //await UserSchema.findOneAndUpdate({name: user.NOM}, { firstname: user.PRENOM });
//                 }
//                 for (let i = 0; i < list.length; i++) {
//                     const element = list[i].name;
//                     if (element == new_emp.username) {
//                         //console.log("element egale", list[i].name);

//                     }
//                 }
//                 //await UserSchema(new_emp).save();

//             }
//             //sendEmail(email, "Authentification Academy solumada", htmlRender(email, passdefault));
//             //res.send(email);
//             //}

//         });
// });


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
    // var point = req.body.point;
    var point = req.body.newpoint;
    console.log(point);

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
    console.log(id);
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
    console.log(req.body);
    res.send('success');
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
            await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin });
            res.send("Time updated successfully");
        });
    } catch (error) {
        res.send("error");
    }
})


//Update update_parcours
routeExp.route("/update_parcours").post(async function (req, res) {
   
    var week = req.body.week;
    var timeSUpd = req.body.timeSUpd;
    var timeEUpd = req.body.timeEUpd;
    var groupe = req.body.groupe;
    var presentUpd = req.body.presentUpd;
    var absentUpd = req.body.absentUpd;
    var dateUpd = req.body.dateUpd;
    
    const listeUserPres = presentUpd.split(",");
    const listeUserAbs = absentUpd.split(",");
    console.log("parcours upd week", week, "date ",  dateUpd  , "timeS ",timeSUpd, "timeE ", timeEUpd, "groupe ", groupe, listeUserPres, listeUserAbs);
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
                console.log("listeUserPres ", listeUserPres[i]);
                await ParcoursModel.findOneAndUpdate({ _id: listeUserPres[i] }, { week: week, date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: true})
                
            }
            for (let j = 0; j < listeUserAbs.length; j++) {
                console.log("listeUserAbs ", listeUserAbs[j]);
                await ParcoursModel.findOneAndUpdate({ _id: listeUserAbs[j] }, { week: week, date: dateUpd, groupe: groupe, heureStart: timeSUpd, heureFin: timeEUpd, presence: false})
                
            }
            // await EmplTemp.findOneAndUpdate({ _id: id }, { jours: jours, groupe: group, heureStart: heurdebut, heureFin: heurfin });
            res.send("Parcours updated successfully");
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
    var groupe = req.body.groupe;
    var heureStart = req.body.heureStart;
    var heureFin = req.body.heureFin;
    var date = req.body.date;
    var week = req.body.week;
    console.log("getParcours", cours, groupe, heureStart, heureFin, date, week);
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
                { $match: { $or: [{ cours: cours }] } },//, {week: week}, {groupe: groupe}, {heureStart: heureStart}, {heureFin: heureFin}, {date: date}] } },
                {
                    $group: {
                        _id:
                            { week: week, cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin, date: date },
                        tabl: { $push: { user: "$user", presence: "$presence", id: "$_id" } }
                    }
                }
            ])
            res.send(ParcoursAbsent);
        });
})


//get getParcoursUpdate
routeExp.route("/getParcoursUpdate").post(async function (req, res) {
    var cours = req.body.cours;
    var week = req.body.week;
    var groupe = req.body.groupe;
    var heureStart = req.body.heureStart;
    var heureFin = req.body.heureFin;
    var date = req.body.date;
    console.log("cours", week, cours, groupe, heureStart, heureFin, date);
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
                            { week: week, cours: cours, groupe: groupe, heureStart: heureStart, heureFin: heureFin, date: date },
                        tabl: { $push: { user: "$user", presence: "$presence" } }
                    }
                }
            ])

            var AllParcours = await ParcoursModel.find({ validation: true })
            console.log("Parcours ", ParcoursAbsent);
            console.log("AllParcours ", AllParcours);
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
    var todata = JSON.parse(value)
    console.log("value", todata)//JSON.stringify(value) );
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
                for (let i = 0; i < todata.length; i++) {
                    const element = todata[i];
                    await CGNModel.findOneAndUpdate({ username: element.mail }, { point: element.point, graduation: element.grad })
                }
                console.log("Point and Graduation sucess");
            } catch (err) {
                console.log(err);
                res.send(err);
            }
        });
})

// routeExp.route("/occupationAdd").get(async function (req, res) {
//     mongoose
//         .connect(
//             "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
//             {
//                 useUnifiedTopology: true,
//                 UseNewUrlParser: true,
//             }
//         )
//         .then(async () => {

//             var listUser = await UserSchema.find({ validation: true });
//             //await UserSchema.findOneAndUpdate({ username: element.mail }, { point: element.point, graduation: element.grad })
//             console.log("listUser ", listUser.length);
//             for (let i = 0; i < listUser.length; i++) {
//                 const element = listUser[i];
//                 var c = []
//                 c.push(listUser[i].type_util)
//                 await UserSchema.findOneAndUpdate({ username: listUser[i].username }, { occupation: c })
//                 console.log("listUser[i] ",listUser[i]);
//                 //await UserSchema.findOneAndUpdate({ username: element.mail }, { point: element.point, graduation: element.grad })
//             }
//         });
// })
