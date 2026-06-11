import api from "./api";

// LIST
export const getDiagnosticCenters = (
  page,
  size,
  search
) => {

  return api.get("/dc", {
    params: {
      page,
      size,
      search
    }
  });
};

// CREATE
export const createDiagnosticCenter = (
  payload
) => {

  return api.post(
    "/dc",
    payload
  );
};

// GET BY ID
export const getDiagnosticCenterById = (
  id
) => {

  return api.get(`/dc/${id}`);
};

// UPDATE
export const updateDiagnosticCenter = (
  id,
  payload
) => {

  return api.put(
    `/dc/${id}`,
    payload
  );
};

export const deleteDiagnosticCenter = (
  id
) => {

  return api.delete(
    `/dc/${id}`
  );
};