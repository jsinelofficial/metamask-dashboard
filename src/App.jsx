import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, ExternalLink, Bell, RefreshCw, Globe, Megaphone, Users, FileText, Calendar, AlertCircle, Twitter } from 'lucide-react';

// Competitor Twitter handles
const competitors = [
  { id: 1, name: 'Phantom', handle: 'phantom', logo: '👻', color: '#AB9FF2' },
  { id: 2, name: 'Rabby', handle: 'Rabby_io', logo: '🐰', color: '#8697FF' },
  { id: 3, name: 'MetaMask', handle: 'MetaMask', logo: '🦊', color: '#F6851B' },
  { id: 4, name: 'Solflare', handle: 'solflare', logo: '☀️', color: '#FC9965' },
  { id: 5, name: 'Trust Wallet', handle: 'TrustWallet', logo: '🛡️', color: '#3375BB' },
  { id: 6, name: 'Coinbase', handle: 'coinbase', logo: '🔵', color: '#0052FF' },
];

// Function to classify tweet type based on content
const classifyTweet = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('partner') || lowerText.includes('integration') || lowerText.includes('collab') || lowerText.includes('together with')) {
    return 'partnership';
  }
  if (lowerText.includes('launch') || lowerText.includes('introducing') || lowerText.includes('new feature') || lowerText.includes('now live') || lowerText.includes('announcing')) {
    return 'campaign';
  }
  return 'content';
};

// Function to estimate impact based on engagement
const estimateImpact = (tweet) => {
  const engagement = (tweet.likeCount || 0) + (tweet.retweetCount || 0) * 2 + (tweet.replyCount || 0);
  if (engagement > 1000) return 'high';
  if (engagement > 200) return 'medium';
  return 'low';
};

// Format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};

export default function CompetitiveIntelDashboard() {
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [competitorStats, setCompetitorStats] = useState({});

  // Fetch tweets from Twitter API
  const fetchCompetitorTweets = async () => {
    setLoading(true);
    setError(null);
    
    const apiKey = import.meta.env.VITE_TWITTER_API_KEY;
    
    if (!apiKey) {
      setError('API key not configured. Add VITE_TWITTER_API_KEY to your .env file.');
      setLoading(false);
      return;
    }

    const allTweets = [];
    const stats = {};

    for (const competitor of competitors) {
      try {
        const response = await fetch(
          `https://api.twitterapi.io/twitter/user/last_tweets?userName=${competitor.handle}`,
          {
            headers: {
              'X-API-Key': apiKey,
            },
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch tweets for ${competitor.name}`);
          continue;
        }

        const data = await response.json();
        
        if (data.tweets && Array.isArray(data.tweets)) {
          const processedTweets = data.tweets.map((tweet) => ({
            id: tweet.id,
            competitor: competitor.name,
            competitorHandle: competitor.handle,
            type: classifyTweet(tweet.text),
            title: tweet.text.slice(0, 100) + (tweet.text.length > 100 ? '...' : ''),
            fullText: tweet.text,
            date: formatRelativeTime(tweet.createdAt),
            createdAt: tweet.createdAt,
            impact: estimateImpact(tweet),
            likes: tweet.likeCount || 0,
            retweets: tweet.retweetCount || 0,
            replies: tweet.replyCount || 0,
            views: tweet.viewCount || 0,
            url: tweet.url || `https://twitter.com/${competitor.handle}/status/${tweet.id}`,
            source: 'Twitter',
          }));

          allTweets.push(...processedTweets);

          // Calculate stats
          stats[competitor.name] = {
            totalTweets: data.tweets.length,
            totalEngagement: data.tweets.reduce((sum, t) => sum + (t.likeCount || 0) + (t.retweetCount || 0), 0),
            partnerships: processedTweets.filter(t => t.type === 'partnership').length,
            campaigns: processedTweets.filter(t => t.type === 'campaign').length,
          };
        }
      } catch (err) {
        console.error(`Error fetching tweets for ${competitor.name}:`, err);
      }
    }

    // Sort by date (newest first)
    allTweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setTweets(allTweets);
    setCompetitorStats(stats);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchCompetitorTweets();
  }, []);

  // Filter tweets
  const filteredTweets = tweets.filter((item) => {
    if (selectedCompetitor !== 'all' && item.competitor !== selectedCompetitor) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery && !item.fullText.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'partnership': return <Users size={14} />;
      case 'campaign': return <Megaphone size={14} />;
      case 'content': return <FileText size={14} />;
      default: return <Globe size={14} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'partnership': return 'bg-violet-500/20 text-violet-400';
      case 'campaign': return 'bg-blue-500/20 text-blue-400';
      case 'content': return 'bg-emerald-500/20 text-emerald-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .glass-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        
        .glow-border {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.1), inset 0 0 20px rgba(245, 158, 11, 0.05);
        }
        
        .activity-card:hover {
          transform: translateX(4px);
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
        }
        
        .stat-glow {
          text-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
        }
        
        .scroll-fade {
          mask-image: linear-gradient(to bottom, black 90%, transparent 100%);
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-bold text-lg">
              CI
            </div>
            <div>
              <h1 className="text-lg font-semibold">Competitive Intelligence</h1>
              <p className="text-xs text-white/50">MetaMask Growth Team • Live Twitter Data</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-white/40">
                Last updated: {lastUpdated}
              </span>
            )}
            <button 
              onClick={fetchCompetitorTweets}
              disabled={loading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Competitor Quick Stats */}
        <div className="grid grid-cols-6 gap-4">
          {competitors.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedCompetitor(selectedCompetitor === comp.name ? 'all' : comp.name)}
              className={`glass-card rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] ${
                selectedCompetitor === comp.name ? 'glow-border border-amber-500/50' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{comp.logo}</span>
                <div className="text-left">
                  <span className="font-medium text-sm block">{comp.name}</span>
                  <span className="text-xs text-white/40">@{comp.handle}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Tweets</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  {competitorStats[comp.name]?.totalTweets || 0}
                </span>
              </div>
              {competitorStats[comp.name] && (
                <div className="mt-2 text-xs text-white/40">
                  {competitorStats[comp.name].totalEngagement.toLocaleString()} engagements
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Twitter size={20} className="text-blue-400" />
                Live Activity Feed
                {loading && <span className="pulse text-xs text-amber-400">● Fetching...</span>}
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search tweets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm w-48 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                >
                  <option value="all">All Types</option>
                  <option value="partnership">Partnerships</option>
                  <option value="campaign">Campaigns</option>
                  <option value="content">Content</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 scroll-fade" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredTweets.length === 0 && !loading && (
                <div className="glass-card rounded-xl p-8 text-center text-white/50">
                  {error ? 'Failed to load tweets' : 'No tweets found. Click Refresh to fetch data.'}
                </div>
              )}
              
              {filteredTweets.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-4 activity-card transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{competitors.find(c => c.name === item.competitor)?.logo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.competitor}</span>
                          <span className="text-xs text-white/40">@{item.competitorHandle}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                            {item.type}
                          </span>
                        </div>
                        <p className="text-white/80 mt-1 text-sm">{item.title}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(item.impact)}`}>
                      {item.impact} impact
                    </span>
                  </div>
                  
                  {/* Engagement metrics */}
                  <div className="flex items-center gap-4 ml-10 mt-3 text-xs text-white/50">
                    <span>❤️ {item.likes.toLocaleString()}</span>
                    <span>🔁 {item.retweets.toLocaleString()}</span>
                    <span>💬 {item.replies.toLocaleString()}</span>
                    <span>👁️ {item.views.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between ml-10 mt-2">
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Twitter size={12} />
                        {item.source}
                      </span>
                    </div>
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      View tweet <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Engagement Summary */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                Engagement Summary
              </h3>
              <div className="space-y-3">
                {Object.entries(competitorStats)
                  .sort((a, b) => b[1].totalEngagement - a[1].totalEngagement)
                  .map(([name, stats]) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{competitors.find(c => c.name === name)?.logo}</span>
                      <span className="text-sm">{name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-emerald-400">
                        {stats.totalEngagement.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/40">engagements</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Breakdown */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText size={16} className="text-amber-500" />
                Activity Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(competitorStats).map(([name, stats]) => (
                  <div key={name} className="py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{competitors.find(c => c.name === name)?.logo}</span>
                        <span className="text-sm">{name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-6">
                      <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400">
                        {stats.partnerships} partnerships
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                        {stats.campaigns} campaigns
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High Impact Alerts */}
            <div className="glass-card rounded-xl p-4 border-amber-500/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" />
                High Impact Alerts
              </h3>
              <div className="space-y-2">
                {filteredTweets
                  .filter(t => t.impact === 'high')
                  .slice(0, 3)
                  .map(tweet => (
                    <div key={tweet.id} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
                      <span className="text-red-400 font-medium">{tweet.competitor}:</span>
                      <span className="text-white/70 ml-1">{tweet.title.slice(0, 60)}...</span>
                    </div>
                  ))}
                {filteredTweets.filter(t => t.impact === 'high').length === 0 && (
                  <div className="text-xs text-white/40 text-center py-2">
                    No high impact alerts
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}