import { EmailAlreadyExistsError } from "../../src/errors";
import { UserModel } from "../../src/models/user-model";
import { UserService } from "../../src/services/user-service";
import { createUser } from "../support/factories";

describe("UserService", () => {
  describe("#register", () => {
    it("inserts new user into database", async () => {
      const userService = new UserService();

      await userService.register({
        name: "Philip Tomov",
        email: "philip@mail.bg",
        password: "philip1234",
      });

      const user = await UserModel.query().findOne({ email: "philip@mail.bg" });

      expect(user!.name).toEqual("Philip Tomov");
    });

    it("throws an EmailAlreadyExistsError when the email already exists", async () => {
      const userService = new UserService();
      await createUser({ email: "philip12@mail.bg" });

      await expect(async () => {
        await userService.register({
          name: "Ivan",
          email: "philip12@mail.bg",
          password: "qwertyyui",
        });
      }).rejects.toThrow(EmailAlreadyExistsError);
    });

    it("hashes the password", async () => {
      const userService = new UserService();

      await userService.register({
        name: "Philip Tomov",
        email: "philip@mail.bg",
        password: "philip1234",
      });

      const user = await UserModel.query().findOne({ email: "philip@mail.bg" });
      expect(user!.password).not.toEqual("philip1234");
    });
  });
  describe("#login", () => {
    it("loggs in actual user", async () => {
      const userService = new UserService();

      const registered = await userService.register({
        name: "Philip Tomov",
        email: "philip@mail.bg",
        password: "philip1234",
      });

      const user = await userService.login("philip@mail.bg", "philip1234");

      expect(user!.id).toEqual(registered.id);
    });

    it("returns undefined if wrong email", async () => {
      const userService = new UserService();

      await userService.register({
        name: "Philip Tomov",
        email: "philip@mail.bg",
        password: "philip1234",
      });

      const user = await userService.login("philip1@mail.bg", "philip1234");

      expect(user).toBeUndefined();
    });

    it("returns undefined if password is wrong", async () => {
      const userService = new UserService();

      await userService.register({
        name: "Philip Tomov",
        email: "philip@mail.bg",
        password: "philip1234",
      });

      const user = await userService.login("philip@mail.bg", "philip123");

      expect(user).toBeUndefined();
    });
  });

  describe("#getUserById", () => {
    it("gets user with valid id", async () => {
      const userService = new UserService();
      const registered = await createUser();

      const getUser = await userService.getUserById(registered.id);

      expect(getUser!.name).toEqual("Philip Tomov");
    });

    it("does not find user with invalid id", async () => {
      const userService = new UserService();
      const registered = await createUser();

      const getUser = await userService.getUserById(registered.id + 10);

      expect(getUser).toBeUndefined();
    });
  });

  describe("#update", () => {
    it("updates user's name and password with valid id", async () => {
      const userService = new UserService();
      const registered = await userService.register({
        name: "Philip Tomov",
        email: "philip@mail.bg",
        password: "philip1234",
      });

      await userService.update(registered.id, {
        name: "Todor Tomov",
        password: "philip123",
      });

      const user = await UserModel.query().findOne({ email: "philip@mail.bg" });

      expect(user!.name).toEqual("Todor Tomov");
      expect(user!.password).not.toEqual(registered.password);
    });

    it("does not update anything when invalid id is passed", async () => {
      const userService = new UserService();
      const registered = await userService.register({
        name: "Philip Tomov",
        email: "philip@mail.bg",
        password: "philip1234",
      });

      await userService.update(registered.id + 1, {
        name: "Todor Tomov",
        password: "philip123",
      });

      const user = await UserModel.query().findOne({ email: "philip@mail.bg" });

      expect(user!.name).toEqual("Philip Tomov");
      expect(user!.password).toEqual(registered.password);
    });
  });

  describe("#deleteById", () => {
    it("deletes correct user", async () => {
      const userService = new UserService();
      const registered = await createUser();

      await userService.deleteById(registered.id);
      const user = await UserModel.query().findOne({ email: "philip@mail.bg" });
      expect(user).toBeUndefined();
    });

    it("does not delete other users", async () => {
      const userService = new UserService();
      const registered1 = await createUser({ email: "philip1@mail.bg" });
      await createUser({ email: "philip2@mail.bg" });

      await userService.deleteById(registered1.id);
      const user = await UserModel.query().findOne({
        email: "philip2@mail.bg",
      });
      expect(user!.email).toEqual("philip2@mail.bg");
    });
  });
});
