# emailer-hbs

## What is this?

`emailer-hbs` is a super hero that helps you to have the full control of your emails in your API. Its powered by:
- HandlebarsJS
- Juice
- Nodemailer
- Typescript

It takes an array of configuration and a folder with header footer or more partials and that template, it inlines css with juice, and compose the final email.

## Configuration for the Mailer

The configuration is very easy:

```
{
    overrideEmail: string|null,
    from: string|null,
    css: string[]
    input: string
    output: string
    templates: string
    partials: string
    transport: any,
    emailsDirectory: string
}
```

That is the explanation:

- overrideEmail: If this string exists, it override the email you pass by the email you want, easy for devs to test it
- from: general from, can be override if you, send from parameter to renderAndSend
- css: Array of css paths you want to use in the emails
- input: Where are your templates
- output: Where you want to compile that templates
- templates: Where inside the input are the templates
- partials: Where inside the input are the partials
- transport: Nodemailer Transport with your config ready
- emailsDirectory: Path of your emails configuration

## Emails configuration

An example of an email configuration:

```
{
    title: string
    template: string
    body: string
    data: string[]
    dummyData: {}
    composeData(input: Object): Object
}
```

That is the explanation:
- title: Title of your email
- template: Name of the template, inside your template folder
- data: Array of the key you need to pass as config
- dummyData: Dummy data for the emails, to test it
- composeData: Function to parse the input data

## How to use it

```npm install emailer-hbs```

```
import { Emailer } from 'emailer-hbs'

import config from '../config'

if (config.env !== 'development' && config.mailer.overrideEmail) {
    config.mailer.overrideEmail = null
}

export default new Emailer(config.mailer)
```

OR

```
import Mailer from 'emailer-hbs'
import config from '../config'

if (config.env !== 'development' && config.mailer.overrideEmail) {
    config.mailer.overrideEmail = null
}

let mailer = Mailer(config.mailer)
```

## Folders

This is han example, of the folders i use, in src you have the templates and the common parts, of the emails, then when you cache the emails goes to cache folder, partials are like swig partials but for use in handlebars really easy, end the css with the juice power tranform the css in inline css.

```
templates
├── cache
│   ├── partials
│   │   ├── base.html
│   │   └── footer.html
│   └── templates
│       ├── access.html
│       └── welcome.html
└── src
    ├── css
    │   ├── ink-emails.css
    │   ├── ink.css
    │   └── style.css
    ├── partials
    │   ├── base.html
    │   └── footer.html
    └── templates
        ├── access.html
        └── welcome.html
```

```
// Input
// base.html
<head>
</head>
<body>
    {{ Compile __body__ }}
</body>
</html>

// footer.html
<footer>emailer-hbs 2017</footer>

// welcome.html
<h1>Hi</h1>
{{> footer}}
```

```
// Output
// welcome.html
<head>
</head>
<body>
    <h1>Hi</h1>
    <footer>emailer-hbs 2017</footer>
</body>
</html>
```

## Methods

When you initialize the mailer then you can call this methods:

- renderEmail (internal): render html with handlebars
- sendEmail (internal): send an email
- cacheEmails: cache emails, put css inline with juice and generate the final email
- getconfig: get the config for that template
- renderTemplate: render template
- renderAndSend: render the template and send


## Changelog

- **1.0.9**: Now support for names with dots
- ***21/11/2017*** 1.0.8: added support for export default in configurations
- ***08/09/2017***: added global from (changes on RenderAndSend)
- ***02/12/2017***: initial release
