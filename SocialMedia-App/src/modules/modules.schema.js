import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as postQueryResolver from "./post/resolver/query.resolver.js";
import * as postMutationResolver from "./post/resolver/mutation.resolver.js";
import * as userQueryResolver from "./user/resolver/user.query.resolver.js";
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "mainSchemaQuery",
    description: "Main Schema Query",
    fields: {
      ...postQueryResolver,
      ...userQueryResolver,
    }
  }),
  mutation: new GraphQLObjectType({
    name: "mainSchemaMutation",
    description: "Main Schema Mutation",
    fields: {
      ...postMutationResolver
    }
  })
})