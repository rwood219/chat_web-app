const users = [];

//join user to chat
userJoin = (id, username, room ) => {
    const user = {id, username, room};
    users.push(user)
    return user
}

getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

//User leaves
userLeave = (id) => {
    const index = users.findIndex(user =>  user.id === id);

    if(index !== -1) {
        return users.slice(index, 1)[0]
    }
}

//get room users
getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers
}