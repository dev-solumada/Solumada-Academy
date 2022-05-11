const express = require('express');
const routeExp = express.Router()
const mongoose = require('mongoose')
// solumada-academy : academy123456

const UserSchema = require("../Models/User");
const CoursModel = require("../Models/CoursModel");
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

function htmlVerification(code) {
    return (
      "<center><h1>YOUR TIMESHEETS CODE AUTHENTIFICATION</h1>" +
      "<h3 style='width:250px;font-size:50px;padding:8px;background-color:#619FCB; color:white'>" +
      code +
      "<h3></center>"
    );
  }
//Function html render
function htmlRender(username, password) {
    var html = '<center><h1>SOLUMADA ACADEMY AUTHENTIFICATION</h1>' +
        '<table border="1" style="border-collapse:collapse;width:25%;border-color: lightgrey;">' +
        '<thead style="background-color: #9F4F45;color:white;font-weight:bold;height: 50px;">' +
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
    session = req.session;
    req.session.destroy();
    res.render("LoginPage.html", { erreur: "" });
    // if (session.type_util == "Professeur") {
    //     res.redirect("/cours");
    // }
    // else if (session.type_util == "Admin") {
    //     res.redirect('/admin');
    // }
    // else if (session.type_util == "Participant") {
    //     res.redirect('/mon_cours');
    // }
    // else {
    //     res.render("LoginPage.html", { erreur: "" });
    // }

});

//reset password
routeExp.route("/resetPwd").get(async function (req, res) {
    //Reset password
    session = req.session;
    if (session.mailconfirm) {
        res.redirect("/code");
    } else {
        res.render("resetPwd.html", { err: "" });
    }//

});


//New password
routeExp.route("/code").post(async function (req, res) {
    session = req.session;
    var email = req.body.username;
    console.log("email == "+ email);
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
            "Verification code timesheets",
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
    session = req.session;
    if (session.mailconfirm) {
      res.render("code.html", { err: "" });
    } else {
      res.redirect("/");
    }
  });

//Check code
routeExp.route("/check").post(async function (req, res) {
    session = req.session;
    if (session.code == req.body.code) {
      res.send("match");
    } else {
      res.send("not");
    }
  });


//Change password
routeExp.route("/change").post(async function (req, res) {
    var newpass = req.body.pass;
    session = req.session;
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
        await UserSchema.findOneAndDelete({username:names[0]});
        res.send("User deleted successfully");
  })
  })
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
    var m_code = req.body.m_code;
    var num_agent = req.body.num_agent;
    var type_util = req.body.type_util;
    console.log("email == ", email);
    console.log("m_code == ", m_code);
    console.log("num_agent == ", num_agent);
    console.log("type_util == ", type_util);
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
                    username: email,
                    password: passdefault,
                    m_code: m_code,
                    num_agent: num_agent,
                    type_util: type_util
                };
                console.log("new_emp *********** "+ new_emp);
                await UserSchema(new_emp).save();
                sendEmail(email, "Authentification Timesheets", htmlRender(email, passdefault));
                res.send(email);
            }
        });

});

//New employee
routeExp.route("/newemployee").get(async function (req, res) {
    // session = req.session;
    // res.render("AvecBack/newemployee.html");
    res.render("newemployee.html");
    // if (session.type_util == "admin") {
    //     res.render("newemployee.html");
    // }

    // else {
    //     res.redirect("/");
    // }
});

//New employee
routeExp.route("/listeUser1").get(async function (req, res) {
    // session = req.session;
    session = req.session;
    // if (session.occupation == "admin") {
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
            res.render("AvecBack/listeUser.html", { listuser: listuser });
        });
    // }
    // else {
    //     res.redirect("/");
    // }
    // if (session.type_util == "admin") {
    //     res.render("newemployee.html");
    // }
    // else {
    //     res.redirect("/");
    // }
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
    // res.render("newCours.html");
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
    session = req.session;
    // if (session.occupation == "admin") {
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
            res.render("ListeCours.html", { listcour: listcour });
        });
    // }
    // else {
    //     res.redirect("/");
    // }
});

//Liste cours
routeExp.route("/listeUser").get(async function (req, res) {
    session = req.session;
    // if (session.occupation == "admin") {
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
            res.render("ListeUser.html", { listuser: listuser });
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
      var user = await UserSchema.findOne({_id:id });
      res.send(user.username+","+user.m_code+","+user.num_agent +","+user.type_util);
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
      //var user = await UserSchema.findOne({_id:id });
        //await TimesheetsSchema.updateMany({m_code:user.m_code},{m_code:m_code,num_agent:num_agent});
        await UserSchema.findOneAndUpdate({_id:id },{m_code:m_code,num_agent:num_agent,username:username});
        //await archiveSchema.findOneAndUpdate({m_code:m_code},{m_code:m_code,first_name:first,last_name:last});
        res.send("User updated successfully");
  })
  })
//getuser
routeExp.route("/getUser/:m_code").get(async function (req, res) {
    var m_code_update = req.params.m_code;
    mongoose
        .connect(
            "mongodb+srv://solumada-academy:academy123456@cluster0.xep87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {
                useUnifiedTopology: true,
                UseNewUrlParser: true,
            }
        )
        .then(async () => {
            var user = await UserSchema.findOne({ m_code: m_code_update });
            console.log("user " + user);
            res.render("UpdateUser.html", { user: user });
        });
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
      var cours = await CoursModel.findOne({_id:id });
      console.log("cours == ", cours);
      res.send(cours.name_Cours+","+cours.date_Commenc+","+cours.nbParticp +","+cours.professeur);
    });
  })

//Update User
routeExp.route("/updatecours").post(async function (req, res) {
    var id = req.body.id;
    var name_Cours = req.body.name_Cours;
    var date_Commenc = req.body.date_Commenc;
    var nbParticp = req.body.nbParticp;
    var professeur = req.body.professeur;
    console.log("name_Cours "+name_Cours+" "+date_Commenc+" "+nbParticp+" "+professeur);
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
            await CoursModel.findOneAndUpdate({_id:id },{ name_Cours: name_Cours, date_Commenc: date_Commenc, nbParticp: nbParticp, professeur: professeur });
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
        await CoursModel.findOneAndDelete({name_Cours:names[0]});
        res.send("Cours deleted successfully");
  })
  })

  
module.exports = routeExp;