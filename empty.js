// socket.on("new-message", async (data) => {
//   try {
//     // console.log(data);
//     let newMessage = await Message.create({ ...data, time: Date.now() });
//     const chatMessages = await Message.find({ chat_id: data.chat_id });
//     console.log(await Chat.findById(data.chat_id), "yyyyyyyy");
//     socket.broadcast.emit("new-message", {
//       messages: chatMessages,
//       chatId: data.chat_id,
//       persons,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
