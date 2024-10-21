import { User } from '../models/User';
import { Item } from '../models/Item';
import jwt from 'jsonwebtoken';

export const resolvers = {
  Query: {
    users: async () => await User.find(),
    items: async () => await Item.find(),
  },
  Mutation: {
    register: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = new User({ email, password });
      await user.save();
      return user;
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid credentials');
      }
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    },
    createItem: async (_: any, { name, price }: { name: string; price: number }) => {
      const item = new Item({ name, price });
      await item.save();
      return item;
    },
  },
};
