# emailer-hbs

## What is this?

`emailer-hbs` is a super hero that helps you to have the full control of your emails in your API. Its powered by:
- HandlebarsJS
- Juice
- Nodemailer
- Typescript

## Configuration for the Mailer

The configuration is very easy:

```
{
    overrideEmail: string|null
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
- css: Array of css paths you want to use in the emails
- input: Where are your templates
- output: Where you want to compile that templates
- templates: Where inside the input are the templates
- partials: Where inside the input are the partials
- transport: Nodemailer Transport with your config ready
- emailsDirectory: Path of your email configuration

## Emails configuration

An example of an email configration:

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
