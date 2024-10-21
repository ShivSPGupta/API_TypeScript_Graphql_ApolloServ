import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

import userRoutes from './routes/userRoutes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', userRoutes);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const server = new ApolloServer({ typeDefs, resolvers });


// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.error(err.stack);
//     res.status(500).json({ message: 'An unexpected error occurred' });
//   });


(async () => {
  await server.start();
  app.use('/graphql', bodyParser.json(), expressMiddleware(server));
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
