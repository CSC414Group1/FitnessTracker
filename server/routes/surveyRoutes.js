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
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });

    res.send(surveys);
  });

  app.post('/surveyPost', async (req, res) => {
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

    res.send({});
  });

  app.post('/api/surveys', requireLogin, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

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
