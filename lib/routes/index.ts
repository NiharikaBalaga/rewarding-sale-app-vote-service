import express from 'express';
import passport from 'passport';
import { isBlocked, tokenBlacklist } from '../middlewares';
import { newVote, validateErrors } from './RequestValidations';
import { VoteServiceController } from '../controller';

const router = express.Router();


function getRouter() {
  router.get('/hello', (req, res) => {
    res.send({ message: 'Hello from comment' });
  });

  // Get Votes
  router.get('', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, VoteServiceController.getVotes]);

  // Create Vote
  router.post('', [passport.authenticate('jwt-access', { session: false }), isBlocked, tokenBlacklist, newVote(), validateErrors, VoteServiceController.createVote]);

  return router;
}

export const routes = getRouter();