'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Spinner, Modal, Toggle, Select, useToast } from '@/components/ui';
import { settingsService } from '@/services/proxy';
import { ProxyProvider, ProxyType } from '@/lib/types';
import { Shield, Plus, Globe, Settings2, Trash2, CheckCircle, AlertCircle, Server } from 'lucide-react';

export default function ProxySection() {
  const [providers, setProviders] = useState<ProxyProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const [isTesting, setIsTesting] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ProxyProvider>>({
    name: '',
    type: ProxyType.RESIDENTIAL,
    endpoint: '',
    auth: { username: '', password: '', apiKey: '' },
    rotationEnabled: true,
  });

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    setLoading(true);
    const resp = await settingsService.getProxyProviders();
    if (resp.success && resp.data) {
      setProviders(resp.data);
    }
    setLoading(false);
  }

  const handleTest = async (id: string) => {
    setIsTesting(id);
    const resp = await settingsService.testProxyProvider(id);
    setIsTesting(null);
    
    if (resp.success) {
      toastSuccess('Connection Success', 'Proxy provider linked and verified successfully.');
    } else {
      toastError('Connection Failed', resp.error || 'The proxy endpoint is unreachable.');
    }
  };

  const handleSave = async () => {
     const resp = await settingsService.saveProxyProvider(formData);
     if (resp.success) {
        toastSuccess('Provider Saved', 'Proxy configuration updated in your workspace.');
        loadProviders();
        setIsModalOpen(false);
        setFormData({
            name: '',
            type: ProxyType.RESIDENTIAL,
            endpoint: '',
            auth: { username: '', password: '', apiKey: '' },
            rotationEnabled: true,
        });
     } else {
        toastError('Save Failed', resp.error || 'Unable to save proxy provider.');
     }
  };

  if (loading) return <Spinner size="lg" className="mx-auto block my-12" label="Loading providers..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Proxy Providers</h2>
          <p className="text-sm text-slate-500 mt-1">Configure custom proxy networks for undetected scraping.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />} className="shadow-sm">
          Add Provider
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="p-6 border-slate-200 hover:border-brand-200 transition-all group overflow-hidden relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-brand-50 rounded-xl text-brand-600 border border-brand-100">
                <Globe size={24} />
              </div>
              <div className="flex gap-2">
                 <Badge variant="neutral" size="sm">{provider.type}</Badge>
                 {provider.rotationEnabled && <Badge variant="success" size="sm" dot>Rotating</Badge>}
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="font-bold text-lg text-slate-900 truncate">{provider.name}</h3>
              <p className="text-xs text-slate-400 font-mono truncate">{provider.endpoint}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <div className="flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="text-xs h-8"
                    isLoading={isTesting === provider.id}
                    onClick={() => handleTest(provider.id)}
                  >
                    Test Connection
                  </Button>
               </div>
               
               <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 !p-0 text-slate-400 hover:text-slate-900">
                     <Settings2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 !p-0 text-slate-400 hover:text-danger-600">
                     <Trash2 size={16} />
                  </Button>
               </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Provider Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Proxy Provider" size="md">
         <div className="space-y-6 pt-4 pb-2">
            <Input 
               label="Provider Name" 
               placeholder="e.g. My Residential Proxy" 
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Select 
                 label="Proxy Type"
                 options={[
                    { value: ProxyType.RESIDENTIAL, label: 'Residential' },
                    { value: ProxyType.DATACENTER, label: 'Datacenter' }
                 ]}
                 value={formData.type}
                 onChange={(e) => setFormData({...formData, type: e.target.value as ProxyType})}
              />
              <Input 
                 label="Endpoint" 
                 placeholder="proxy.example.com:8080" 
                 value={formData.endpoint}
                 onChange={(e) => setFormData({...formData, endpoint: e.target.value})}
              />
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
               <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield size={16} className="text-slate-400" />
                  Authentication
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Username (optional)" 
                    placeholder="user123" 
                    value={formData.auth?.username}
                    onChange={(e) => setFormData({...formData, auth: {...formData.auth!, username: e.target.value}})}
                  />
                  <Input 
                    label="Password (optional)" 
                    type="password"
                    placeholder="••••••••" 
                    value={formData.auth?.password}
                    onChange={(e) => setFormData({...formData, auth: {...formData.auth!, password: e.target.value}})}
                  />
               </div>
               <div className="flex items-center justify-between py-2 bg-slate-25 rounded-lg px-4 border border-slate-100">
                  <div className="flex flex-col">
                     <span className="text-sm font-semibold text-slate-900">Automatic Rotation</span>
                     <span className="text-xs text-slate-500">Let ScrapeFlow handle IP switching automatically</span>
                  </div>
                  <Toggle 
                    enabled={formData.rotationEnabled || false} 
                    onChange={(enabled) => setFormData({...formData, rotationEnabled: enabled})} 
                  />
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button onClick={handleSave} disabled={!formData.name || !formData.endpoint}>Save Provider</Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
