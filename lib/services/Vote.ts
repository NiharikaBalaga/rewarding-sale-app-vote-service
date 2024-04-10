import VoteModel from '../DB/Models/Vote';
import { httpCodes } from '../constants/http-status-code';
import type { Response } from 'express';
import type { IUser } from '../DB/Models/User';
import PostModel from '../DB/Models/Post';
import type mongoose from 'mongoose';
import { PostStatus } from '../DB/Models/post-status.enum';
import { SNSService } from './SNS';

class VoteService {
  public static async vote(postId: mongoose.Types.ObjectId, user: IUser, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findOne({
        _id: postId,
        status: PostStatus.published
      });

      if (!existingPost) {
        return  res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }
      // Check if the user has already upvote the same post
      const existingVote = await VoteModel.findOne({ userId: user.id, postId });
      if (existingVote) {
        // remove the vote
        await VoteModel.findByIdAndDelete(existingVote.id);
        return res.status(httpCodes.ok).send({
          message: 'User Vote Removed on Post'
        });
      }

      // Create new Vote on the post by this user
      const newVote = new VoteModel({
        postId: existingPost.id,
        userId: user.id
      });
      await newVote.save();
      console.log('VoteService newVote: ', newVote);
      // SNS Event
      SNSService.newVote(newVote);

      return res.status(httpCodes.ok).send({
        message: 'User Vote On Post Success'
      });
    } catch (error){
      console.error('vote-voteService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }

  public static async postVoteCount(postId: mongoose.Types.ObjectId, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findById(postId);

      if (!existingPost) {
        return  res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }

      const postVoteCount = await VoteModel.countDocuments({
        postId
      });
      return res.status(httpCodes.ok).send({
        postVoteCount
      });
    } catch (error) {
      console.error('postVoteCount-voteService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }

  public static async userPostVote(postId: mongoose.Types.ObjectId, user: IUser, res: Response) {
    try {
      // Only Published Post
      const existingPost = await PostModel.findById(postId);

      if (!existingPost) {
        return  res.status(httpCodes.badRequest).send({
          message: 'Post Does not exist / not published'
        });
      }
      const existingVote = await VoteModel.findOne({ userId: user.id, postId });

      return res.status(httpCodes.ok).send({
        userVote: !!existingVote
      });
    } catch (error){
      console.error('userPostVote-voteService', error);
      return res.sendStatus(httpCodes.serverError);
    }
  }
}

export {
  VoteService
};
