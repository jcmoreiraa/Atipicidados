const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://capable-determination-production.up.railway.app/";
const apiUrlLocal = process.env.NEXT_PUBLIC_API_URL_LOCAL || "http://localhost:3002";

// console.log(process.env.NODE_ENV)
// export const API_BASE_URL = process.env.NODE_ENV === "development" ? apiUrlLocal : apiUrl;

console.log(process.env.NODE_ENV);
export const API_BASE_URL = apiUrl;
