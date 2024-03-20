import type { Request, Response } from 'express';
import type { IUser } from '../DB/Models/User';
import { VoteService } from '../services/Vote';
import { matchedData } from 'express-validator';

interface RequestValidatedByPassport extends Request {
  user: {
    userId: string;
    accessToken: string;
    phoneNumber: string,
    iat: number,
    exp: number,
  }
}

interface RequestInterferedByIsBlocked extends RequestValidatedByPassport {
  currentUser: IUser
}

class VoteServiceController {
  public static vote(req: RequestInterferedByIsBlocked, res: Response) {
    const { matchedData: { postId } } = req.body;
    const { currentUser }  = req;
    return VoteService.vote(postId, currentUser, res);
  }


  public static postVoteCount(req: RequestInterferedByIsBlocked, res: Response) {
    const { matchedData: { postId } } = req.body;
    return VoteService.postVoteCount(postId, res);
  }

  public static userPostVote(req: RequestInterferedByIsBlocked, res: Response) {
    const { matchedData: { postId } } = req.body;
    const { currentUser }  = req;
    return VoteService.userPostVote(postId, currentUser, res);
  }

}

export  {
  VoteServiceController
};