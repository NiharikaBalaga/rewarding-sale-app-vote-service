import type { IVote } from '../DB/Models/Vote';
import VoteModel from '../DB/Models/Vote';
import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import { VoteStatus } from '../DB/Models/vote-status.enum';
import UserModel from '../DB/Models/User';
import PostModel from '../DB/Models/Post';

class VoteService {

  public static async getVotes(res: Response) {
    try {
      // Get votes
      const votes = await VoteModel.find({}).exec();

      // send updated serialised user in response
      if (votes){
        return res.send({
          message: 'Votes Retrieved Successfully',
          status: httpCodes.ok,
          votes: votes
        });
      } else {
        return res.send({
          message: 'Votes Retrieved without success, please check',
          status: httpCodes.notFound,
          votes: null
        });
      }
    } catch (error){
      console.error('getVotes-error', error);
      return  res.sendStatus(httpCodes.serverError).send('Server Error, Please try again later');
    }
  }

  public static async createVote(voteObject: Partial<IVote>, res: Response) {
    try {
      // Check if the user has already upvote the same post
      const existingVote = await VoteModel.findOne({ userId: voteObject.userId, postId: voteObject.postId });
      if (existingVote) {
        return res.status(httpCodes.conflict).send({
          message: 'You can\'t upvote a post more than once.',
          status: httpCodes.conflict
        });
      }

      // Check if the user id exists
      const existingUser = await UserModel.findOne({ _id: voteObject.userId });
      const existingPost = await PostModel.findOne({ _id: voteObject.postId });
      if (!existingUser && !existingPost) {
        return res.status(httpCodes.conflict).send({
          message: 'The user and post doesn\'t exist in db, please check.',
          status: httpCodes.conflict
        });
      }
      if (!existingUser) {
        return res.status(httpCodes.conflict).send({
          message: 'The user doesn\'t exist in db, please check.',
          status: httpCodes.conflict
        });
      }
      if (!existingPost) {
        return res.status(httpCodes.conflict).send({
          message: 'The post doesn\'t exist in db, please check.',
          status: httpCodes.conflict
        });
      }

      // Create new vote
      const newVote = new VoteModel(voteObject);
      await newVote.save();

      // send updated serialised vote in response
      return res.send({
        message: 'Vote created Successfully',
        status: VoteStatus.created,
        newVote: newVote
      });
    } catch (logoutError){
      console.error('createVote-AdminService', logoutError);
      return  res.sendStatus(httpCodes.serverError);
    }
  }

}

export {
  VoteService
};
