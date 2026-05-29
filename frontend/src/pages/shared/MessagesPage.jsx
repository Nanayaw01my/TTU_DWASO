import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

let socket;

export default function MessagesPage() {
  const { userId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('ttu_token') },
    });

    socket.emit('user_online', user._id);

    socket.on('receive_message', (msg) => {
      if (activeConversation && (msg.senderId._id === activeConversation || msg.senderId === activeConversation)) {
        setMessages((prev) => [...prev, msg]);
      }
      // Update inbox
      setConversations((prev) => {
        const existing = prev.find((c) => c._id?.includes(msg.senderId._id || msg.senderId));
        if (existing) {
          return prev.map((c) =>
            c._id?.includes(msg.senderId._id || msg.senderId)
              ? { ...c, lastMessage: { ...c.lastMessage, content: msg.content, createdAt: new Date() }, unreadCount: c.unreadCount + 1 }
              : c
          );
        }
        return prev;
      });
    });

    return () => { socket.disconnect(); };
  }, [user._id]);

  // Load inbox
  useEffect(() => {
    api.get('/messages/inbox')
      .then(({ data }) => setConversations(data.conversations))
      .catch(() => {});
  }, []);

  // Open conversation from URL param
  useEffect(() => {
    if (userId) {
      loadConversation(userId);
      if (location.state?.product) {
        // Pre-fill message about product
        setNewMessage(`Hi! I'm interested in your product: ${location.state.product.title}`);
      }
    }
  }, [userId]);

  const loadConversation = async (targetUserId) => {
    setActiveConversation(targetUserId);
    try {
      const { data } = await api.get(`/messages/conversation/${targetUserId}`);
      setMessages(data.messages);

      // Get recipient info from the messages
      const firstMsg = data.messages[0];
      if (firstMsg) {
        const rec = firstMsg.senderId._id === user._id ? firstMsg.recipientId : firstMsg.senderId;
        setRecipient(rec);
      } else {
        // If no messages yet, try to get vendor info
        try {
          const { data: vendorData } = await api.get(`/vendors/${targetUserId}`);
          setRecipient(vendorData.vendor);
        } catch {}
      }
    } catch {}
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    setSending(true);
    try {
      const { data } = await api.post('/messages', {
        recipientId: activeConversation,
        content: newMessage.trim(),
        productId: location.state?.product?._id,
      });

      setMessages((prev) => [...prev, data.message]);
      socket.emit('send_message', { ...data.message, recipientId: activeConversation });
      setNewMessage('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex page-container py-6 gap-6" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Inbox list */}
        <div className="w-72 flex-shrink-0 hidden md:flex flex-col card p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No conversations yet</div>
            ) : (
              conversations.map((conv) => {
                const other = conv.lastMessage?.senderId?._id === user._id
                  ? conv.lastMessage?.recipientId
                  : conv.lastMessage?.senderId;
                const otherId = other?._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => loadConversation(otherId)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800/50 transition-colors text-left ${activeConversation === otherId ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                      {(other?.fullName || other?.businessName || '?')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {other?.businessName || other?.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{conv.lastMessage?.content}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col card overflow-hidden min-w-0">
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Select a conversation</h3>
                <p className="text-gray-400 text-sm mt-1">Choose from your inbox or contact a seller from a product page</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              {recipient && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                    {(recipient.businessName || recipient.fullName || '?')[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">{recipient.businessName || recipient.fullName}</p>
                    <p className="text-xs text-gray-400 capitalize">{recipient.role}</p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-8">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((msg) => {
                    const isMe = (msg.senderId?._id || msg.senderId) === user._id;
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                            {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                  maxLength={1000}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
