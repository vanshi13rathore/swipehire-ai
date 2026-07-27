import * as React from "react";
import type { ResumeData } from "@/lib/supabase/types";
import { MapPin, Phone, Mail, Link as LinkIcon } from "lucide-react";

export function LivePreview({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-black shadow-xl mx-auto overflow-hidden w-full max-w-[21cm] min-h-[29.7cm] flex flex-col p-8 sm:p-12 print:p-0 print:shadow-none print:w-[21cm] print:h-[29.7cm]">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{data.header.name || "YOUR NAME"}</h1>
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-gray-600">
          {data.header.email && (
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {data.header.email}</span>
          )}
          {data.header.phone && (
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {data.header.phone}</span>
          )}
          {data.header.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {data.header.location}</span>
          )}
        </div>
        {data.links && data.links.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-3 text-sm text-gray-600 mt-1">
            {data.links.map((link) => (
              <a key={link.id} href={link.url} className="flex items-center gap-1 hover:underline">
                <LinkIcon className="w-3.5 h-3.5" /> {link.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Professional Summary</h2>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3 pb-1">Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.title}</h3>
                  <span className="text-sm text-gray-600 font-medium">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm italic">{exp.company}</span>
                  <span className="text-sm text-gray-600">{exp.location}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3 pb-1">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{edu.degree}</h3>
                  <span className="text-sm text-gray-600 font-medium">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm italic">{edu.school}</span>
                  <span className="text-sm text-gray-600">{edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="text-sm">
                {skill}{index < data.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3 pb-1">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">
                    {proj.name}
                    {proj.url && (
                      <span className="font-normal text-sm ml-2 text-blue-600 hover:underline">
                        <a href={proj.url}>{proj.url}</a>
                      </span>
                    )}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements & Certifications */}
      <div className="grid grid-cols-2 gap-6">
        {data.achievements && data.achievements.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Achievements</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.achievements.map((achieve, i) => (
                <li key={i}>{achieve}</li>
              ))}
            </ul>
          </div>
        )}
        
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Certifications</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.certifications.map((cert, i) => (
                <li key={i}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
