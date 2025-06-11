import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import * as dbService from '../../../database/db.service.js';
import { postModel } from '../../../database/model/index.js';
import * as postTypes from '../types/post.types.js';
import { authGraphMiddleware, authorizationGraphMiddleware, validationGraph } from '../../../middleware/index.js';
import { ROLE } from '../../../common/constants/index.js';
import { likePostGraph } from '../post.validation.js';




export const likePost = {
  type: postTypes.likePostResponse,
  args: {
    postId: {
      type: new GraphQLNonNull(GraphQLID),

    },
    authorization: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (parent, args) => {
    const { postId, authorization } = args;
    await validationGraph({
      schema: likePostGraph,
      inputs: { postId, authorization }
    })
    const user = await authGraphMiddleware({ authorization })
    authorizationGraphMiddleware(ROLE.USER, user.role);
    const post = await dbService.findOneAndUpdate({
      model: postModel,
      filter: { _id: postId, isDeleted: { $exists: false } },
      data: { $addToSet: { likes: user._id } },
      options: { new: true }
    });

    return {
      status: 200,
      message: 'Post liked',
      data: post
    };
  }
}

