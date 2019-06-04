"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Handlebars = require("handlebars");
const juice = require("juice");
const nodemailer = require("nodemailer");
const path = require("path");
const forEachFileInFolder = function (folder, fn) {
    let files = fs.readdirSync(path.resolve(folder));
    files
        .filter(file => file.indexOf('.js.map') !== 0)
        .filter(file => file.indexOf('.') > 0)
        .forEach(file => {
        return fn(folder, file);
    });
};
class Emailer {
    constructor(config) {
        this.config = config;
        this.mailer = nodemailer.createTransport(this.config.transport);
        this._prepareEmails(config.emailsDirectory);
        this._attachPartialsToHandlebars();
        this.cacheEmails();
    }
    _prepareEmails(folder) {
        let emails = {};
        forEachFileInFolder(folder, (dir, file) => {
            let fileWithoutExt = file
                .split('.')
                .reverse()
                .slice(1)
                .reverse()
                .join('.');
            let data = require(path.resolve(path.join(dir, file)));
            emails[fileWithoutExt] = data.default ? data.default : data;
        });
        this.emails = emails;
    }
    _attachPartialsToHandlebars() {
        let { output, partials } = this.config;
        let blocks = Object.create(null);
        Handlebars.registerHelper('Compile', function (html, context) {
            return new Handlebars.SafeString(Handlebars.compile(html.toString())(context));
        });
        forEachFileInFolder(`${output}/${partials}`, function (folder, file) {
            let html = fs.readFileSync(path.resolve(`${folder}/${file}`));
            let fileWithoutExt = file
                .split('.')
                .reverse()
                .slice(1)
                .reverse()
                .join('.');
            Handlebars.registerPartial(fileWithoutExt, html.toString());
        });
    }
    _joinCss() {
        let finalCss = '';
        this.config.css.forEach(file => {
            finalCss = finalCss + fs.readFileSync(path.resolve(file));
        });
        return finalCss;
    }
    _compileTemplate(template, data) {
        data = data ? data : {};
        let { output, templates, partials } = this.config;
        let htmlBody = fs.readFileSync(path.resolve(`${output}/${templates}/${template}.html`));
        let htmlBase = fs.readFileSync(path.resolve(`${output}/${partials}/base.html`));
        data['__body__'] = new Handlebars.SafeString(Handlebars.compile(htmlBody.toString())(data));
        return Handlebars.compile(htmlBase.toString())(data);
    }
    cacheEmails() {
        let finalCss = this._joinCss();
        let { input, output, partials, templates } = this.config;
        Array(partials, templates).forEach(tmp => {
            forEachFileInFolder(`${input}/${tmp}`, (folder, file) => {
                let html = fs.readFileSync(path.resolve(`${input}/${tmp}/${file}`));
                let newHtml = juice.inlineContent(html.toString(), finalCss);
                fs.writeFileSync(path.resolve(`${output}/${tmp}/${file}`), newHtml, {
                    encoding: 'utf8'
                });
            });
        });
    }
    renderEmail(emailCfg, data) {
        data = Object.assign({}, emailCfg.dummyData, data);
        data = emailCfg.composeData ? emailCfg.composeData(data) : data;
        return {
            html: this._compileTemplate(emailCfg.template, data),
            subject: Handlebars.compile(emailCfg.title)(data)
        };
    }
    getconfig(emailKey) {
        return new Promise((resolve, reject) => {
            if (!this.emails[emailKey]) {
                reject(`Any email found with this key ${emailKey}`);
            }
            resolve(this.emails[emailKey]);
        });
    }
    renderTemplate(emailKey, data) {
        return this.getconfig(emailKey).then(cfg => this.renderEmail(cfg, data));
    }
    renderAndSend(to, emailKey, data, from) {
        return this.getconfig(emailKey)
            .then(cfg => this.renderEmail(cfg, data))
            .then(({ subject, html }) => this.sendEmail({
            from: from
                ? from
                : this.config.from
                    ? this.config.from
                    : 'postmaster',
            to: this.config.overrideEmail
                ? this.config.overrideEmail
                : to,
            subject,
            html
        }));
    }
    sendEmail(data) {
        return new Promise((resolve, reject) => this.mailer.sendMail(data, (err, info) => {
            if (err) {
                reject(err);
            }
            resolve(info);
        }));
    }
}
exports.Emailer = Emailer;
exports.emailer = (config) => new Emailer(config);
//# sourceMappingURL=Mailer.js.map