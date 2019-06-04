const accounts_www = process.env.ACCOUNTS_WWW || 'http://hey.local'

export default {
    title: 'Test: Verify email',
    template: 'password.recovery',
    data: ['verifyToken'],
    dummyData: {
        verifyToken: '0000-0000-000000'
    },
    composeData: function(input) {
        input = input ? input : {}
        input['linkToFrontend'] = `${accounts_www}/#/verify/email/${
            input.verifyToken
        }`
        return input
    }
}
