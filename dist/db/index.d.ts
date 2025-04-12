import MongoConnection from "./mongodb/connection.js";
declare const Database: {
    readonly MongoConnection: typeof MongoConnection;
};
export default Database;
