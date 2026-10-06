import React, { useState } from 'react';
import { OFFICIAL_CS_STAFF, INQUIRY_TEMPLATES, buildWhatsAppLink } from '../data/csContacts';
import { CSContact } from '../types';
import { X, MessageSquare, PhoneCall, ExternalLink, CheckCircle } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProduct?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  prefilledProduct,
}) => {
  const [selectedStaff, setSelectedStaff] = useState<CSContact>(OFFICIAL_CS_STAFF[0]);
  const [selectedTopic, setSelectedTopic] = useState<string>(
    prefilledProduct ? 'custom' : INQUIRY_TEMPLATES[0].id
  );
  const [customNotes, setCustomNotes] = useState<string>(
    prefilledProduct ? `Hello, I would like to inquire about availability and specifications for Higold: ${prefilledProduct}` : ''
  );

  if (!isOpen) return null;

  const getWhatsAppLink = () => {
    let message = '';
    if (selectedTopic === 'custom' || prefilledProduct) {
      message = customNotes || `Hello ${selectedStaff.name}, I would like to inquire about official Higold hardware products.`;
    } else {
      const template = INQUIRY_TEMPLATES.find((t) => t.id === selectedTopic);
      message = template 
        ? template.text.replace('[NAMA_CS]', `${selectedStaff.name}`)
        : `Hello ${selectedStaff.name}, I would like to inquire about official Higold hardware products.`;
    }

    return buildWhatsAppLink(selectedStaff.whatsappNumber, message);
  };

  const whatsappHref = getWhatsAppLink();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto font-sans">
      <div 
        className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden my-8 rounded-2xl border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-[#25D366] rounded-lg border border-emerald-200">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Official WhatsApp Support
              </h2>
              <p className="text-xs text-slate-500">
                Direct communication with Higold technical representatives
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 cursor-pointer rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 bg-white">
          {/* Staff Selection Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
              1. Select Official Representative:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICIAL_CS_STAFF.map((staff) => {
                const isSelected = selectedStaff.id === staff.id;
                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => setSelectedStaff(staff)}
                    className={`p-3.5 border text-left transition-all cursor-pointer flex items-start gap-3 rounded-xl ${
                      isSelected
                        ? 'bg-neutral-100 border-[#D4AF37] shadow-xs ring-1 ring-[#D4AF37]'
                        : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="w-10 h-10 bg-neutral-950 flex items-center justify-center font-bold text-[#D4AF37] text-sm shrink-0 rounded-lg">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-sm">
                          {staff.name}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                        )}
                      </div>
                      <div className="text-[11px] text-[#D4AF37] font-semibold mt-0.5">
                        {staff.role}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {staff.specialty}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {staff.phone}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Topics */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              2. Topik Konsultasi:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INQUIRY_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTopic(tmpl.id)}
                  className={`p-2.5 text-xs text-left border transition-all cursor-pointer rounded-lg ${
                    selectedTopic === tmpl.id
                      ? 'bg-neutral-100 text-neutral-900 border-[#D4AF37] font-bold'
                      : 'bg-white text-slate-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview or Custom input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
              3. Message to Send:
            </label>
            <textarea
              rows={3}
              value={
                selectedTopic === 'custom' || prefilledProduct
                  ? customNotes
                  : INQUIRY_TEMPLATES.find((t) => t.id === selectedTopic)?.text.replace('[NAMA_CS]', `${selectedStaff.name}`) || ''
              }
              onChange={(e) => {
                setSelectedTopic('custom');
                setCustomNotes(e.target.value);
              }}
              className="w-full bg-white border border-slate-300 text-xs text-slate-800 p-3 focus:border-[#25D366] focus:outline-none rounded-lg font-sans"
              placeholder="Type your inquiry or dimension question..."
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer no-underline rounded-lg"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>Buka Chat WhatsApp Resmi dengan {selectedStaff.name}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>
            <p className="text-[11px] text-slate-500 text-center mt-2.5">
              Official operating hours: Monday – Saturday 08:30 – 18:00 WIB. Inquiries sent after hours will be answered the next business morning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
