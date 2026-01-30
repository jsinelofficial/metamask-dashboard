import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, ExternalLink, Bell, Filter, ChevronDown, Globe, Megaphone, Users, FileText, Calendar, AlertCircle } from 'lucide-react';

const competitors = [
  { id: 1, name: 'Phantom', logo: '👻', color: '#AB9FF2' },
  { id: 2, name: 'Coinbase Wallet', logo: '🔵', color: '#0052FF' },
  { id: 3, name: 'Trust Wallet', logo: '🛡️', color: '#3375BB' },
  { id: 4, name: 'Rainbow', logo: '🌈', color: '#FF6B6B' },
  { id: 5, name: 'Rabby', logo: '🐰', color: '#8697FF' },
];

const activityData = [
  { id: 1, competitor: 'Phantom', type: 'partnership', title: 'Partnership with Magic Eden announced', date: '2 hours ago', impact: 'high', details: 'Exclusive NFT marketplace integration with reduced fees for Phantom users', source: 'Twitter' },
  { id: 2, competitor: 'Coinbase Wallet', type: 'campaign', title: 'New TV ad campaign launched in US', date: '5 hours ago', impact: 'high', details: '$15M campaign focusing on security messaging, targeting 25-45 demographic', source: 'AdAge' },
  { id: 3, competitor: 'Trust Wallet', type: 'content', title: 'Published DeFi education series', date: '1 day ago', impact: 'medium', details: '12-part video series on YouTube targeting beginners, 50k views in first 24h', source: 'YouTube' },
  { id: 4, competitor: 'Rainbow', type: 'partnership', title: 'Integrated with Uniswap mobile', date: '1 day ago', impact: 'medium', details: 'Deep linking integration allowing seamless swaps from Rainbow app', source: 'Blog' },
  { id: 5, competitor: 'Phantom', type: 'content', title: 'Solana ecosystem report released', date: '2 days ago', impact: 'low', details: 'Comprehensive report on Solana DeFi growth, establishing thought leadership', source: 'Blog' },
  { id: 6, competitor: 'Rabby', type: 'campaign', title: 'Twitter Spaces AMA series', date: '3 days ago', impact: 'medium', details: 'Weekly AMA sessions with 2-3k average listeners, focusing on security features', source: 'Twitter' },
  { id: 7, competitor: 'Coinbase Wallet', type: 'partnership', title: 'Base chain exclusive features', date: '4 days ago', impact: 'high', details: 'Early access to Base ecosystem airdrops for Coinbase Wallet users', source: 'Press Release' },
];

const contentMetrics = [
  { competitor: 'Phantom', blogPosts: 12, socialPosts: 156, videos: 8, podcasts: 2, trend: 'up' },
  { competitor: 'Coinbase Wallet', blogPosts: 8, socialPosts: 203, videos: 15, podcasts: 6, trend: 'up' },
  { competitor: 'Trust Wallet', blogPosts: 15, socialPosts: 89, videos: 22, podcasts: 0, trend: 'down' },
  { competitor: 'Rainbow', blogPosts: 6, socialPosts: 78, videos: 4, podcasts: 1, trend: 'stable' },
  { competitor: 'Rabby', blogPosts: 4, socialPosts: 45, videos: 2, podcasts: 0, trend: 'up' },
];

const partnershipData = [
  { competitor: 'Phantom', partnerships: ['Magic Eden', 'Jupiter', 'Tensor', 'Marinade'], category: 'Solana DeFi' },
  { competitor: 'Coinbase Wallet', partnerships: ['Base', 'Uniswap', 'OpenSea', 'Aave'], category: 'EVM Ecosystem' },
  { competitor: 'Trust Wallet', partnerships: ['PancakeSwap', 'Binance', '1inch'], category: 'BNB Chain' },
  { competitor: 'Rainbow', partnerships: ['Uniswap', 'ENS', 'Zora'], category: 'Ethereum Native' },
  { competitor: 'Rabby', partnerships: ['DeBank', 'DefiLlama'], category: 'Analytics' },
];

export default function CompetitiveIntelDashboard() {
  const [selectedCompetitor, setSelectedCompetitor] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('30d');

  const filteredActivity = activityData.filter(item => {
    if (selectedCompetitor !== 'all' && item.competitor !== selectedCompetitor) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
              <p className="text-xs text-white/50">MetaMask Growth Team</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">3</span>
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
        {/* Competitor Quick Stats */}
        <div className="grid grid-cols-5 gap-4">
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
                <span className="font-medium text-sm">{comp.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Activity</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  {activityData.filter(a => a.competitor === comp.name).length} items
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Activity Feed</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search activities..."
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

            <div className="space-y-3 scroll-fade" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredActivity.map((item) => (
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
                          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getTypeColor(item.type)}`}>
                            {getTypeIcon(item.type)}
                            {item.type}
                          </span>
                        </div>
                        <p className="text-white/80 mt-1">{item.title}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(item.impact)}`}>
                      {item.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-white/50 ml-10 mb-2">{item.details}</p>
                  <div className="flex items-center justify-between ml-10">
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        {item.source}
                      </span>
                    </div>
                    <button className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                      View source <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Content Volume */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText size={16} className="text-amber-500" />
                Content Volume (30d)
              </h3>
              <div className="space-y-3">
                {contentMetrics.map((item) => (
                  <div key={item.competitor} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span>{competitors.find(c => c.name === item.competitor)?.logo}</span>
                      <span className="text-sm">{item.competitor}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-white/50">Total</div>
                        <div className="text-sm font-mono">{item.blogPosts + item.socialPosts + item.videos}</div>
                      </div>
                      {item.trend === 'up' && <TrendingUp size={14} className="text-emerald-400" />}
                      {item.trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
                      {item.trend === 'stable' && <span className="text-white/30">—</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partnership Map */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users size={16} className="text-violet-500" />
                Partnership Landscape
              </h3>
              <div className="space-y-3">
                {partnershipData.map((item) => (
                  <div key={item.competitor} className="py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{competitors.find(c => c.name === item.competitor)?.logo}</span>
                        <span className="text-sm">{item.competitor}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{item.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-6">
                      {item.partnerships.map((partner) => (
                        <span key={partner} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/70">
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="glass-card rounded-xl p-4 border-amber-500/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500" />
                Alerts
              </h3>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
                  <span className="text-red-400 font-medium">High Priority:</span>
                  <span className="text-white/70 ml-1">Coinbase Wallet TV campaign may impact brand awareness metrics</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                  <span className="text-amber-400 font-medium">Trending:</span>
                  <span className="text-white/70 ml-1">Phantom gaining Solana DeFi market share through integrations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}