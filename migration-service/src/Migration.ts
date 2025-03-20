import "reflect-metadata";
import AppDataSource from "./OrmConfig";
import { User } from "./entity/User";
import { RoleType } from "../../common/enum/RoleType";
import bcrypt from "bcryptjs";

async function initDb() {
  await AppDataSource.synchronize();
  console.log("Database synchronization completed.");
  const userRepository = AppDataSource.getRepository(User);

  const existingUser = await userRepository.findOne({ where: { role: RoleType.Admin } });
  if (!existingUser) {
    const defaultAdmin = new User();
    defaultAdmin.username = process.env.DEFAULT_ADMIN!;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD!, salt);
    defaultAdmin.password = hash
    defaultAdmin.role = RoleType.Admin;
    await userRepository.save(defaultAdmin);
    console.log("Default admin user created!");
  } else {
    console.log("Admin user already exists.");
  }
}

async function runMigration() {
  try {
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    await initDb()
    // await AppDataSource.runMigrations();
    console.log("Migration service completed. Shutting down.");
    process.exit(0);
  } catch (error) {
    console.error("Error during database synchronization: ", error);
    process.exit(1);
  }
}

setTimeout(async () => {
  await runMigration();
}, 10000)