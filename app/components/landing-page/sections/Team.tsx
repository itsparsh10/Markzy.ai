'use client';
import React from 'react';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Pankaj Singh',
    role: ' Chief Technology Officer ',
    image: '/assets/images/pankaj_singh.jpeg',
    linkedin: 'https://www.linkedin.com/in/pankajsinghcnc/',
    twitter: '#',
    email: 'pankaj@markzy.ai'
  },
  {
    name: 'Himanshu Prasad',
    role: 'Cheif Project Manager',
    image: '/assets/images/Himanshu.jpeg',
    linkedin: 'https://www.linkedin.com/in/himanshu-prasad-mba/',
    twitter: '#',
    email: 'himanshu@markzy.ai'
  },
  {
    name: 'Piyush Mahajan',
    role: 'Design Head',
    image: '/assets/images/Piyush.png',
    linkedin: 'https://www.linkedin.com/in/mahajanpiyushdnyaneshwar/',
    twitter: '#',
    email: 'piyush@markzy.ai'
  },
  {
    name: 'Sparsh Sharma',
    role: 'AI Engineer',
    image: '/assets/images/Sparsh.jpeg',
    linkedin: 'https://www.linkedin.com/in/sparshs10/',
    twitter: '#',
    email: 'sparsh@markzy.ai'
  },
  {
    name: 'Tanish Singh',
    role: 'Software Development Engineer',
    image: '/assets/images/tanish.jpeg',
    linkedin: 'https://www.linkedin.com/in/tanishsnghh/',
    twitter: '#',
    email: 'tanish@markzy.ai'
  }
];

export default function Team() {
  return (
    <section id="team" className="pb-8 pt-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="audiowide-regular text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Meet the Team Behind
            <span 
              className="audiowide-regular pb-1 bg-clip-text text-transparent block"
              style={{
                background: 'linear-gradient(to right, #1d1f89, #46adb6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Your Marketing Success
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re a team of marketing experts, engineers, and AI researchers passionate about helping businesses grow.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 max-w-full mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`group bg-white border-2 border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                member.linkedin && member.linkedin !== '#' 
                  ? 'cursor-pointer hover:scale-105' 
                  : ''
              }`}
              onClick={() => {
                if (member.linkedin && member.linkedin !== '#') {
                  window.open(member.linkedin, '_blank');
                }
              }}
            >
              {/* Photo - Large portrait taking most of the card */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-all duration-300"
                />
              </div>

              {/* Content - Minimal text at bottom */}
              <div className=" text-center pb-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
