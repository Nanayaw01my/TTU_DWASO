const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  const { recipientId, content, productId } = req.body;
  const senderId = req.user._id;

  const conversationId = Message.getConversationId(senderId, recipientId);

  const message = await Message.create({
    conversationId,
    senderId,
    recipientId,
    productId,
    content,
  });

  const populated = await message.populate([
    { path: 'senderId', select: 'fullName businessName passportPhoto role' },
    { path: 'recipientId', select: 'fullName businessName passportPhoto role' },
    { path: 'productId', select: 'title images price' },
  ]);

  // Emit via socket if available
  const io = req.app.get('io');
  if (io) {
    io.to(recipientId.toString()).emit('receive_message', populated);
  }

  res.status(201).json({ success: true, message: populated });
};

exports.getConversation = async (req, res) => {
  const { userId } = req.params;
  const conversationId = Message.getConversationId(req.user._id, userId);

  const messages = await Message.find({ conversationId })
    .populate('senderId', 'fullName businessName passportPhoto role')
    .populate('productId', 'title images price')
    .sort({ createdAt: 1 });

  // Mark messages as read
  await Message.updateMany(
    { conversationId, recipientId: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.json({ success: true, messages });
};

exports.getInbox = async (req, res) => {
  const userId = req.user._id;

  // Get unique conversations
  const conversations = await Message.aggregate([
    { $match: { $or: [{ senderId: userId }, { recipientId: userId }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$recipientId', userId] }, { $eq: ['$isRead', false] }] }, 1, 0],
          },
        },
      },
    },
    { $sort: { 'lastMessage.createdAt': -1 } },
    { $limit: 50 },
  ]);

  await Message.populate(conversations, [
    { path: 'lastMessage.senderId', select: 'fullName businessName passportPhoto' },
    { path: 'lastMessage.recipientId', select: 'fullName businessName passportPhoto' },
    { path: 'lastMessage.productId', select: 'title images' },
  ]);

  res.json({ success: true, conversations });
};
