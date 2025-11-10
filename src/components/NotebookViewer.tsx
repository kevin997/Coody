'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Code, FileText } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface NotebookCell {
  cell_type: 'code' | 'markdown';
  source: string[];
  outputs?: any[];
  execution_count?: number;
}

interface NotebookData {
  cells: NotebookCell[];
  metadata?: any;
}

interface NotebookViewerProps {
  notebook: NotebookData;
  className?: string;
}

export function NotebookViewer({ notebook, className = '' }: NotebookViewerProps) {
  const [executedCells, setExecutedCells] = useState<Set<number>>(new Set());

  const handleExecuteCell = (index: number) => {
    // This is a placeholder for actual code execution
    // In a real implementation, you would send the code to a backend Python kernel
    setExecutedCells(prev => new Set([...prev, index]));
    console.log('Executing cell:', index);
  };

  const renderCell = (cell: NotebookCell, index: number) => {
    const isExecuted = executedCells.has(index);

    if (cell.cell_type === 'markdown') {
      return (
        <div key={index} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <Badge variant="outline">Markdown</Badge>
          </div>
          <MarkdownRenderer content={cell.source.join('')} />
        </div>
      );
    }

    // Code cell
    return (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <Badge variant="secondary">Python</Badge>
              {cell.execution_count && (
                <span className="text-sm text-muted-foreground">
                  [{cell.execution_count}]
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant={isExecuted ? 'default' : 'outline'}
              onClick={() => handleExecuteCell(index)}
            >
              <Play className="w-4 h-4 mr-2" />
              {isExecuted ? 'Ré-exécuter' : 'Exécuter'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-md overflow-x-auto">
            <code className="language-python">
              {cell.source.join('')}
            </code>
          </pre>

          {/* Output display */}
          {(cell.outputs && cell.outputs.length > 0) || isExecuted ? (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Sortie:</div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
                {isExecuted ? (
                  <div className="text-sm text-muted-foreground">
                    ⚠️ L'exécution de code en temps réel sera disponible prochainement.
                    <br />
                    Cette fonctionnalité nécessite une connexion à un serveur Jupyter Kernel.
                  </div>
                ) : cell.outputs ? (
                  cell.outputs.map((output: any, i: number) => (
                    <div key={i} className="mb-2">
                      {output.text && <pre className="text-sm">{output.text.join('')}</pre>}
                      {output.data && output.data['text/plain'] && (
                        <pre className="text-sm">{output.data['text/plain'].join('')}</pre>
                      )}
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Jupyter Notebook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            {notebook.cells.length} cellules • {notebook.cells.filter(c => c.cell_type === 'code').length} code •{' '}
            {notebook.cells.filter(c => c.cell_type === 'markdown').length} markdown
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {notebook.cells.map((cell, index) => renderCell(cell, index))}
      </div>
    </div>
  );
}
