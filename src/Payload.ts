export interface Payload {
  uuid: string;
  type: string;
  timestamp: Date;
  nickname: string;
  message?: string;
}

export interface PayloadJSON {
  uuid: string;
  type: string;
  timestamp: string;
  nickname: string;
  message: string;
}

export class PayloadUtils {
  /**
    Convert Payload interface to JSON-parseable form.
    Date doesn't go too well with JSON, so we're converting it to
    a string first.
  */
  public static payloadToJson(payload: Payload): PayloadJSON {
    let payloadJson: PayloadJSON = {
      uuid: payload.uuid,
      type: payload.type,
      timestamp: payload.timestamp.toString(),
      nickname: payload.nickname,
      message: payload.message
    };

    return payloadJson; //JSON.stringify(payloadJson);
  }

  /**
    Convert JSON representation of Payload
  */
  public static jsonToPayload(payloadJson: PayloadJSON): Payload {
    //let payloadJson: PayloadJSON = JSON.parse(payloadJson);
    let payload: Payload = {
      uuid: payloadJson.uuid,
      type: payloadJson.type,
      timestamp: new Date(payloadJson.timestamp),
      nickname: payloadJson.nickname,
      message: payloadJson.message
    };

    return payload;
  }
}
