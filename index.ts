import "dotenv/config";
import server from "./src/app";

export default server(Number(process.env.API_PORT));
