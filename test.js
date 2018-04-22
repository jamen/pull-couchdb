
const test = require('tape')
const { pull, values, collect } = require('pull-stream')
const { saveEach, allDocs } = require('./lib/pull-couchdb.js')

test('save each', async (t) => {
    t.plan(1)

    pull(
        values([
            { test: 'foo bar' },
            { test: 'Hello world!'  },
            { test: 'baz qux' }
        ]),
        saveEach('http://root:root@localhost:5984/pull-stream-test'),
        collect((err, results) => {
            t.true(results.length >= 3, 'saved')
            console.log(results)
        })
    )
})

test('all docs', t => {
    t.plan(1)

    pull(
        allDocs('http://root:root@localhost:5984/pull-stream-test'),
        collect((err, results) => {
            t.true(results.length, 'retreived')
            console.log(results)
        })
    )
})
