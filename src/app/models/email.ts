export interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

export interface EmailDetail extends Email {
  body: string;
}

export interface EmailListResponse {
  emails: Email[];
}

export interface EmailDetailResponse {
  email: EmailDetail;
}
