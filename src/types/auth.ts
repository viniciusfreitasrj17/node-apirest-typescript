export type TReq = {
  userId: string | number | unknown;
  headers: {
    authorization: string;
  };
};

export type TDecoded = {
  id: string | number | unknown;
};
