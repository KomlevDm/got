export interface IClientEvents {
  opponentSearch: {
    event: 'opponentSearch';
    data: {
      name: string;
    };
  };
}
