const accounts_www = process.env.ACCOUNTS_WWW || 'http://hey.local'

export default {
    title: 'Test: Recovery',
    template: 'password.recovery',
    data: ['recoveryToken'],
    dummyData: {
        recoveryToken: '0000-0000-000000'
    },
    composeData: function(input) {
        input = input ? input : {}
        input['linkToFrontend'] = `${accounts_www}/#/verify/password/${
            input.recoveryToken
        }`
        return input
    }
}
