import * as path from 'path'
import * as fs from 'fs'

import * as Handlebars from 'handlebars'
import * as juice from 'juice'
import * as nodemailer from 'nodemailer'

import { IConfig, IEmail, IEmails } from './Types'

const forEachFileInFolder = function(folder, fn){
    let files = fs.readdirSync(path.resolve(folder))
    files
        .filter(file => file.indexOf('.js.map') !== 0)
        .filter(file => file.indexOf('.') > 0)
        .forEach(file => {
            return fn(folder, file)
        })
}


export class Emailer {

    config: IConfig
    emails: IEmails
    mailer: nodemailer.Transporter

    constructor(config: IConfig){
        this.config = config

        this.mailer = nodemailer.createTransport(this.config.transport);

        this._prepareEmails(config.emailsDirectory)
        this._attachPartialsToHandlebars()
        this.cacheEmails()
    }

    _prepareEmails(folder: string){
        let emails = {}
        forEachFileInFolder(folder, (dir, file) => {
            let fileArray = file.split('.')
            fileArray.pop()
            emails[fileArray.join('.')] = require(path.resolve(path.join(dir, file)))
        })
        this.emails = emails
    }

    _attachPartialsToHandlebars(){
        let {output, partials} = this.config
        let blocks = Object.create(null)

        Handlebars.registerHelper('Compile', function(html, context) {
            return new Handlebars.SafeString(Handlebars.compile(html.toString())(context))
        });

        forEachFileInFolder(`${output}/${partials}`, function(folder, file){
            let html = fs.readFileSync(path.resolve(`${folder}/${file}`))
            Handlebars.registerPartial(file.split('.')[0], html.toString());
        })
    }

    _joinCss(){
        let finalCss = ''
        this.config.css.forEach((file) => {
            finalCss = finalCss + fs.readFileSync(path.resolve(file))
        })

        return finalCss
    }

    _compileTemplate(template: string, data?: Object): string{
        data = (data) ? data : {}

        let {output, templates, partials} = this.config
        let htmlBody = fs.readFileSync(path.resolve(`${output}/${templates}/${template}.html`))
        let htmlBase = fs.readFileSync(path.resolve(`${output}/${partials}/base.html`))

        data['__body__'] = new Handlebars.SafeString(Handlebars.compile(htmlBody.toString())(data))

        return Handlebars.compile(htmlBase.toString())(data)
    }

    cacheEmails(){
        let finalCss = this._joinCss()
        let {input, output, partials, templates} = this.config

        Array(partials, templates)
            .forEach((tmp) => {
                forEachFileInFolder(`${input}/${tmp}`, (folder, file) => {
                    let html = fs.readFileSync(path.resolve(`${input}/${tmp}/${file}`))
                    let newHtml = juice.inlineContent(html.toString(), finalCss)
                    fs.writeFileSync(path.resolve(`${output}/${tmp}/${file}`), newHtml, {encoding: 'utf8'})
                })
            })

    }

    renderEmail(emailCfg: IEmail, data?: Object): { html: string, subject: string } {
        data = Object.assign({}, emailCfg.dummyData, data)
        data = (emailCfg.composeData) ? emailCfg.composeData(data) : data

        return {
            html: this._compileTemplate(emailCfg.template, data),
            subject: Handlebars.compile(emailCfg.title)(data)
        }
    }

    getconfig(emailKey: string): Promise<IEmail> {
        return new Promise((resolve, reject) => {
            if (!this.emails[emailKey]) {
                reject(`Any email found with this key ${emailKey}`)
            }

            resolve(this.emails[emailKey])
        })
    }

    renderTemplate(emailKey: string, data?: Object): Promise<{ html: string, subject:string }> {
        return this.getconfig(emailKey)
            .then(cfg => this.renderEmail(cfg, data))
    }

    renderAndSend(to, emailKey, data?: Object): Promise<nodemailer.SentMessageInfo> {

        return this.getconfig(emailKey)
            .then(cfg => this.renderEmail(cfg, data))
            .then(( {subject, html } ) => this.sendEmail({
                from: 'postmaster',
                to:  (this.config.overrideEmail ) ? this.config.overrideEmail : to,
                subject,
                html
            }))
    }

    sendEmail(data: { from: string, to: string, subject: string, html: string }): Promise<nodemailer.SentMessageInfo> {
        return new Promise((resolve, reject) => this.mailer.sendMail(data, (err, info) => {
                if (err){ reject(err) }
                resolve(info)
            })
        )
    }
}

export const emailer = (config: IConfig) => new Emailer(config)