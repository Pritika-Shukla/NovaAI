import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

interface Message {
  role: string;
  content: string;
}

interface AssistantConfig {
  model?: {
    provider?: string;
    model?: string;
    messages?: Message[];
  };
  [key: string]: unknown;
}

interface VapiWidgetProps {
  apiKey: string;
  assistantId: string;
  theme?: 'light' | 'dark';
  mode?: 'text' | 'voice';
  assistantConfig?: AssistantConfig;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({
  apiKey,
  assistantId,
  theme = 'light',
  mode = 'text',
  assistantConfig = {},
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string }>>([]);

  useEffect(() => {
    // Check what system prompt the API receives
    const systemPrompt = assistantConfig?.model?.messages?.find(
      (msg: Message) => msg.role === 'system'
    )?.content;
    
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => setIsConnected(true));
    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });
    vapiInstance.on('speech-start', () => setIsSpeaking(true));
    vapiInstance.on('speech-end', () => setIsSpeaking(false));
    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript((prev) => [...prev, { role: message.role, text: message.transcript }]);
      }
    });
    vapiInstance.on('error', console.error);

    return () => {
      vapiInstance.stop();
    };
  }, [apiKey, theme, mode, assistantConfig]);

  const startCall = () => {
    // Check what's being sent when starting the call
    const systemPrompt = assistantConfig?.model?.messages?.find(
      (msg: Message) => msg.role === 'system'
    )?.content;
    if (assistantConfig && Object.keys(assistantConfig).length > 0) {
      const callConfig = {
        ...assistantConfig,
      };
      (vapi?.start as (config: AssistantConfig) => void)(callConfig);
    } else {
      vapi?.start(assistantId);
    }
  };
  const endCall = () => vapi?.stop();

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {!isConnected ? (
        <button onClick={startCall} style={{ background: '#12A594', color: '#fff', padding: '16px 24px', borderRadius: '50px' }}>
          🎤 Talk to Assistant
        </button>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', width: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span>{isSpeaking ? 'Assistant Speaking...' : 'Listening...'}</span>
            <button onClick={endCall} style={{ background: '#ff4444', color: '#fff', padding: '6px 12px', borderRadius: '6px' }}>End Call</button>
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#f8f9fa', padding: '8px', borderRadius: '8px' }}>
            {transcript.map((msg, i) => (
              <div key={i} style={{ marginBottom: '8px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <span style={{
                  background: msg.role === 'user' ? '#12A594' : '#333',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  display: 'inline-block',
                  fontSize: '14px',
                  maxWidth: '80%',
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VapiWidget;
