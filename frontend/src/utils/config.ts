interface ConfigType {
  baseUrl: string;
}

const config: ConfigType = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ? `https://${import.meta.env.VITE_API_BASE_URL}/api/v1` : "",
};

export default config;
