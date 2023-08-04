import { startApolloServer } from "./app.js";
import { typeDefs, resolvers } from "./graphql/schema.js";
import { connectDB } from "./db.js";
connectDB();
startApolloServer(typeDefs, resolvers);
