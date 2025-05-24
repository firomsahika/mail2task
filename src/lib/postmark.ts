
export interface PostmarkInboundEmail{
    From:string,
    To:string,
    Subject:string,
    TextBody:string,
    RecievedAt:Date,

}


export function parsePostmarkEmail(data:any):PostmarkInboundEmail{
    return {
        From:data.From,
        To:data.To,
        Subject:data.Subject,
        TextBody:data.TextBody,
        RecievedAt:data.RecievedAt
    }
}
