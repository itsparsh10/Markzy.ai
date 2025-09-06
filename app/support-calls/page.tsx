"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectSupportCalls() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/help-center');
  }, [router]);
  return null;
}

// --- Original Support Calls Page (commented out for future use) ---
//
// import React, { useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import Link from 'next/link';
//
// // Calendar data
// const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
// const currentMonth = "June 2025";
//
// // Sample events data (can be expanded)
// const events = [
//   { id: 1, date: new Date(2025, 5, 5), title: "Marketing Strategy Call", time: "10:00 AM", host: "Sarah Johnson" },
//   { id: 2, date: new Date(2025, 5, 12), title: "Content Planning Session", time: "2:00 PM", host: "Michael Brown" },
//   { id: 3, date: new Date(2025, 5, 18), title: "Campaign Review", time: "11:30 AM", host: "Emily Davis" },
//   { id: 4, date: new Date(2025, 5, 24), title: "Q3 Planning", time: "3:00 PM", host: "Robert Wilson" },
// ];
//
// export default function SupportCalls() {
//   ...
//   return (
//     ...
//   );
// }
