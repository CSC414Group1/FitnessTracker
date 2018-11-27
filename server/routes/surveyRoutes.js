const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../requireLogin');
const Mailer = require('../Mailer');
const surveyTemplate = require('./surveyTemplate');

const Survey = mongoose.model('surveys');
const FitnessInfo = mongoose.model('fitness');

module.exports = app => {
  //params = route, middleware, callback funct
  app.get('/api/surveys', requireLogin, async (req, res) => {
    //get all surveys for the specific user logged in
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });

    res.send(surveys);
  });

  app.post('/surveyPost', async (req, res) => {
    //get all info from survey and save to the database
    const { email, name, weeklyExercise, eatFastFood, bmi } = req.body;
    const fitnessInfo = new FitnessInfo({
        email,
        name,
        weeklyExercise,
        eatFastFood,
        bmi
    })
    await fitnessInfo.save();
    res.send(fitnessInfo);
    
  })


  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    //once click the link redirect to survey page
    res.redirect('/fitnessSurvey');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();
      //the above is like SQL statement, the .exec() is what makes it actually happen
    res.send({});
  });

  app.post('/api/surveys', requireLogin, async (req, res) => {
    //get info from input page
    const { title, subject, body, recipients } = req.body;
    //create new survey and save to database
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    //send out survey using the sendgrid mailer
    const mailer = new Mailer(survey, surveyTemplate(survey));
    
    try {
      await mailer.send();
      await survey.save();
      res.send(req.user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
