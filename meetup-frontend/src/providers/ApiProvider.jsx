import axios from "axios";
import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { useCookies } from "react-cookie";
import { ApiContext } from "../context/ApiContext";

const ApiProvider = ({ children }) => {
  const [cookies] = useCookies(["user-data"]);

  const axiosConfig = useMemo(
    () => ({
      baseURL: "http://127.0.0.1:8090/api/collections",
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${cookies["user-data"]?.token || ""}`,
        "Content-Type": "multipart/form-data",
      },
    }),
    [cookies]
  );

  const getListOfEntities = async (config) => {
    let requestString = `/entity/records`;

    const {
      expand = [],
      fields = [],
      page = -1,
      perPage = -1,
      sort = [],
      filter = [],
      filterSeparator = "AND",
      skipTotal = -1,
    } = config;

    let additions = [];

    if (page > 0) {
      additions.push(`page=${page}`);
    }

    if (perPage > 0) {
      additions.push(`perPage=${perPage}`);
    }

    if (skipTotal > 0) {
      additions.push(`skipTotal=${skipTotal}`);
    }

    if (!isEmpty(filter)) {
      additions.push(
        `filter=(${filter.join(filterSeparator === "AND" ? " %26%26 " : " %7C%7C ")})`
      );
    }

    if (!isEmpty(sort)) {
      additions.push(`sort=${sort.join(",")}`);
    }

    if (!isEmpty(expand)) {
      additions.push(`expand=${expand.join(",")}`);
    }

    if (!isEmpty(fields)) {
      additions.push(`fields=${fields.join(",")}`);
    }

    if (!isEmpty(additions)) {
      requestString = requestString.concat("?", additions.join("&"));
    }
    const response = await axios.get(requestString, axiosConfig);
    return response ?? [];
  };

  const getListOfActors = async (config) => {
    let requestString = `/actors/records`;

    const {
      expand = [],
      fields = [],
      page = -1,
      perPage = -1,
      sort = [],
      filter = [],
      filterSeparator = "AND",
      skipTotal = -1,
    } = config;

    let additions = [];

    if (page > 0) {
      additions.push(`page=${page}`);
    }

    if (perPage > 0) {
      additions.push(`perPage=${perPage}`);
    }

    if (skipTotal > 0) {
      additions.push(`skipTotal=${skipTotal}`);
    }

    if (!isEmpty(filter)) {
      additions.push(
        `filter=(${filter.join(filterSeparator === "AND" ? " %26%26 " : " %7C%7C ")})`
      );
    }

    if (!isEmpty(sort)) {
      additions.push(`sort=${sort.join(",")}`);
    }

    if (!isEmpty(expand)) {
      additions.push(`expand=${expand.join(",")}`);
    }

    if (!isEmpty(fields)) {
      additions.push(`fields=${fields.join(",")}`);
    }

    if (!isEmpty(additions)) {
      requestString = requestString.concat("?", additions.join("&"));
    }

    const response = await axios.get(requestString, axiosConfig);
    return response ?? [];
  };

  const getEntityById = async (entity_id, config) => {
    let requestString = `/entity/records/${entity_id}`;

    const { expand = [], fields = [] } = config;

    let additions = [];

    if (!isEmpty(expand)) {
      additions.push(`expand=${expand.join(",")}`);
    }

    if (!isEmpty(fields)) {
      additions.push(`fields=${fields.join(",")}`);
    }

    if (!isEmpty(additions)) {
      requestString = requestString.concat("?", additions.join("&"));
    }

    const { data } = await axios.get(requestString, axiosConfig);
    return data;
  };

  const getActorById = async (actor_id, config) => {
    let requestString = `/actors/records/${actor_id}`;

    const { expand = [], fields = [] } = config;

    let additions = [];

    if (!isEmpty(expand)) {
      additions.push(`expand=${expand.join(",")}`);
    }

    if (!isEmpty(fields)) {
      additions.push(`fields=${fields.join(",")}`);
    }

    if (!isEmpty(additions)) {
      requestString = requestString.concat("?", additions.join("&"));
    }

    const { data } = await axios.get(requestString, axiosConfig);
    return data;
  };

  const createEntity = async (requestData = {}, files = []) => {
    let requestString = `/entity/records`;

    const formData = new FormData();

    for (const field in requestData) {
      if (field === "params") {
        formData.append(field, JSON.stringify(requestData[field]));
        continue;
      }

      formData.append(field, requestData[field]);
    }

    if (files) {
      for (const file in files) {
        formData.append("file[]", file);
      }
    }

    const response = await axios.post(requestString, formData, axiosConfig);
    return response;
  };

  const updateEntity = async (entity_id, updateData = {}, files = []) => {
    let requestString = `/entity/records/${entity_id}`;

    const formData = new FormData();

    for (const field in updateData) {
      if (field === "params") {
        formData.append(field, JSON.stringify(updateData[field]));
        continue;
      }

      formData.append(field, updateData[field]);
    }

    if (files) {
      for (const file in files) {
        formData.append("file[]", file);
      }
    }

    const { data } = await axios.patch(requestString, formData, axiosConfig);
    return data;
  };

  const entityDelete = async (entity_id) => {
    let requestString = `/entity/records/${entity_id}`;
    const { data } = await axios.delete(requestString, axiosConfig);
    return data;
  };

  const contextData = {
    getListOfEntities,
    updateEntity,
    entityDelete,
    getEntityById,
    createEntity,
    getListOfActors,
    getActorById,
  };

  return (
    <ApiContext.Provider value={contextData}>{children}</ApiContext.Provider>
  );
};

export default ApiProvider;
