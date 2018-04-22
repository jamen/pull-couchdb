
const fetch = require('node-fetch')
const parseJson = require('pull-json-parse')
const { parse } = require('url')
const { encode } = require('@jamen/query-string')
const { pull, once, drain, collect } = require('pull-stream')

function allDocs (database, params) {
    const opts = parse(database)

    opts.path += '/_all_docs' + encode(params)
    opts.headers = {
        Accept: 'application/json'
    }

    let rest = null

    return (end, cb) => {
        if (end) return cb(end)

        if (rest && rest.length) {
            return cb(null, rest.pop())
        } else if (rest) {
            return cb(true)
        }

        fetch(database + '/_all_docs' + encode(params), {
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            rest = data.rows
            cb(null, rest.pop())
        }).catch(err => {
            cb(err)
        })
    }
}

function saveEach (database) {
    const opts = parse(database)

    opts.method = 'POST'
    opts.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }

    return function (read) {
        return function (end, cb) { 
            read(end, (end, data) => {
                if (end) return cb(end)

                fetch(database, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => {
                    return response.json()
                }).then(result => {
                    cb(null, result)
                }).catch(err => {
                    cb(err)
                })
            })
        }
    } 
}

module.exports = {
    allDocs,
    saveEach
}
