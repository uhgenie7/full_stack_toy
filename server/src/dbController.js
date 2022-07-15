import fs from "fs";
import { resolve } from "path";

const basePath = resolve();
// 현재 경로가 basePath

const filenames = {
  messages: resolve(basePath, "src/db/messages.json"),
  users: resolve(basePath, "src/db/users.json"),
};

export const readDB = (target) => {
  // target: messages.json을 읽을지, users.json을 읽을지 결정
  try {
    return JSON.parse(fs.readFileSync(filenames[target], "utf-8")); // 인코딩을 명시해주지 않으면 파일이 깨질 수 있음
  } catch (err) {
    console.error(err);
  }
};

export const writeDB = (target, data) => {
  // target 뿐만 아니라 새로 덮을 data도 받아와야 한다
  try {
    return fs.writeFileSync(filenames[target], JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

Footer;
