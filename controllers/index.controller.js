

module.exports = class {
    static get(req, res, next) {
        res.data({
            name: 'Livinus Igbaji Oga-ifu',
            github: '@bestbrain10',
            email: 'livinus619@live.com',
            mobile: '07038761251',
            twitter: '@bigmaven'
        }, 'My Rule-Validation API');
    }
};
