const keys = require('../config/keys');

module.exports = survey => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/yes">Click link to go to fitness survey</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
