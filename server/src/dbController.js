// 원래 nodejs는 es6 모듈 문법을 사용할 수 없음. package.json을 설정해주어야 함
// const fs = require("fs");

// import fs from "fs";
// import { resolve } from "path";
import { LowSync, JSONFileSync } from "lowdb";
const adapther = new JSONFileSync("/src/db.json");
