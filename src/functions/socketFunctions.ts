declare var global: any;
interface IOnlineUser {
  user: string;
  socket: string;
  date: Date;
}

const addUser = async (user: string, socket: string): Promise<void> => {
  const index = global.onlineUsers.findIndex((user2: IOnlineUser) => {
    return user2.user == user;
  });
  if (index == -1) {
    global.onlineUsers.push({ user, socket, date: Date.now() });
  } else {
    global.onlineUsers[index].socket = socket;
  }
};

const removeUser = async (socket: string): Promise<void> => {
  const removedUser = global.onlineUsers.find((user: IOnlineUser) => {
    return user.socket == socket;
  });
  global.onlineUsers = global.onlineUsers.filter((user: IOnlineUser) => {
    return user.socket !== socket;
  });
  console.log("removed user", removedUser);
};

export { addUser, removeUser };
