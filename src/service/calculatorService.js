import http from "./http";

const apiEndPoint = "/api/calculations";

export const getCalculations = (offset, limit) => {
  return http.get(`${apiEndPoint}?offset=${offset}&&limit=${limit}`);
};

export const createCalculation = (item) => {
  const formData = new FormData();

  formData.append("title", item.title);
  if (item.file) formData.append("file", item.file);

  return http.post(apiEndPoint, formData);
};
