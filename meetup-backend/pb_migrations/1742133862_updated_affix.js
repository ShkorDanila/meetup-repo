/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_297804198")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json2412646131",
    "maxSize": 0,
    "name": "params",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "file104153177",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "files",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_297804198")

  // remove field
  collection.fields.removeById("json2412646131")

  // remove field
  collection.fields.removeById("file104153177")

  return app.save(collection)
})
