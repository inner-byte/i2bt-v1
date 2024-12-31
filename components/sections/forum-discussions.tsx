'use client';

import { FC, useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  EyeIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  FireIcon,
  ClockIcon,
  LockClosedIcon,
  UserIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  PhotoIcon,
  LinkIcon,
  HashtagIcon,
  AtSymbolIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'react-hot-toast';
import { ErrorFallback } from '@/components/ui/error-boundary';
import { nanoid } from 'nanoid';

interface Tag {
  id: string;
  name: string;
}

interface Mention {
  id: string;
  username: string;
  name: string;
}

interface Attachment {
  id: string;
  type: 'image' | 'link' | 'file';
  url: string;
  name?: string;
  size?: number;
  thumbnailUrl?: string;
}

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  rawContent?: string; // For storing rich text content
  timestamp: string;
  isEditing?: boolean;
  editedAt?: string;
  mentions?: Mention[];
  tags?: Tag[];
  attachments?: Attachment[];
}

interface ForumPost {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  categoryColor: string;
  timestamp: string;
  views: number;
  replies: number;
  likes: number;
  isHot: boolean;
  isTrending: boolean;
  preview: string;
  isLiked: boolean;
  tags?: Tag[];
  comments?: Comment[];
}

export const ForumDiscussions: FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/forum/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch forum posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      green: "bg-green-100 text-green-700",
      pink: "bg-pink-100 text-pink-700"
    };
    return colors[category as keyof typeof colors] || colors.blue;
  };

  const [showLoginPrompt, setShowLoginPrompt] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [editContent, setEditContent] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ postId: number; commentId: number } | null>(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, loading } = useAuth();

  // Mock data for mentions and tags
  const availableMentions: Mention[] = [
    { id: '1', username: 'johndoe', name: 'John Doe' },
    { id: '2', username: 'janedoe', name: 'Jane Doe' },
    // Add more users
  ];

  const availableTags: Tag[] = [
    { id: '1', name: 'javascript' },
    { id: '2', name: 'react' },
    { id: '3', name: 'typescript' },
    // Add more tags
  ];

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      const response = await fetch(`/api/forum/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments?.filter(comment => comment.id !== commentId),
                replies: post.replies - 1,
              }
            : post
        )
      );
      setShowDeleteConfirm(null);
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLike = async (postId: number) => {
    if (!user) {
      setShowLoginPrompt(postId);
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${postId}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update like status');
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
      toast.success(posts.find(p => p.id === postId)?.isLiked ? 'Post unliked' : 'Post liked');
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handleReplySubmit = async (postId: number) => {
    if (!user || !replyContent[postId]?.trim()) return;

    try {
      const response = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent[postId],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      const newComment = await response.json();

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
                replies: post.replies + 1,
              }
            : post
        )
      );

      setReplyContent(prev => ({ ...prev, [postId]: '' }));
      toast.success('Reply posted successfully');
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  const handleEditStart = (postId: number, commentId: number, content: string) => {
    setEditContent(prev => ({ ...prev, [commentId]: content }));
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments?.map(comment =>
                comment.id === commentId
                  ? { ...comment, isEditing: true }
                  : { ...comment, isEditing: false }
              ),
            }
          : post
      )
    );
  };

  const handleEditCancel = (postId: number, commentId: number) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments?.map(comment =>
                comment.id === commentId
                  ? { ...comment, isEditing: false }
                  : comment
              ),
            }
          : post
      )
    );
    setEditContent(prev => {
      const newEdit = { ...prev };
      delete newEdit[commentId];
      return newEdit;
    });
  };

  const handleEditSave = (postId: number, commentId: number) => {
    if (!editContent[commentId]?.trim()) return;

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments?.map(comment =>
                comment.id === commentId
                  ? {
                      ...comment,
                      content: editContent[commentId],
                      isEditing: false,
                      editedAt: 'Edited just now',
                    }
                  : comment
              ),
            }
          : post
      )
    );
    setEditContent(prev => {
      const newEdit = { ...prev };
      delete newEdit[commentId];
      return newEdit;
    });
    toast.success('Comment updated successfully');
  };

  const handleImageUpload = async (file: File, postId: number, commentId?: number) => {
    try {
      // Mock image upload - in production, this would upload to your storage service
      const mockImageUrl = URL.createObjectURL(file);
      
      if (commentId) {
        // Adding image to existing comment
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments?.map(comment =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          attachments: [
                            ...(comment.attachments || []),
                            {
                              id: nanoid(),
                              type: 'image',
                              url: mockImageUrl,
                              name: file.name,
                              size: file.size,
                            },
                          ],
                        }
                      : comment
                  ),
                }
              : post
          )
        );
      } else {
        // Adding image to new reply
        const newAttachment = {
          id: nanoid(),
          type: 'image' as const,
          url: mockImageUrl,
          name: file.name,
          size: file.size,
        };
        setReplyContent(prev => ({
          ...prev,
          [postId]: (prev[postId] || '') + `![${newAttachment.name}](${newAttachment.url})`,
        }));
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleMention = (mention: Mention, postId: number, commentId?: number) => {
    const mentionText = `@${mention.username} `;
    if (commentId) {
      setEditContent(prev => ({ ...prev, [commentId]: (prev[commentId] || '') + mentionText }));
    } else {
      setReplyContent(prev => ({
        ...prev,
        [postId]: (prev[postId] || '') + mentionText,
      }));
    }
    setShowMentions(false);
  };

  const handleTag = (tag: Tag, postId: number, commentId?: number) => {
    const tagText = `#${tag.name} `;
    if (commentId) {
      setEditContent(prev => ({
        ...prev,
        [commentId]: (prev[commentId] || '') + tagText,
      }));
    } else {
      setReplyContent(prev => ({
        ...prev,
        [postId]: (prev[postId] || '') + tagText,
      }));
    }
    setShowTags(false);
  };

  const formatText = (text: string, format: 'bold' | 'italic' | 'link') => {
    const formats = {
      bold: '**',
      italic: '_',
      link: '[](url)',
    };
    
    const selectedText = window.getSelection()?.toString() || '';
    const marker = formats[format];
    
    if (format === 'link') {
      return selectedText ? `[${selectedText}](url)` : marker;
    }
    
    return selectedText ? `${marker}${selectedText}${marker}` : marker;
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#F8FAFC] to-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest Discussions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join the conversation and connect with fellow tech enthusiasts
          </p>
        </motion.div>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow">
                    {/* Title and Indicators */}
                    <div className="flex items-center gap-2 mb-2">
                      {post.isHot && (
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-orange-500 text-sm font-medium bg-orange-50 px-2 py-0.5 rounded-full"
                        >
                          <FireIcon className="w-4 h-4" />
                          Hot
                        </motion.span>
                      )}
                      {post.isTrending && (
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-blue-500 text-sm font-medium bg-blue-50 px-2 py-0.5 rounded-full"
                        >
                          <ArrowTrendingUpIcon className="w-4 h-4" />
                          Trending
                        </motion.span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                      {post.title}
                    </h3>

                    {/* Preview */}
                    <p className="text-gray-600 text-sm mb-4">
                      {post.preview}
                    </p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.categoryColor)}`}>
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        {post.timestamp}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <EyeIcon className="w-4 h-4" />
                        {post.views}
                      </span>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        {post.replies} replies
                      </button>
                    </div>
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <button 
                      className="group relative"
                      onClick={() => handleLike(post.id)}
                    >
                      {post.isLiked ? (
                        <HeartIconSolid className="w-6 h-6 text-red-500" />
                      ) : (
                        <HeartIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                      )}
                      <span className="text-sm text-gray-500">{post.likes}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showComments[post.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="space-y-4">
                        {post.comments?.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-gray-900">
                                  {comment.author.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {comment.timestamp}
                                </span>
                                {comment.editedAt && (
                                  <span className="text-xs text-gray-400 italic">
                                    ({comment.editedAt})
                                  </span>
                                )}
                                {user?.name === comment.author.name && !comment.isEditing && (
                                  <div className="flex items-center gap-2 ml-2">
                                    <button
                                      onClick={() => handleEditStart(post.id, comment.id, comment.content)}
                                      className="text-xs text-blue-500 hover:text-blue-600"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteConfirm({ postId: post.id, commentId: comment.id })}
                                      className="text-xs text-red-500 hover:text-red-600"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                              {comment.isEditing ? (
                                <div className="mt-2 space-y-2">
                                  <div className="flex gap-2 mb-2">
                                    <button
                                      onClick={() => {
                                        const formatted = formatText(editContent[comment.id] || '', 'bold');
                                        setEditContent(prev => ({
                                          ...prev,
                                          [comment.id]: formatted,
                                        }));
                                      }}
                                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                                      title="Bold"
                                    >
                                      <strong>B</strong>
                                    </button>
                                    <button
                                      onClick={() => {
                                        const formatted = formatText(editContent[comment.id] || '', 'italic');
                                        setEditContent(prev => ({
                                          ...prev,
                                          [comment.id]: formatted,
                                        }));
                                      }}
                                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                                      title="Italic"
                                    >
                                      <em>I</em>
                                    </button>
                                    <button
                                      onClick={() => {
                                        const formatted = formatText(editContent[comment.id] || '', 'link');
                                        setEditContent(prev => ({
                                          ...prev,
                                          [comment.id]: formatted,
                                        }));
                                      }}
                                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                                      title="Add Link"
                                    >
                                      <LinkIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => fileInputRef.current?.click()}
                                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                                      title="Upload Image"
                                    >
                                      <PhotoIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setShowMentions(true)}
                                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                                      title="Mention User"
                                    >
                                      <AtSymbolIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setShowTags(true)}
                                      className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                                      title="Add Tag"
                                    >
                                      <HashtagIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <textarea
                                    value={editContent[comment.id] || ''}
                                    onChange={(e) =>
                                      setEditContent(prev => ({
                                        ...prev,
                                        [comment.id]: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    rows={3}
                                    autoFocus
                                  />
                                  {/* Display Attachments */}
                                  {comment.attachments && comment.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {comment.attachments.map((attachment) => (
                                        <div
                                          key={attachment.id}
                                          className="relative group"
                                        >
                                          {attachment.type === 'image' && (
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                              <img
                                                src={attachment.url}
                                                alt={attachment.name || 'Attachment'}
                                                className="w-full h-full object-cover"
                                              />
                                              <button
                                                onClick={() => {
                                                  // Remove attachment logic
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <XMarkIcon className="w-3 h-3" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditSave(post.id, comment.id)}
                                      className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => handleEditCancel(post.id, comment.id)}
                                      className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {comment.content}
                                  </p>
                                  {/* Display Attachments for View Mode */}
                                  {comment.attachments && comment.attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {comment.attachments.map((attachment) => (
                                        <div
                                          key={attachment.id}
                                          className="relative"
                                        >
                                          {attachment.type === 'image' && (
                                            <div className="w-20 h-20 rounded-lg overflow-hidden">
                                              <img
                                                src={attachment.url}
                                                alt={attachment.name || 'Attachment'}
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Mentions Dropdown */}
                              <AnimatePresence>
                                {showMentions && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-10 mt-1 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                                  >
                                    <div className="p-2">
                                      <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={mentionQuery}
                                        onChange={(e) => setMentionQuery(e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto">
                                      {availableMentions
                                        .filter(m =>
                                          m.username.toLowerCase().includes(mentionQuery.toLowerCase()) ||
                                          m.name.toLowerCase().includes(mentionQuery.toLowerCase())
                                        )
                                        .map(mention => (
                                          <button
                                            key={mention.id}
                                            onClick={() => handleMention(mention, post.id, comment.id)}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                          >
                                            <div className="font-medium">{mention.name}</div>
                                            <div className="text-gray-500">@{mention.username}</div>
                                          </button>
                                        ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Tags Dropdown */}
                              <AnimatePresence>
                                {showTags && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-10 mt-1 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                                  >
                                    <div className="p-2">
                                      <input
                                        type="text"
                                        placeholder="Search tags..."
                                        value={tagQuery}
                                        onChange={(e) => setTagQuery(e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                      />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto">
                                      {availableTags
                                        .filter(t =>
                                          t.name.toLowerCase().includes(tagQuery.toLowerCase())
                                        )
                                        .map(tag => (
                                          <button
                                            key={tag.id}
                                            onClick={() => handleTag(tag, post.id, comment.id)}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                          >
                                            #{tag.name}
                                          </button>
                                        ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Hidden File Input */}
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(file, post.id, comment.id);
                                  }
                                }}
                              />

                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Reply */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        placeholder={user ? "Write a quick reply..." : "Login to reply to this discussion"}
                        className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                        disabled={!user}
                        value={replyContent[post.id] || ''}
                        onChange={(e) => setReplyContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onClick={() => !user && handleReplyAttempt(post.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && user && replyContent[post.id]?.trim()) {
                            handleReplySubmit(post.id);
                          }
                        }}
                      />
                      {!user && (
                        <LockClosedIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <button 
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                        ${user && replyContent[post.id]?.trim()
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      onClick={() => {
                        if (user && replyContent[post.id]?.trim()) {
                          handleReplySubmit(post.id);
                        } else if (!user) {
                          handleReplyAttempt(post.id);
                        }
                      }}
                      disabled={!user || !replyContent[post.id]?.trim()}
                    >
                      {user ? (
                        <PaperAirplaneIcon className="w-4 h-4" />
                      ) : (
                        <LockClosedIcon className="w-4 h-4" />
                      )}
                      Reply
                    </button>
                  </div>
                </div>

                {/* Login Prompt */}
                <AnimatePresence>
                  {showLoginPrompt === post.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-blue-50 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-700">
                          <LockClosedIcon className="w-5 h-5" />
                          <p className="text-sm font-medium">Login required to participate in discussions</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="px-6 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                            onClick={() => {
                              // This will be handled by the parent component's auth modal
                              document.dispatchEvent(new CustomEvent('open-auth-modal'));
                              setShowLoginPrompt(null);
                            }}
                          >
                            Login
                          </button>
                          <button 
                            className="px-6 py-1.5 bg-white text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            onClick={() => setShowLoginPrompt(null)}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowDeleteConfirm(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete Comment</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this comment? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteComment(showDeleteConfirm.postId, showDeleteConfirm.commentId)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8"
        >
          <button className="px-6 py-2 bg-[#E5EEF3] text-gray-700 rounded-xl font-medium hover:bg-[#D5E5EE] transition-all duration-200">
            View All Discussions
          </button>
        </motion.div>
      </div>
    </section>
  );
};
