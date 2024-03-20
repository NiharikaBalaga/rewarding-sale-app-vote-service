import express from 'express';
import passport from 'passport';
import { isBlocked, tokenBlacklist } from '../middlewares';
import { vote, validateErrors } from './RequestValidations';
import { VoteServiceController } from '../controller';

const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello from comment' });
  });

  // User Vote on User
  router.patch('/:postId/vote', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, vote(), validateErrors, VoteServiceController.vote]);

  // Get Post Votes Count
  router.get('/:postId/votes/count', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, vote(), validateErrors, VoteServiceController.postVoteCount]);

  // User Post Vote Details
  router.get('/:postId/user/vote', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, vote(), validateErrors, VoteServiceController.userPostVote]);
  return router;
}

export const routes = getRouter();