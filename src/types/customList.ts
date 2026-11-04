export type CustomList = {
  name: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
};

export type CustomListsResponse = {
  data: CustomList[];
  nextCursor: string | null;
  total: number | null;
};
