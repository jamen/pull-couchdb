
# pull-couchdb

Pull-streams for reading and writing in CouchDB.

## Install

```sh
npm i pull-couchdb
```

## Usage

### `allDocs(db)`

Requests CouchDB's [`GET /{db}/_all_docs`][1] and streams the results.

```js
pull(
    allDocs('http://localhost:5984/foo_storage'),
    drain(record => {
        // ...
    })
)
```

### `saveEach(db, params)`

Saves each object to CouchDB using [`POST /{db}`][2].

```js
pull(
    values([
        { test: 'Hello world' }
        { test: 'foo' },
        { test: 'bar' }
    ]),
    saveEach('http://localhost:5984/foo_storage'),
    collect((err, results) => {
        // ...
    })
)
```

[1]: http://docs.couchdb.org/en/2.1.1/api/database/bulk-api.html#api-db-all-docs
[2]: http://docs.couchdb.org/en/2.1.1/api/database/common.html#post--db