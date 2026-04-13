import { useState, useEffect } from "react";
import { getCountries, getStates, getCities } from "../services/locationService";

export const useLocation = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(false);

  // 🔹 Load countries
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await getCountries();

      // ✅ SAFE CHECK
      setCountries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading countries");
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async (countryCode) => {
    try {
      setLoading(true);
      const data = await getStates(countryCode);

      console.log("States API 👉", data); // 🔥 DEBUG

      // ✅ SAFE CHECK
      setStates(Array.isArray(data) ? data : []);
      setCities([]);
    } catch (err) {
      console.error("Error loading states");
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async (countryCode, stateCode) => {
    try {
      setLoading(true);
      const data = await getCities(countryCode, stateCode);

      console.log("Cities API 👉", data); // 🔥 DEBUG

      // ✅ SAFE CHECK
      setCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading cities");
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    countries,
    states,
    cities,
    loadStates,
    loadCities,
    loading,
  };
};