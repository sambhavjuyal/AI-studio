import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Globe, 
  RefreshCw,
  Building,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { JobListing, GroundingSource } from '../types';
import { formatINR } from '../utils/currency';

interface JobSearchPortalProps {
  targetDeficit: number;
  userCity: string;
}

export const JobSearchPortal: React.FC<JobSearchPortalProps> = ({
  targetDeficit,
  userCity,
}) => {
  const [searchTerm, setSearchTerm] = useState('Remote technical support, customer operations, or copywriting');
  const [selectedCategory, setSelectedCategory] = useState('Remote Support & Ops');
  const [selectedWorkType, setSelectedWorkType] = useState('Remote');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { label: 'Remote Support & Ops', query: 'Remote part-time customer support or operations specialist' },
    { label: 'Tech & React Dev', query: 'Part-time remote frontend react developer or QA tester' },
    { label: 'Content & SEO', query: 'Freelance copywriting content reviewer or editor' },
    { label: 'Virtual Assistant & Admin', query: 'Remote executive assistant or data operations coordinator' },
    { label: 'Flexible Weekend Roles', query: 'Flexible weekend remote moderator or specialist' },
  ];

  const searchJobs = async (customQuery?: string) => {
    setLoading(true);
    setError(null);

    const queryToUse = customQuery || searchTerm;

    try {
      const res = await fetch('/api/ai/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse,
          location: selectedWorkType === 'Remote' ? 'Remote / Work From Home' : `${userCity} or Remote`,
          targetDeficit,
          category: selectedCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to search job portals via Google.');
      }

      setJobs(data.data.jobs || []);
      setSummary(data.data.summary || '');
      setSources(data.sources || []);
    } catch (err: any) {
      setError(err?.message || 'Error fetching jobs from portals.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial search on mount
  useEffect(() => {
    searchJobs('Remote customer support, editorial review, or part-time QA');
  }, []);

  const getPortalBadgeColor = (portalName: string) => {
    const p = portalName.toLowerCase();
    if (p.includes('linkedin')) return 'bg-[#0077b5]/10 text-[#0077b5] border-[#0077b5]/30';
    if (p.includes('indeed')) return 'bg-[#2164f3]/10 text-[#2164f3] border-[#2164f3]/30';
    if (p.includes('remoteok')) return 'bg-[#ff4742]/10 text-[#ff4742] border-[#ff4742]/30';
    if (p.includes('wellfound')) return 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30';
    if (p.includes('weworkremotely')) return 'bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30';
    return 'bg-[#635bff]/10 text-[#635bff] border-[#635bff]/30';
  };

  return (
    <div className="py-12 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00d4ff] bg-cyan-50 px-2.5 py-1 rounded-md mb-2">
              <Globe className="w-3.5 h-3.5 text-cyan-600" />
              <span className="text-cyan-800">Google Grounded Job Portal Radar</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a2540] tracking-tight">
              Bridge Your Inflation Deficit via Specific Job Portals
            </h2>
            <p className="text-[#425466] text-base mt-1 max-w-2xl">
              Searches live job listings across LinkedIn, Indeed, RemoteOK, and Wellfound using Google Search grounding. Target flexible hours to neutralize your cost-of-living drag.
            </p>
          </div>

          {/* Deficit Callout Pill */}
          <div className="self-start md:self-end bg-gradient-to-r from-indigo-50 to-pink-50 p-3.5 rounded-xl border border-indigo-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#635bff] text-white flex items-center justify-center font-bold text-base shadow-xs">
              ₹
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Monthly Target Needed:</span>
              <span className="text-lg font-black text-[#0a2540]">
                +{formatINR(targetDeficit)}{' '}
                <span className="text-xs font-normal text-slate-400">/mo to break even</span>
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Category Chips */}
        <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200/80 mb-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
                placeholder="Search job title, skills, or portal (e.g. Remote React Developer on Naukri / LinkedIn)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] text-[#0a2540] font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedWorkType}
                onChange={(e) => setSelectedWorkType(e.target.value)}
                className="text-xs font-semibold text-[#0a2540] bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#635bff]/30"
              >
                <option value="Remote">100% Remote</option>
                <option value="Hybrid">Hybrid / City Metro</option>
              </select>

              <button
                onClick={() => searchJobs()}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#635bff] hover:bg-[#544dc9] shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Find Portals</span>
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 mr-1">Quick Portfolios:</span>
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  setSelectedCategory(cat.label);
                  setSearchTerm(cat.query);
                  searchJobs(cat.query);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.label
                    ? 'bg-[#635bff] text-white border-[#635bff] shadow-2xs'
                    : 'bg-white text-[#425466] border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Search summary */}
        {summary && (
          <div className="mb-6 p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs text-[#0a2540]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#635bff] shrink-0" />
              <span>{summary}</span>
            </div>
            <span className="text-[11px] text-[#64748b] hidden sm:inline">
              Grounded via Google Search Engine
            </span>
          </div>
        )}

        {/* Job Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            // Calculate how many hours needed at this pay rate to bridge target deficit
            let hoursNeeded = 12;
            const matchHourly = job.payRate?.match(/(?:₹|\$)?\s*(\d+[\d,]*)/);
            if (matchHourly) {
              const rate = parseInt(matchHourly[1].replace(/,/g, ''), 10);
              if (rate > 0) {
                hoursNeeded = Math.ceil(targetDeficit / rate);
              }
            }

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 stripe-card-glow stripe-card-glow-hover flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  {/* Top Bar: Portal Pill + Commitment */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getPortalBadgeColor(job.portalName)}`}>
                      {job.portalName}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {job.workType} • {job.commitment}
                    </span>
                  </div>

                  {/* Title and Company */}
                  <h3 className="text-base font-bold text-[#0a2540] group-hover:text-[#635bff] transition-colors leading-snug mb-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#425466] mb-3">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{job.company}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#64748b] leading-relaxed mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Skill Badges */}
                  {job.keySkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.keySkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-semibold text-[#0a2540] bg-slate-100/90 px-2 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Card Area */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  
                  {/* Pay Rate & Deficit Offset */}
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Compensation</span>
                      <span className="text-base font-extrabold text-[#0a2540]">{job.payRate}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 block">Deficit Offset</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        ~{hoursNeeded} hrs/mo to bridge
                      </span>
                    </div>
                  </div>

                  {/* Direct Job Portal Link */}
                  <a
                    href={job.portalUrl.startsWith('http') ? job.portalUrl : `https://${job.portalUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#0a2540] bg-slate-50 hover:bg-[#635bff] hover:text-white border border-slate-200 hover:border-[#635bff] transition-all cursor-pointer group"
                  >
                    <span>View on {job.portalName}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                </div>
              </div>
            );
          })}
        </div>

        {/* Google Grounding Sources Bar */}
        {sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Google Grounded Job Portal Citations:
            </span>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#635bff] hover:text-[#544dc9] bg-slate-50 hover:bg-indigo-50/50 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{source.title || 'Verified Job Portal Source'}</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
