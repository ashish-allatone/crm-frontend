const API_KEY = "ef8108902a73d6bda8ad481914caba8253530c599a6bde7d9a0bbcf4c8ac19c8";

const headers = {
  "X-CSCAPI-KEY": API_KEY,
};

// ✅ Get Countries
export const getCountries = async () => {
  const res = await fetch(
    "https://api.countrystatecity.in/v1/countries",
    { headers }
  );
  return res.json();
};

// ✅ Get States
export const getStates = async (countryCode) => {
  const res = await fetch(
    `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
    { headers }
  );
  return res.json();
};

// ✅ Get Cities
export const getCities = async (countryCode, stateCode) => {
  const res = await fetch(
    `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
    { headers }
  );
  return res.json();
};