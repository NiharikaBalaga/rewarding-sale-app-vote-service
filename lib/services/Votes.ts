import VoteModel, {IVote} from "../DB/Models/Vote";
import {httpCodes} from "../constants/http-status-code";
import type { Response } from "express";
import {VoteStatus} from "../DB/Models/vote-status.enum";

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
            // Check if the user has already report or update the same post
            const existingVote = await VoteModel.findOne({ userId: voteObject.userId, postId: voteObject.postId });
            if (existingVote) {
                return res.status(httpCodes.conflict).send({
                    message: 'You can\'t report or upvote a post more than once.',
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
