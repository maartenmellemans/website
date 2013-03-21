var moment = require('moment');

var MailChimpAPI = require('mailchimp').MailChimpAPI;
var MailChimpKey = 'fdf16e2254708223f51094da03640c93-us6';

var MandrillAPI = require('mailchimp').MandrillAPI;
var MandrillKey = 'dYLTRr1vtDoY_j6xGpnOjw';

try { 
    var mailchimp = new MailChimpAPI(MailChimpKey, { version : '1.3', secure : false });
    var mandrill = new MandrillAPI(MandrillKey, { version : '1.0', secure: false });
} catch (error) {
    console.log(error.message);
}

console.log('Email Configured');



// connect to database
module.exports = {

  subscribeEmail: function(emailInit) {
    email = encodeURIComponent(emailInit);
    mailchimp.listSubscribe( {
            'id': 'f6d84705e2',
            'email_address': email,
            'double_optin': false
          }, function(error,data) {
            if(error == null) {
              console.log("succes mailchimp add");
            } else {
              console.log('hier');
              console.log(error);
            }
          });
  },

  sendMandrillSignup: function(username,email) {
    mandrill.messages_send_template( {
            'template_name': 'signupwelcome',
            'template_content': [{'name':'username', 'content':username}],
            'message': {
              'subject':'Welcome to OneSentenceJournal.com',
              'from_email':'hello@onesentencejournal.com',
              'from_name':'OneSentenceJournal.com',
              'to': [{
                "email": email,
                "name": username
              }],
              'track_opens':true,
              'track_clicks': true,
              "merge_vars": [
                  {
                      "rcpt": email,
                      "vars": [
                          {
                              "name": "username",
                              "content": username
                          }
                      ]
                  }
              ]
            }
          }, function(error,data) {
            if(error == null) {
              console.log("succes mandrill send");
            } else {
              console.log(error);
            }
          });
  },

  //AANPASSEN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  sendMandrillResetPassword: function(username,email,resetKey) {
    console.log("resetkey: " + resetKey)
    mandrill.messages_send_template( {
            'template_name': 'passwordreset',
            'template_content': [
                          {
                              "name": "username",
                              "content": username
                          },
                          {
                              "name": "resetkey",
                              "content": resetKey
                          }],
            'message': {
              'subject':'Reset your password',
              'from_email':'hello@onesentencejournal.com',
              'from_name':'OneSentenceJournal.com',
              'to': [{
                "email": email,
                "name": username
              }],
              "merge_vars": [
                  {
                      "rcpt": email,
                      "vars": [
                          {
                              "name": "username",
                              "content": username
                          },
                          {
                              "name": "resetkey",
                              "content": resetKey
                          }
                      ]
                  }
              ],
              'track_clicks': false
            }
          }, function(error,data) {
            if(error == null) {
              console.log("succes mandrill send");
              console.log(data);
            } else {
              console.log(error);
            }
          });
  },

  sendMandrillGetStarted: function(username,email) {
    mandrill.messages_send_template( {
            'template_name': 'getstarted',
            'template_content': [{'name':'username', 'content':username}],
            'message': {
              'subject':'Get started!',
              'from_email':'hello@onesentencejournal.com',
              'from_name':'OneSentenceJournal.com',
              'to': [{
                "email": email,
                "name": username
              }],
              'track_opens':true,
              'track_clicks': true,
              "merge_vars": [
                  {
                      "rcpt": email,
                      "vars": [
                          {
                              "name": "username",
                              "content": username
                          }
                      ]
                  }
              ]
            }
          }, function(error,data) {
            if(error == null) {
              console.log("succes mandrill send");
            } else {
              console.log(error);
            }
          });
  },

  sendMandrillGetStarted: function(username,email) {
    mandrill.messages_send_template( {
            'template_name': 'getstarted',
            'template_content': [{'name':'username', 'content':username}],
            'message': {
              'subject':'Get started!',
              'from_email':'hello@onesentencejournal.com',
              'from_name':'OneSentenceJournal.com',
              'to': [{
                "email": email,
                "name": username
              }],
              'track_opens':true,
              'track_clicks': true,
              "merge_vars": [
                  {
                      "rcpt": email,
                      "vars": [
                          {
                              "name": "username",
                              "content": username
                          }
                      ]
                  }
              ]
            }
          }, function(error,data) {
            if(error == null) {
              console.log("succes mandrill send");
            } else {
              console.log(error);
            }
          });
  }
}