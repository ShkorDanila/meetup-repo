/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "  @request.auth.tokenKey != null",
    "deleteRule": "  @request.auth.tokenKey != null",
    "updateRule": "  @request.auth.tokenKey != null",
    "viewRule": "  @request.auth.tokenKey != null"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
