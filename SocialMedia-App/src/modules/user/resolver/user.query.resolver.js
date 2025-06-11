import { GraphQLNonNull, GraphQLString } from "graphql"
import { userProfileResponse } from "../types/user.types.js"
import { authGraphMiddleware } from "../../../middleware/index.js"

export const profile = {
  type: userProfileResponse,
  args: {
    authorization: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (parent, args) => {

    const user = await authGraphMiddleware({ authorization: args.authorization });
    console.log({user});
    
    return {
      statusCode: 200,
      message: 'success',
      data:  user 
    }
  }
}