export type TopSpenderUser = {
  uuid: string;
  handle: string;
  nickname: string | null;
  displayName: string;
  isTopSpender: boolean;
  avatarUrl: string;
  registeredAt: string;
};

export type TopSpender = {
  gross: number;
  net: number;
  messages: number;
  user: TopSpenderUser;
};

export type TopSpendersResponse = {
  data: TopSpender[];
  nextCursor: string | null;
  total: number | null;
};
