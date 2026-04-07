'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/ui';
import { FieldExtractor, FieldType } from '@/lib/types';
import { Plus, Trash2, Search, Eye, AlertCircle } from 'lucide-react';
import { generateId } from '@/lib/utils';

interface Step2Props {
  fields: FieldExtractor[];
  updateFields: (fields: FieldExtractor[]) => void;
}

export default function Step2FieldExtractor({ fields, updateFields }: Step2Props) {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const addField = () => {
    const newField: FieldExtractor = {
      id: generateId('field_'),
      name: `field_${fields.length + 1}`,
      selector: '',
      type: FieldType.TEXT,
      multiple: false,
      required: true,
    };
    updateFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    updateFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FieldExtractor>) => {
    updateFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const testSelector = (field: FieldExtractor) => {
    setTestingId(field.id);
    // Simulate API delay for selector testing
    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        [field.id]: `Found: "${field.name}_match_value"`
      }));
      setTestingId(null);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Field Extraction</h2>
        <p className="text-sm text-slate-500">Define the data points you want to extract using CSS selectors or XPath.</p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-brand-200 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Field Name"
                    placeholder="title, price, image_url"
                    value={field.name}
                    onChange={(e) => updateField(field.id, { name: e.target.value })}
                  />
                  <Select
                    label="Type"
                    options={[
                      { value: FieldType.TEXT, label: 'Text Content' },
                      { value: FieldType.ATTRIBUTE, label: 'HTML Attribute' },
                      { value: FieldType.HTML, label: 'Outer HTML' },
                    ]}
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <Input
                      label="CSS/XPath Selector"
                      placeholder="e.g. h1.product-title"
                      value={field.selector}
                      onChange={(e) => updateField(field.id, { selector: e.target.value })}
                    />
                  </div>
                  {field.type === FieldType.ATTRIBUTE && (
                    <div className="w-1/3">
                      <Input
                        label="Attribute"
                        placeholder="e.g. src, href"
                        value={field.attribute || ''}
                        onChange={(e) => updateField(field.id, { attribute: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                {testResults[field.id] && (
                  <div className="flex items-center gap-2 p-2 bg-success-50 text-success-700 text-xs rounded border border-success-100">
                    <Eye size={14} />
                    <span>{testResults[field.id]}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col justify-end gap-2 pt-6 md:pt-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => testSelector(field)}
                  isLoading={testingId === field.id}
                  leftIcon={<Search size={14} />}
                  disabled={!field.selector}
                >
                  Test
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-danger-600 hover:text-danger-700 hover:border-danger-200"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.multiple}
                  onChange={(e) => updateField(field.id, { multiple: e.target.checked })}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <span className="text-xs text-slate-600">Extract Multiple Items</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <span className="text-xs text-slate-600">Required Field</span>
              </label>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">No fields defined yet. Add a field to start extracting data.</p>
          </div>
        )}

        <Button
          variant="secondary"
          className="w-full border-dashed border-2 py-6 hover:bg-brand-50 hover:border-brand-200 transition-all"
          onClick={addField}
          leftIcon={<Plus size={18} />}
        >
          Add Field
        </Button>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-8">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-4">Preview Output</h3>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-brand-400 overflow-x-auto shadow-inner">
          <pre>
            {JSON.stringify(
              Object.fromEntries(
                fields.map(f => [f.name, f.multiple ? [`value_1`, `value_2`] : `mock_value`])
              ), 
              null, 
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
