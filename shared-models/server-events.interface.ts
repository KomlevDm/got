export interface IServerEvents {
  opponentFound: {
    event: 'opponentFound';
    data: {
      name: string;
    };
  };
}
