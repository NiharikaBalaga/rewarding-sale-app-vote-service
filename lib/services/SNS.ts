import type { PublishCommandInput } from '@aws-sdk/client-sns';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import type { IVote } from '../DB/Models/Vote';
import { Events } from './events.enum';

class SNSService {
  private static readonly SNS: SNSClient = new SNSClient({
    apiVersion: 'version',
    region: process.env.aws_region,
    credentials: {
      accessKeyId: process.env.aws_sns_access_key_id || '',
      secretAccessKey: process.env.aws_sns_secret_access_key || '',
    },
  });

  private static async _publishToVoteTopicARN(Message: string) { // groupId should be POST ID of vote
    try {
      const messageParams: PublishCommandInput = {
        Message,
        TopicArn: process.env.VOTE_TOPIC_SNS_ARN,
      };
      console.log('SNSService messageParams: ', messageParams);
      const { MessageId } = await this.SNS.send(
        new PublishCommand(messageParams),
      );
      console.log('SNSService MessageId: ', MessageId);
      console.log('_publishToVoteTopicARN-success', MessageId);
    } catch (_publishToVoteTopicARNError) {
      console.error(
        '_publishToVoteTopicARNError',
        _publishToVoteTopicARNError,
      );
    }
  }

  static async newVote(vote: IVote) {
    console.log('SNSService vote: ', vote);
    console.log('SNSService vote.id: ', vote.postId);
    const EVENT_TYPE = Events.newVote;
    const snsMessage = Object.assign({ vote }, { EVENT_TYPE, postId: vote.postId });
    console.log(`Publishing ${EVENT_TYPE} to Vote Topic`);
    return this._publishToVoteTopicARN(JSON.stringify(snsMessage));
  }
}

export {
  SNSService
};