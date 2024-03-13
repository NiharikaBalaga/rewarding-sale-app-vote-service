import type { Request, Response } from 'express';
import { httpCodes } from '../constants/http-status-code';
import type { IUser } from '../DB/Models/User';
import { PostService } from '../services/Post';
import {VoteService} from "../services/Votes";

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

    public static getVotes(req: RequestInterferedByIsBlocked, res: Response) {
        return VoteService.getVotes(res);
    }

    public static createVote(req: RequestInterferedByIsBlocked, res: Response) {
        const { matchedData } = req.body;
        return VoteService.createVote(matchedData, res);
    }

}

export  {
    VoteServiceController
};