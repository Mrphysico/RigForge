import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  PlusCircle, 
  Flame, 
  Award, 
  X,
  Send,
  Check
} from 'lucide-react';
import { MOCK_COMMUNITY_POSTS, TRENDING_TOPICS, TOP_MEMBERS } from '../data/mockCommunity';
import { CommunityPost } from '../types/hardware';
import { useAuthStore } from '../store/useAuthStore';

interface CommunityPageProps {
  onNotification: (msg: string) => void;
}

const TABS = ['All', 'Discussions', 'Showcases', 'Help', 'Events', 'Following'] as const;

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNotification }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Discussions' | 'Showcases' | 'Help' | 'Events'>('Discussions');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const handleToggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setPosts((current) =>
        current.map((p) =>
          p.id === postId
            ? { ...p, likesCount: p.likesCount + (isLiked ? 1 : -1) }
            : p
        )
      );
      return { ...prev, [postId]: isLiked };
    });
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}#community-post-${postId}`);
    setCopiedId(postId);
    onNotification('Post link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('signin');
      onNotification('Please sign in to publish a community post.');
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) {
      onNotification('Please provide both a title and content for your post.');
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: user?.name || 'RigBuilder',
      authorHandle: `@${(user?.name || 'builder').toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorBadge: 'Member',
      timeAgo: 'Just now',
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      likesCount: 1,
      commentsCount: 0,
      images: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      ],
      tags: ['#pc-builds', `#${newCategory.toLowerCase()}`],
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
    onNotification('Your post has been published to the RigForge Community!');
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Following') return true;
    return post.category === activeTab;
  });

  return (
    <div className="min-h-screen pb-20 bg-[#050a14] text-slate-100">
      {/* Header Banner */}
      <div className="border-b border-[#1e2d4f] bg-gradient-to-b from-[#08111f] to-[#050a14] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142244] border border-[#1e2d4f] text-[#ff1e2d] text-xs font-mono font-semibold mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>50,000+ ENTHUSIASTS ACROSS INDIA</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase font-mono">
                RIGFORGE <span className="text-[#ff1e2d]">COMMUNITY</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
                Connect with builders, share your setups, ask questions, exchange trade tips, and be part of something bigger.
              </p>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('signin');
                  onNotification('Please sign in to create a post.');
                } else {
                  setShowCreateModal(true);
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white font-bold text-sm shadow-glow-red transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>

          {/* Navigation tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 border-t border-[#1e2d4f] pt-6 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-[#ff1e2d] text-white shadow-glow-red'
                    : 'bg-[#0d172e] text-slate-300 hover:text-white hover:bg-[#142244] border border-[#1e2d4f]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {filteredPosts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <article
                  key={post.id}
                  className="bg-[#0d172e] border border-[#1e2d4f] rounded-2xl p-6 shadow-xl space-y-4 hover:border-[#ff1e2d]/40 transition-colors"
                >
                  {/* Post Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-[#1e2d4f]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{post.authorName}</span>
                          <span className="text-xs text-slate-400">{post.authorHandle}</span>
                          {post.authorBadge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#142244] text-[#0066ff] border border-[#1e2d4f]">
                              {post.authorBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{post.timeAgo}</span>
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[#050a14] border border-[#1e2d4f] text-slate-300 font-mono">
                      {post.category}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Images Carousel / Grid */}
                  {post.images && post.images.length > 0 && (
                    <div className={`grid gap-2 rounded-xl overflow-hidden ${
                      post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                    }`}>
                      {post.images.map((img, idx) => (
                        <div key={idx} className="aspect-video bg-[#050a14] overflow-hidden rounded-lg">
                          <img
                            src={img}
                            alt="Community battlestation"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs font-mono text-[#0066ff] hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#1e2d4f] text-xs text-slate-400">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isLiked ? 'text-[#ff1e2d] font-bold' : 'hover:text-[#ff1e2d]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likesCount}</span>
                      </button>

                      <button
                        onClick={() => onNotification('Comment thread opened! Share your thoughts below.')}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount} Comments</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Trending Topics */}
            <div className="bg-[#0d172e] border border-[#1e2d4f] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono">
                <Flame className="w-4 h-4 text-[#ff1e2d]" />
                <span>Trending Topics</span>
              </div>

              <div className="space-y-3">
                {TRENDING_TOPICS.map((topic, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNotification(`Filtered posts for ${topic.tag}`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#142244] cursor-pointer transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-200">{topic.tag}</span>
                    <span className="text-xs font-mono text-slate-500">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-[#0d172e] border border-[#1e2d4f] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono">
                <Award className="w-4 h-4 text-[#ffd000]" />
                <span>Top Members</span>
              </div>

              <div className="space-y-3">
                {TOP_MEMBERS.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#142244] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#1e2d4f]"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{member.handle}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{member.points}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNotification(`Following ${member.handle}!`)}
                      className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#142244] hover:bg-[#0066ff] text-white transition-colors"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#050a14]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0d172e] border border-[#1e2d4f] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#142244]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white">Create a Community Post</h2>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-white text-xs font-semibold focus:outline-none focus:border-[#ff1e2d]"
                >
                  <option value="Discussions">Discussions</option>
                  <option value="Showcases">Showcases</option>
                  <option value="Help">Hardware Help</option>
                  <option value="Events">Gaming Events</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Finally finished my all-black AM5 build..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#ff1e2d]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Content</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details, temperatures, specs, or questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050a14] border border-[#1e2d4f] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#ff1e2d] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#ff1e2d] hover:bg-[#e50914] text-white font-bold text-xs shadow-glow-red flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
