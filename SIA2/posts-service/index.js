const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GraphQL Schema for Posts
const typeDefs = gql`
  type Post {
    id: Int!
    title: String!
    content: String!
    published: Boolean!
  }

  type Query {
    posts: [Post!]!
    post(id: Int!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post!
    updatePost(id: Int!, title: String, content: String, published: Boolean): Post
    deletePost(id: Int!): Post
  }
`;

// Resolvers for CRUD operations using Prisma
const resolvers = {
  Query: {
    posts: () => prisma.post.findMany(),
    post: (_, args) => prisma.post.findUnique({ where: { id: args.id } }),
  },
  Mutation: {
    createPost: (_, args) => prisma.post.create({ data: { ...args, published: false } }),
    updatePost: async (_, args) => {
      const { id, ...data } = args;
      return prisma.post.update({ where: { id }, data });
    },
    deletePost: (_, args) => prisma.post.delete({ where: { id: args.id } }),
  },
};

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server on port 4002
server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`Posts service ready at ${url}`);
});
