/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_297804198")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_960182566",
    "hidden": false,
    "id": "relation1094420398",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent_entity",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_297804198")

  // remove field
  collection.fields.removeById("relation1094420398")

  return app.save(collection)
})
