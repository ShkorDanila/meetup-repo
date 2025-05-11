/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_960182566")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.tokenKey != null",
    "deleteRule": "@request.auth.tokenKey != null",
    "listRule": "@request.auth.tokenKey != null",
    "updateRule": "@request.auth.tokenKey != null",
    "viewRule": "@request.auth.tokenKey != null"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_960182566")

  // update collection data
  unmarshal({
    "createRule": "  @request.auth.tokenKey != null",
    "deleteRule": "  @request.auth.tokenKey != null",
    "listRule": "  @request.auth.tokenKey != null",
    "updateRule": "  @request.auth.tokenKey != null",
    "viewRule": "  @request.auth.tokenKey != null"
  }, collection)

  return app.save(collection)
})
