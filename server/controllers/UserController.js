import User from "../models/user.js";

const UserController = {
  async getAllUsers(request, reply) {
    try {
      const users = await find();
      reply.code(200).send(users);
    } catch (error) {
      reply.code(500).send(error);
    }
  },

  async createUser(request, reply) {
    try {
      const newUser = new User(request.body);
      await newUser.save();
      reply.code(201).send(newUser);
    } catch (error) {
      reply.code(400).send(error); // Handle validation errors
    }
  },
};

export default UserController;
