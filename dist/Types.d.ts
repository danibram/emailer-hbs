export interface IConfig {
    overrideEmail: string | null;
    from: string | null;
    css: string[];
    input: string;
    output: string;
    templates: string;
    partials: string;
    transport: any;
    emailsDirectory: string;
}
export interface IEmails {
    [name: string]: IEmail;
}
export interface IEmail {
    title: string;
    template: string;
    data: string[];
    dummyData: {};
    composeData(input: Object): Object;
}
