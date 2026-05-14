"use client";

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { useGetReportById } from '@/modules/resume/hooks/report';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export default function InterviewPage() {
  // sample report - replace with fetch/props as needed

    const params = useParams()

    const { data, isLoading } = useGetReportById(params.interviewId)

  const report = data?.data || {
  technicalQuestions: [],
  behavioralQuestions: [],
  preparationPlan: [],
  skillGaps: [],
  matchScore: 0
}


  const [selected, setSelected] = useState('technical');

  if(isLoading){
    return (
      <main className='h-screen flex justify-center items-center'>
        <div>Loading... <Spinner /></div>
      </main>
    )
  }

  const renderAccordion = (items) => {
    return (
      <div className="space-y-4">
        {items.map((item, idx) => (
          <details key={idx} className="group bg-zinc-800 rounded-lg border border-zinc-700">
            <summary className="flex justify-between items-center px-4 py-3 cursor-pointer select-none">
              <span className="font-medium text-zinc-100"><span className='bg-red-800/20 p-0.5 rounded-sm border border-red-700 text-red-800'>Q{idx + 1}:</span> {item.question}</span>
              <span className="transition-transform duration-200 group-open:rotate-180 dark:text-white text-red-500">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-zinc-200">
                <Label className={"bg-blue-700/20 text-blue-500 border border-blue-500 inline-block p-0.5 rounded-sm text-xs"}>INTENTION</Label> 
              <p className="text-sm text-zinc-400 italic mb-2">{item.intention}</p>

              <Label className={"bg-green-700/20 text-green-500 border border-green-500 inline-block p-0.5 rounded-sm text-xs"}>ANSWER</Label> 
              <p className="">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (selected === 'technical') {
      return (
        <div className="p-4 overflow-y-auto h-full">
          {renderAccordion(report.technicalQuestions)}
        </div>
      );
    }
    if (selected === 'behavioral') {
      return (
        <div className="p-4 overflow-y-auto h-full">
          {renderAccordion(report.behavioralQuestions)}
        </div>
      );
    }
    if (selected === 'roadmap') {
      return (
        <div className="p-4 overflow-y-auto h-full">
          <div className="relative pl-12">
            {report.preparationPlan.map((day, i) => (
              <div key={i} className="mb-8 relative">
                <span className="absolute -left-10 top-1 w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2" />
                <h3 className="font-semibold text-lg text-zinc-100">{day.day}</h3>
                <p className="text-zinc-300 italic mb-2">{day.focus}</p>
                <ul className="list-disc ml-6 space-y-1 text-zinc-200">
                  {day.tasks.map((task, ti) => (
                    <li key={ti}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-green-500" />
          </div>
        </div>
      );
    }
  };

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="flex gap-4 bg-zinc-200/90 dark:bg-zinc-900/60 p-4 h-full w-[90vw] py-8">
        {/* left nav */}
        <aside className="flex flex-col space-y-4 w-1/6 text-zinc-700 dark:text-zinc-100">
          <button
            onClick={() => setSelected('technical')}
            className={`text-left px-3 py-2 rounded-lg ${selected === 'technical' ? ' bg-zinc-900 text-zinc-100 dark:bg-zinc-700' : 'hover:bg-zinc-900 dark:hover:bg-zinc-700/60'}`}
          >Technical Questions</button>
          <button
            onClick={() => setSelected('behavioral')}
            className={`text-left px-3 py-2 rounded-lg ${selected === 'behavioral' ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-700' : 'hover:bg-zinc-900 dark:hover:bg-zinc-700/60'}`}
          >Behavioral Questions</button>
          <button
            onClick={() => setSelected('roadmap')}
            className={`text-left px-3 py-2 rounded-lg ${selected === 'roadmap' ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-700' : 'hover:bg-zinc-900 dark:hover:bg-zinc-700/60'}`}
          >Road Map</button>
        </aside>

        {/* main content */}
        <section className="flex-1 bg-zinc-800 rounded-lg overflow-hidden">
          {renderContent()}
        </section>

        {/* right panel */}
        <aside className="flex flex-col justify-start space-y-6 w-1/5 text-zinc-100">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-8 border-green-500"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                {Math.round(report.matchScore)}%
              </div>
            </div>
            <p className="mt-2 text-sm text-zinc-700/90 dark:text-zinc-400">Strong match for this role</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-zinc-700 dark:text-zinc-200">Skill gaps</h3>
            <div className="flex flex-col gap-2">
              {report.skillGaps.map((s, i) => {
                let colors = 'border-yellow-600 text-yellow-600 bg-yellow-100/20';
                if (s.severity === 'medium') colors = 'border-orange-600 text-orange-600 bg-orange-400/20';
                if (s.severity === 'low') colors = 'border-green-600 text-green-600 bg-green-400/20';
                return (
                  <span key={i} className={`${colors} border px-3 py-1 rounded-full text-xs`}>{s.skill}</span>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>

  );
}