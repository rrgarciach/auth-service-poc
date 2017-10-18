const crypto = require('crypto');

const model = {
    _id: 'foo123',
    username: 'foo',
    password: '97k1aJom1I+DE5rkqw2p5EUOkOEW8en/sXKLezyY7+b3NpyFnnIYvmPf7gvYshxX0sA7hC9JMWoCyNVIIcsO8A==',
    role: {
        name: 'John Doe',
    },
    salt: 'asdf1234',

    authenticate: function (password, callback) {
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }

        this.encryptPassword(password, (err, pwdGen) => {
            if (err) {
                callback(err);
            }

            if (this.password === pwdGen) {
                callback(null, true);
            }
            else {
                callback(null, false);
            }
        });
    },

    encryptPassword: function (password, callback) {
        if (!password || !this.salt) {
            if (!callback) {
                return null;
            }
            return callback(null);
        }

        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = new Buffer(this.salt, 'base64');

        if (!callback) {
            return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
                .toString('base64');
        }

        return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength,
            function (err, key) {
                if (err) {
                    callback(err);
                }
                return callback(null, key.toString('base64'));
            });
    }

};

module.exports = model;