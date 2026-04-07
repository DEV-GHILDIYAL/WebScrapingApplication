'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Spinner, Modal, useToast } from '@/components/ui';
import { AlertCircle, Copy, Key, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import { settingsService } from '@/services/proxy';
import { ApiKey } from '@/lib/types';
import { format } from 'date-fns';

export default function ApiKeySection() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<import('@/lib/types').ApiKey | null>(null);
  const { success: toastSuccess, info: toastInfo } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    setLoading(true);
    const resp = await settingsService.getApiKeys();
    if (resp.success && resp.data) {
      setKeys(resp.data);
    }
    setLoading(false);
  }

  const handleCreate = async () => {
    setIsCreating(true);
    const resp = await settingsService.createApiKey(newKeyName);
    if (resp.success && resp.data) {
      setGeneratedKey(resp.data);
      setKeys(prev => [resp.data!, ...prev]);
      toastSuccess('Key Generated', 'A new master API key has been added to your account.');
    }
    setIsCreating(false);
  };

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    toastInfo('Copied to Clipboard', id === 'generated' ? 'New secret key copied.' : `${keys.find(k => k.id === id)?.name} key copied.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <Spinner size="lg" className="mx-auto block my-12" label="Loading API keys..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">API Access Keys</h2>
          <p className="text-sm text-slate-500 mt-1">Authenticate your scrapers via the ScrapeFlow REST API.</p>
        </div>
        <Button onClick={() => {
            setGeneratedKey(null);
            setNewKeyName('');
            setIsModalOpen(true);
        }} leftIcon={<Key size={18} />}>
          Generate New Key
        </Button>
      </div>

      {/* Security Warning */}
      <div className="bg-warning-50 border border-warning-100 rounded-xl p-4 flex gap-4">
         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warning-600 shadow-sm flex-shrink-0">
            <AlertCircle size={20} />
         </div>
         <div>
            <h4 className="text-sm font-bold text-warning-900">Security Best Practice</h4>
            <p className="text-xs text-warning-800 leading-relaxed mt-1">
               Never share your API keys in frontend code or public repositories. Use environment variables and server-side execution to keep your credentials secure.
            </p>
         </div>
      </div>

      {/* Keys List */}
      <Card className="border-slate-200 overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Key Name</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Secret Key</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Used</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {keys.map((key) => (
                     <tr key={key.id} className="hover:bg-slate-25 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900">{key.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{key.id}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 group">
                              <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">
                                 {key.key.startsWith('sf_key_') ? `${key.key.substring(0, 10)}****************` : key.key}
                              </code>
                              <button 
                                onClick={() => handleCopy(key.key, key.id)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-brand-600 transition-all opacity-0 group-hover:opacity-100"
                              >
                                {copiedId === key.id ? <CheckCircle size={14} /> : <Copy size={14} />}
                              </button>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs text-slate-500">
                              {format(new Date(key.createdAt), 'MMM dd, yyyy')}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs text-slate-500 italic">
                              {key.lastUsedAt ? format(new Date(key.lastUsedAt), 'MMM dd, HH:mm') : 'Never used'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="sm" className="h-8 w-8 !p-0 text-slate-400 hover:text-danger-600">
                              <Trash2 size={16} />
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

      <div className="flex justify-center py-4">
         <a href="/docs/api" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors group">
            Check API Documentation <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
         </a>
      </div>

      {/* Generate Key Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate New API Key" size="md">
         <div className="pt-4 pb-2">
            {!generatedKey ? (
               <div className="space-y-6">
                  <Input 
                    label="Key Identifier" 
                    placeholder="e.g. Production Frontend" 
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                     <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                     <Button onClick={handleCreate} isLoading={isCreating} disabled={!newKeyName}>Generate Key</Button>
                  </div>
               </div>
            ) : (
               <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-success-50 border border-success-100 rounded-xl text-center">
                     <h4 className="text-success-800 font-bold mb-1">Key Generated Successfully!</h4>
                     <p className="text-[11px] text-success-700">Copy this key now. For your security, we won&apos;t show it again.</p>
                  </div>
                  <div className="relative group">
                     <input 
                        type="text" 
                        readOnly 
                        value={generatedKey.key}
                        className="w-full bg-slate-900 text-brand-400 font-mono text-sm p-4 pr-12 rounded-xl border-none shadow-inner"
                     />
                     <button 
                        onClick={() => handleCopy(generatedKey.key, 'generated')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                     >
                        {copiedId === 'generated' ? <CheckCircle size={20} /> : <Copy size={20} />}
                     </button>
                  </div>
                  <Button className="w-full" onClick={() => setIsModalOpen(false)}>I have copied the key</Button>
               </div>
            )}
         </div>
      </Modal>
    </div>
  );
}
