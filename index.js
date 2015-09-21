var metalsmith = require('metalsmith')
    collections = require('metalsmith-collections'),
    templates = require('metalsmith-templates'),
    markdown = require('metalsmith-markdown')
    permalinks = require('metalsmith-collections-permalinks');

function dates(format) {
    var moment = require('moment');
    format = format || 'MMM Do, YYYY';
    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (file) {
            files[file].date = moment(files[file].date).format(format);
        })
        done();
    }
}

metalsmith(__dirname)
    .use(dates())
    .use(collections({
        posts: { pattern: 'contents/posts/*.md', sortBy: 'date', reverse: true },
        pages: { pattern: 'contents/pages/*.md' },
    }))
    .use(markdown())
    .use(permalinks({
        pages: { pattern: ':title'},
        posts: { pattern: 'posts/:title'},
    }))
    .use(templates({
        engine: 'handlebars',
        directory: 'templates',
        partials: {
            header: 'partials/header',
            footer: 'partials/footer'
        }
    }))
    .build(function (err) {
        if (err) console.log(err);
    })
