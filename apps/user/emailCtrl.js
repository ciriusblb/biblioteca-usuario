'use strict';
var nodemailer = require('nodemailer');
var recoverPassword = require('./model').recoverPassword;

var sendEmail = function(data, callback){
  console.log(data);
  var codigo = Math.round(Math.random()*100000);
  var codigo = codigo.toString();

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ciriusblb@gmail.com',
        pass: 'El5-mejo'
    }
  });

  var mailOptions={};
  if(data.password){
    console.log("email y codigo ",data.password);

    recoverPassword(data,function(error,result){
      console.log(result);
        mailOptions = {
          from: 'Remitente',
          to: data.email,
          subject: 'Asunto',
          text: 'contraseña de pase '+result.contrasena
        };
        console.log("enviando",mailOptions);

        transporter.sendMail(mailOptions, function(error, info){
          if (error){
            console.log("error");
              callback(null,undefined);
          } else {
              callback(null,mailOptions);
          }
        });
    });
  }else{
      mailOptions = {
        from: 'Remitente',
        to: data.email,
        subject: 'Asunto',
        text: 'código de validación '+codigo
      };
        console.log("enviando",mailOptions);



    transporter.sendMail(mailOptions, function(error, info){
      if (error){
        console.log("error");
          callback(null,undefined);
      } else {
          callback(null,mailOptions);
      }
    });
  }
};

module.exports=sendEmail;