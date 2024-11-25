import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText, FolderOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TextEditor = () => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const { toast } = useToast();

  const handleSave = () => {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and click it to download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "File Saved",
      description: `Saved as ${fileName}`,
    });
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === 'string') {
            setContent(text);
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleOpen}
          >
            <FolderOpen className="w-4 h-4 mr-1" />
            Open
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[calc(100vh-10rem)] w-full resize-none border-0 focus-visible:ring-0 bg-transparent"
          placeholder="Start typing..."
        />
      </ScrollArea>
    </div>
  );
};

export default TextEditor;
