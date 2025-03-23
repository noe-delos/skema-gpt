/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AlumniTable, AlumniTableSkeleton } from '@/components/AlumniTable';
import ShimmeringTitle from '@/components/ui/animated-text';
import { AuroraText } from '@/components/ui/aurora-text';
import { Alumni } from '@/lib/supabase';
import { useChat } from '@ai-sdk/react';
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import "katex/dist/katex.min.css";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, KeyboardEvent, memo, ReactNode, useEffect, useRef, useState } from 'react';
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface SuggestionButtonProps {
  text: string;
  icon: string;
  onClick: () => void;
  color?: string;
}

const SuggestionButton: React.FC<SuggestionButtonProps> = ({ text, icon, color, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="px-4 py-2 rounded-full bg-[#E43E22]/20 text-[#E43E22] hover:bg-[#E43E22]/10 text-sm flex items-center gap-2"
    onClick={onClick}
  >
    <Icon icon={icon} color={color} className='size-3 opacity-70' />
    {text}
  </motion.button>
);

interface SendButtonProps {
  disabled: boolean;
  type?: "submit" | "button" | "reset";
}

const SendButton: React.FC<SendButtonProps> = ({ disabled, type = "submit" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type={type}
    disabled={disabled}
    className="rounded-full bg-[#E43E22] hover:bg-[#e95136] h-10 w-10 flex items-center justify-center text-white disabled:cursor-not-allowed"
  >
    <Icon icon="fluent:arrow-up-12-filled" width={18} height={18} />
  </motion.button>
);

interface StopButtonProps {
  onClick: () => void;
}

const StopButton: React.FC<StopButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    type="button"
    className="rounded-full bg-zinc-900 h-10 w-10 flex items-center justify-center text-white"
  >
    <Icon icon="solar:stop-bold" width={16} height={16} />
  </button>
);

// Markdown Content Component
interface MarkdownContentProps {
  content: string;
}

const MarkdownContent = memo(({ content }: MarkdownContentProps) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
    rehypePlugins={[rehypeKatex]}
    className="prose prose-sm max-w-none break-words text-black text-[1rem]"
    components={{
      table: ({ children }) => (
        <div className="overflow-x-auto">
          <table className="border-collapse my-4">{children}</table>
        </div>
      ),
      thead: ({ children }) => <thead>{children}</thead>,
      th: ({ children }) => <th className="px-4 py-2 bg-zinc-50 text-zinc-800">{children}</th>,
      td: ({ children }) => <td className="px-4 py-2 text-zinc-700">{children}</td>,
      tr: ({ children }) => <tr>{children}</tr>,
      pre: ({ children }) => <pre className="bg-zinc-50 rounded-lg p-4 overflow-x-auto">{children}</pre>,
      code: ({ children, className }) => {
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
          <code className={className}>{children}</code>
        ) : (
          <code className="bg-zinc-50 text-zinc-800 px-1 py-0.5 rounded text-sm">{children}</code>
        );
      },
    }}
  >
    {content}
  </ReactMarkdown>
));

MarkdownContent.displayName = "MarkdownContent";

interface SuggestionItem {
  text: string;
  icon: string;
  query: string;
  color: string;
}

interface ToolInvocationPart {
  type: 'tool-invocation';
  toolInvocation: {
    toolName: string;
    toolCallId: string;
    state: string;
    args: any;
    result: any;
  };
}

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, stop, reload, status } = useChat({
    maxSteps: 5, // Allows multiple tool invocation steps
  });

  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [hoveringMessage, setHoveringMessage] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  console.log(isAtBottom)
  // Shorter French placeholder text
  const placeholder = "Rechercher des alumnis...";

  // Suggestion button data with icons
  const suggestionData: SuggestionItem[] = [
    {
      text: "Alumni chez BCG",
      icon: "ic:baseline-business-center",
      query: "Trouve des alumni qui travaillent chez Boston Consulting Group (BCG)",
      color: '#0b48c2'
    },
    {
      text: "Promotion 2022",
      icon: "mdi:school",
      query: "Montre-moi les alumni de la promotion 2022",
      color: '#4f3103'
    },
    {
      text: "Consultants à Paris",
      icon: "mdi:eiffel-tower",
      query: "Cherche des consultants basés à Paris",
      color: '#27adf4'
    },
    {
      text: "Alumni chez Roland Berger",
      icon: "mdi:briefcase",
      query: "Qui travaille chez Roland Berger?",
      color: '#000000'
    },
    {
      text: "Senior Consultants",
      icon: "carbon:user-admin",
      query: "Liste des alumni qui sont Senior Consultants",
      color: '#3db800'
    },
    {
      text: "McKinsey & Company",
      icon: "fluent:building-20-filled",
      query: "Trouve des alumni qui travaillent chez McKinsey & Company",
      color: '#ec5a00'
    },
    {
      text: "Alumni à l'international",
      icon: "bxs:plane-alt",
      query: "Cherche des alumni qui travaillent à l'international",
      color: '#008b74'
    },
    {
      text: "Dernière promotion (2024)",
      icon: "ph:graduation-cap-fill",
      query: "Montre-moi les alumni de la promotion 2024",
      color: '#9c0000'
    }
  ];

  // Check if user is at bottom of messages
  const checkIfAtBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const tolerance = 100; // pixels of tolerance
      const atBottom = scrollTop + clientHeight >= scrollHeight - tolerance;
      setIsAtBottom(atBottom);
    }
  };

  // Handle scroll event
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkIfAtBottom);
      return () => container.removeEventListener('scroll', checkIfAtBottom);
    }
  }, []);

  // Auto-resize textarea
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Handle Enter key (submit on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  // Handle form submission
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    // Ensure we scroll to bottom after submitting
    setIsAtBottom(true);
  };

  // Handle suggestion click - now also submits the form
  const handleSuggestion = (suggestion: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = suggestion;
      const event = { target: textareaRef.current } as ChangeEvent<HTMLTextAreaElement>;
      handleInputChange(event);

      // Submit the form after setting the input value
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }, 100);
    }
  };

  // Copy assistant response to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const hasMessages = messages.length > 0;

  // Render tool results
  const renderToolResult = (part: ToolInvocationPart, idx: number, toolCallId: string): ReactNode => {
    const { toolName, state, args, result } = part.toolInvocation;

    if ((toolName === 'searchAlumni' || toolName === 'getRandomAlumni') && state === 'result' && result) {
      let title = toolName === 'getRandomAlumni' ? "Alumnis aléatoires" : "Résultats de recherche";

      // Prepare table title for searchAlumni
      if (toolName === 'searchAlumni') {
        try {
          const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;
          const { city, industry, graduation_year } = parsedArgs;

          if (city || industry || graduation_year) {
            title += ` des Alumni`;
            if (city) title += ` à ${city}`;
            if (industry) title += ` travaillant en ${industry}`;
            if (graduation_year) title += ` de la promo ${graduation_year}`;
          }
        } catch (e) {
          console.error(e)
          // Keep default title if parsing error
        }
      }

      return <AlumniTable key={`${toolCallId}-${idx}`} alumni={result as Partial<Alumni>[]} title={title} />;
    }

    if ((toolName === 'searchAlumni' || toolName === 'getRandomAlumni') && (state === 'call' || state === 'partial-call')) {
      return <AlumniTableSkeleton key={`${toolCallId}-${idx}`} />;
    }

    return null;
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header with logo and avatar */}
      <div className="w-full relative">
        <div className="max-w-5xl mx-auto px-4 py-3">
          {/* Logo and title */}
          <div className="flex items-center space-x-3 fixed top-8 left-8 z-10 cursor-pointer" onClick={() => router.push('/')}>
            <Image src='/logo.png' alt='logo' width={100} height={100} className='size-[1.5rem] sm:h-[2rem] w-full' />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative pt-16">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
          <div className="max-w-5xl mx-auto px-4 pt-4 pb-20">
            {!hasMessages ? (
              // Welcome screen with suggestions
              <div className="py-20 text-center max-w-4xl mx-auto">
                <div className='flex flex-col sm:flex-row items-center size-fit gap-4 mx-auto h-fit mb-14'>
                  <video
                    src='/justine.mp4'
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='h-auto w-24 rounded-full object-cover block sm:hidden'
                  />
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-medium text-zinc-800"
                  >
                    <AuroraText className='text-3xl'>Justine</AuroraText>, l'assistante alumni de Skema.
                  </motion.h2>
                  <video
                    src='/justine.mp4'
                    autoPlay
                    loop
                    muted
                    playsInline
                    className='h-auto w-24 rounded-full object-cover hidden sm:block'
                  />
                </div>                {/* Suggestion buttons - first row */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {suggestionData.slice(3, 6).map((suggestion, index) => (
                    <SuggestionButton
                      key={index}
                      text={suggestion.text}
                      icon={suggestion.icon}
                      color={suggestion.color}
                      onClick={() => handleSuggestion(suggestion.query)}
                    />
                  ))}
                </div>

                {/* Suggestion buttons - second row */}
                <div className="flex flex-wrap gap-2 justify-center mb-16">
                  {suggestionData.slice(0, 3).map((suggestion, index) => (
                    <SuggestionButton
                      key={index + 3}
                      text={suggestion.text}
                      icon={suggestion.icon}
                      color={suggestion.color}
                      onClick={() => handleSuggestion(suggestion.query)}
                    />
                  ))}
                </div>

                {/* Initial input form */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-3xl mx-auto"
                >
                  <form ref={formRef} onSubmit={onSubmit} className="relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={handleTextareaChange}
                      onKeyDown={handleKeyDown}
                      placeholder={placeholder}
                      className="w-full resize-none pr-14 pb-12 min-h-[7.5rem] rounded-[1.5rem] border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.1),_0_1px_3px_rgba(0,0,0,0.05)] font-thin p-4 text-zinc-900 text-md focus:outline-none"
                      rows={1}
                    />
                    {/* Permanent Alumni badge */}
                    <div className="absolute left-3 bottom-4 bg-[#E43E22]/20 text-[#E43E22] rounded-full px-3 py-1 flex items-center gap-2 text-sm pointer-events-none">
                      <Image src='/logo-small.png' alt='logo' width={18} height={18} className='rounded-lg' />
                      alumnis
                    </div>
                    <div className="absolute right-3 bottom-4">
                      {(status === "submitted" || status === "streaming") ? (
                        <StopButton onClick={stop} />
                      ) : (
                        <SendButton disabled={!input.trim()} />
                      )}
                    </div>
                  </form>
                </motion.div>
              </div>
            ) : (
              // Chat messages
              <AnimatePresence>
                <div className="space-y-6 py-4 pb-20">
                  {messages.map((message: any, index: number) => {
                    const isUser = message.role === 'user';
                    const parts = message.parts || [];
                    console.log('status = ', status, message.parts)
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        onMouseEnter={() => !isUser && setHoveringMessage(message.id)}
                        onMouseLeave={() => !isUser && setHoveringMessage(null)}
                      >
                        <div
                          className={`rounded-full px-4 py-3 text-black max-w-4xl font-light ${isUser ? 'bg-zinc-100' : ''}`}
                        >
                          {isUser ? (
                            <div className="text-md">{message.content}</div>
                          ) : status === "submitted" && index === messages.length - 1 ? (
                            <div className="flex items-start gap-3">
                              <ShimmeringTitle className='text-black font-thin'>Chargement</ShimmeringTitle>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <Image
                                src="/justine.jpeg"
                                alt="Justine"
                                width={40}
                                height={40}
                                className="rounded-full object-cover mt-2"
                              />
                              <div className='ml-1'>
                                <MarkdownContent content={message.content} />
                                <div
                                  className={`flex mt-2 space-x-4 opacity-0 transition-opacity duration-200 ${hoveringMessage === message.id ? 'opacity-100' : ''}`}
                                >
                                  <button
                                    onClick={() => reload(message.id)}
                                    className="text-zinc-500 hover:text-zinc-800"
                                  >
                                    <Icon icon="lucide:refresh-cw" width={16} height={16} />
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(message.content)}
                                    className="text-zinc-500 hover:text-zinc-800"
                                  >
                                    <Icon icon="lucide:clipboard-copy" width={16} height={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Render tool invocations */}
                          {parts.map((part: any, idx: number) => {
                            if (part.type === 'tool-invocation') {
                              return renderToolResult(part, idx, part.toolInvocation.toolCallId);
                            }
                            return null;
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Fixed input area at bottom for ongoing chats */}
        {hasMessages && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="max-w-5xl mx-auto px-4 py-4">
              <div className="max-w-3xl mx-auto relative mb-5">
                <form ref={formRef} onSubmit={onSubmit} className="relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full resize-none pr-14 pb-12 min-h-[7.5rem] rounded-[1.5rem] border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.1),_0_1px_3px_rgba(0,0,0,0.05)] font-thin p-4 text-zinc-900 text-md focus:outline-none"
                    rows={1}
                  />
                  {/* Permanent Alumni badge */}
                  <div className="absolute left-3 bottom-4 bg-[#E43E22]/20 text-[#E43E22] rounded-full px-3 py-1 flex items-center gap-2 text-sm pointer-events-none">
                    <Image src='/logo-small.png' alt='logo' width={18} height={18} className='rounded-lg' />
                    alumnis
                  </div>
                  <div className="absolute right-3 bottom-4">
                    {(status === "submitted" || status === "streaming") ? (
                      <StopButton onClick={stop} />
                    ) : (
                      <SendButton disabled={!input.trim()} />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <p className='text-zinc-400 font-light fixed bottom-0 mb-4 left-[45%] text-xs'>contact: <a href='mailto:paul@ks-entreprise.com' className=''>paul@ks-entreprise.com</a></p>
    </div>
  );
}