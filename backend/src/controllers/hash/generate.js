import { hash } from "bcrypt";

hash("123456", 10).then(console.log);