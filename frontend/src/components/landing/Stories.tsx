'use client';

import React from 'react';

const STORIES = [
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIaZCFluqfadWo-opNU6XIBWg5-8xwD0M-6F-a66ArIhQQ56krUlrt62j78D-ugSbrd3be7Fm2UKJ-8L8dguwrn65l7GCOaF0umLHJY7iVrsZPUAsi8VpNGMArD81fPGDDynOJUPTpkyl6ETnOORJZ_MvV6s4dxJ8va2qRz6WcBVOdzEn0XQE6ietCyM_y_Yprbc9MppF_bbPRzEjJWFUlm-gKfuTFil12D0tUUGzyneDyqGZ-C7Ho',
    tag: 'Unboxing Ritual',
    title: 'Obsidian Box Suite',
    desc: 'Heavy cotton debossed presentation casket handcrafted in Milan.',
    handle: '@vance_partners',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfAQI0wIIbO61yU_3V_N1jNLBL0zhHiu2WKSNQje9U7mCOMCujpNPVnlvuIpTURUSMin22rKQjF2sUhWShTudsMokyqJaea6hKitLiQq0Bh9aSeUTdrpyNLR_UGDqtiXxm-xKQNGqyOi5dkerz9UH30SFRorjLYyU0u5pDShca2-1DyaF-cesILuyMQ4qnmA53FIglVIaBhvK8_Uvyxlga31hRM1-Hhv_Q-_CbSxfs9ybJaFPyvyyk',
    tag: 'Executive Suite',
    title: 'Brushed Aerospace Spec',
    desc: 'Chamfered titanium edges with micro-laser etched insignia.',
    handle: '@elena_rostova',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO651bxu56H4ywzKbhtpQGWl6SDhFDscmEyKri6QLKSQGwoE4CUh6WleDMa9TKyjb8q8yvcO7fKdqBF6uGiDNvTfE2v2KuJ1m4HmLOGWm1uISCp7QAgl4hmKwL-abVEswjK6Jc7JYkWeGevJ6PvzASnBP6H270ajlb7Ch_HICqWgPag8eo-HYNk5lTPcM61WfzDJIXgYOmZsxAxoxmsTmg6KnUGixUitBhDifeSaUO_yCJtssV9S0E',
    tag: 'Summit Exchange',
    title: 'Davos Executive Forum',
    desc: 'Instant relationship handshake under two-tenths of a second.',
    handle: '@global_capital',
  },
  {
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAypxKr-osfc6TKzPFCAop_IW-qbNzGNII3vN8faD7ieL7QLQdp24pMb7fqK990w0Ak3o2d2fzu2AicAV6VR-bz_FcQw5QwR_3Tx33iUQtZgpDX1dVm2gLSgU447a3_BCpKUF2qa24QdUgrkaG6wx2UDLm6qbG5cGVOsfPSdzOVcKnp3Y6KfR5veK0EIA914rJsbMHxIeC1PidKZNDwyk7fVNmZT4XPAoybK3l4basNEPkvFTEoKege',
    tag: 'Fleet Rollout',
    title: 'Venture Fleet Palette',
    desc: 'Harmonized enterprise color codification for regional partners.',
    handle: '@connectnfc',
  },
];

export const Stories: React.FC = () => {
  return (
    <section className="w-full bg-[#f5f0eb] text-[#1c1b1b] py-space-xl">
      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
          <div>
            <span className="font-label-md text-label-md uppercase tracking-[0.24em] text-[#78716c] font-semibold mb-2 block">
              Visual Heritage
            </span>
            <h2
              className="text-display-lg text-[#1c1b1b] leading-tight"
              style={{ fontFamily: "'Rockwell', 'Zilla Slab', 'Arvo', serif", fontWeight: 700 }}
            >
              Latest from Editorial Stories
            </h2>
          </div>
          <p className="font-body-md text-body-md text-[#57534e] max-w-md">
            See how founders, managing partners, and global creatives curate their real-world personal presence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {STORIES.map((s, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden bg-white shadow-sm flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-label-sm text-label-sm tracking-widest uppercase">
                  {s.tag}
                </div>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-title-lg text-title-lg text-[#1c1b1b] font-bold">{s.title}</h3>
                  <p className="font-body-sm text-body-sm text-[#78716c] mt-1 leading-relaxed">{s.desc}</p>
                </div>
                <span className="font-label-sm text-label-sm text-stone-400 uppercase tracking-widest mt-3">
                  {s.handle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
