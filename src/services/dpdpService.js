import api from "./api";
export const getLatestPrivacyNotice = () => {
    return api.get("/api/dpdp/privacy-notice");
};
