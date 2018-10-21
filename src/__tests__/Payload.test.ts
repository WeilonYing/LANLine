import { Payload, PayloadJSON, PayloadUtils } from '../Payload';

process.env.test = "true";

describe("Test payload conversion", () => {
  test('payloadToJson()', () => {
    let payload: Payload = {
      uuid: '1',
      type: 'message',
      timestamp: new Date(),
      nickname: 'name',
      message: 'blah'
    };
    
    let payloadJson: PayloadJSON = PayloadUtils.payloadToJson(payload);
    expect(payload.uuid).toEqual(payloadJson.uuid);
    expect(payload.type).toEqual(payloadJson.type);
    expect(payload.timestamp.toString()).toEqual(payloadJson.timestamp);
    expect(payload.nickname).toEqual(payloadJson.nickname);
    expect(payload.message).toEqual(payloadJson.message);
    expect(JSON.stringify(payloadJson)).toBeTruthy(); // not null and not undefined
  });
  
  test('jsonToPayload()', () => {
    let now: Date = new Date();
    let payloadJson: PayloadJSON = {
      uuid: '1',
      type: 'message',
      timestamp: now.toString(),
      nickname: 'name',
      message: 'blah'
    }
    
    let payload: Payload = PayloadUtils.jsonToPayload(payloadJson);
    expect(payload.uuid).toEqual(payloadJson.uuid);
    expect(payload.type).toEqual(payloadJson.type);
    expect(payload.timestamp instanceof Date).toBe(true);
    expect(payload.timestamp.toString()).toEqual(payloadJson.timestamp);
    expect(payload.nickname).toEqual(payloadJson.nickname);
    expect(payload.message).toEqual(payloadJson.message);
  });
});