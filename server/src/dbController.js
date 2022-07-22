// import fs from "fs";
// import { resolve } from "path";

import { LowSync, JSONFileSync } from "lowdb";
const adapther = new JSONFileSync("/src/db.json");
const db = new LowSync(adapther);

export default db;
