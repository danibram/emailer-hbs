import emailer from '../src'

const mailer = emailer({
    overrideEmail: null,
    css: [
        `${__dirname}/templates/src/css/ink-emails.css`,
        `${__dirname}/templates/src/css/style.css`
    ],
    input: `${__dirname}/templates/src`,
    output: `${__dirname}/templates/cache`,
    templates: 'templates',
    partials: 'partials',
    transport: {},
    emailsDirectory: `${__dirname}/emails`
})

mailer.cacheEmails()
