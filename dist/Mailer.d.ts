import * as nodemailer from 'nodemailer';
import { IConfig, IEmail, IEmails } from './Types';
export declare class Emailer {
    config: IConfig;
    emails: IEmails;
    mailer: any;
    constructor(config: IConfig);
    _prepareEmails(folder: string): void;
    _attachPartialsToHandlebars(): void;
    _joinCss(): string;
    _compileTemplate(template: string, data?: Object): string;
    cacheEmails(): void;
    renderEmail(emailCfg: IEmail, data?: Object): {
        html: string;
        subject: string;
    };
    getconfig(emailKey: string): Promise<IEmail>;
    renderTemplate(emailKey: string, data?: Object): Promise<{
        html: string;
        subject: string;
    }>;
    renderAndSend(to: any, emailKey: any, data?: Object, from?: string): Promise<nodemailer.SentMessageInfo>;
    sendEmail(data: {
        from: string;
        to: string;
        subject: string;
        html: string;
    }): Promise<nodemailer.SentMessageInfo>;
}
export declare const emailer: (config: IConfig) => Emailer;
