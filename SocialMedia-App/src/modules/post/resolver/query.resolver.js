import * as dbService from '../../../database/db.service.js';
import { postModel } from '../../../database/model/index.js';
import * as postTypes from '../types/post.types.js';




export const postList = {
  type: postTypes.postListResponse,
  resolve: async () => {
    const posts = await dbService.find({
      model: postModel,
      populate: [{ path: 'createdBy' }]
    });
    return {
      status: 200,
      message: 'done',
      data: posts.data
    };
  }
};


