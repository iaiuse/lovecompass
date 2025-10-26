import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Copy, Check, Sparkles, Heart, Star } from 'lucide-react';
import { createCase, Method, callLLM, Case } from '../../lib/api';
import { ToastContainer, Toast, ToastType } from '../ui/Toast';

interface LLMDialogProps {
  isVisible: boolean;
  onClose: () => void;
  methods: Method[];
  onCaseCreated?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface GeneratedCard {
  role_name: string;
  story_summary: string;
  front_title: string;
  see_why: string;
  solution_list: string;
  the_change: string;
  wisdom_quote: string;
  category: string;
}

const LLMDialog: React.FC<LLMDialogProps> = ({ isVisible, onClose, methods, onCaseCreated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'intro' | 'question1' | 'question2' | 'question3' | 'processing' | 'result'>('intro');
  const [draftData, setDraftData] = useState<{
    question1?: string;
    question2?: string;
    question3?: string;
    protagonist?: string;
    event?: string;
    coreProblem?: string;
    solution?: string;
    result?: string;
    insight?: string;
  }>({});
  const [generatedCard, setGeneratedCard] = useState<GeneratedCard | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible) {
      // 重置状态
      setMessages([]);
      setInputValue('');
      setCurrentStep('intro');
      setDraftData({});
      setGeneratedCard(null);
      setCopiedField(null);
      
      // 添加欢迎消息
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: '老师您好！辛苦了！有个案例想记一下？我们来个"3问快录"，1分钟搞定！😊',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isVisible]);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getLoadingMessage = (step: string) => {
    const messages = {
      intro: ['正在准备问题...', '让我想想该问什么好呢...', '准备开始我们的对话吧！'],
      question1: ['正在分析您的回答...', '让我理解一下情况...', '记录中...'],
      question2: ['继续收集信息...', '让我整理一下...', '分析中...'],
      question3: ['正在整理案例...', '让我深入思考一下...', '准备生成锦囊...'],
      processing: ['正在生成育儿锦囊...', 'AI正在深度思考...', '整理成卡片格式...', '添加智慧金句...', '最后润色中...']
    };
    const stepMessages = messages[step as keyof typeof messages] || ['处理中...'];
    return stepMessages[Math.floor(Math.random() * stepMessages.length)];
  };

  const parseDraftFromResponse = (response: string): Partial<{
    protagonist: string;
    event: string;
    coreProblem: string;
    solution: string;
    result: string;
    insight: string;
  }> => {
    const draft: any = {};
    
    // 解析案例草稿格式 - 使用更宽松的正则
    const protagonistMatch = response.match(/\*\*主角:\*\*([\s\S]*?)(?=\*)/);
    const eventMatch = response.match(/\*\*事件:\*\*([\s\S]*?)(?=\*)/);
    const coreProblemMatch = response.match(/\*\*核心问题\/感受:\*\*([\s\S]*?)(?=\*)/);
    const solutionMatch = response.match(/\*\*解决方案 \(或尝试\):\*\*([\s\S]*?)(?=\*)/);
    const resultMatch = response.match(/\*\*最终结果:\*\*([\s\S]*?)(?=\*)/);
    const insightMatch = response.match(/\*\*核心启发 \(或疑问\):\*\*([\s\S]*?)(?=\*)/);
    
    if (protagonistMatch) draft.protagonist = protagonistMatch[1].trim();
    if (eventMatch) draft.event = eventMatch[1].trim();
    if (coreProblemMatch) draft.coreProblem = coreProblemMatch[1].trim();
    if (solutionMatch) draft.solution = solutionMatch[1].trim();
    if (resultMatch) draft.result = resultMatch[1].trim();
    if (insightMatch) draft.insight = insightMatch[1].trim();
    
    return draft;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue.trim();
    setInputValue('');
    addMessage(userInput, 'user');

    setIsLoading(true);
    setLoadingMessage(getLoadingMessage(currentStep));

    try {
      // 构建对话历史
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      if (currentStep === 'intro') {
        // 用户确认开始，调用LLM获取第一个问题
        const result = await callLLM('question1', userInput, draftData, conversationHistory);
        if (result) {
          setCurrentStep('question1');
          addMessage(result.response, 'assistant');
        } else {
          addMessage('抱歉，处理您的请求时出现了问题，请重试。', 'assistant');
        }
        setIsLoading(false);
      } else if (currentStep === 'question1') {
        // 保存第一个问题的回答
        const newDraft = { ...draftData, question1: userInput };
        
        const result = await callLLM('question1', userInput, draftData, conversationHistory);
        if (result) {
          // 尝试从回答中解析草稿信息
          const parsed = parseDraftFromResponse(result.response);
          if (parsed.protagonist) {
            Object.assign(newDraft, parsed);
          }
          
          setDraftData(newDraft);
          setCurrentStep('question2');
          addMessage(result.response, 'assistant');
        } else {
          addMessage('抱歉，处理您的请求时出现了问题，请重试。', 'assistant');
        }
        setIsLoading(false);
      } else if (currentStep === 'question2') {
        // 保存第二个问题的回答
        const newDraft = { ...draftData, question2: userInput };
        
        const result = await callLLM('question1', userInput, draftData, conversationHistory);
        if (result) {
          // 尝试从回答中解析更多草稿信息
          const parsed = parseDraftFromResponse(result.response);
          if (parsed.coreProblem || parsed.solution) {
            Object.assign(newDraft, parsed);
          }
          
          setDraftData(newDraft);
          setCurrentStep('question3');
          addMessage(result.response, 'assistant');
        } else {
          addMessage('抱歉，处理您的请求时出现了问题，请重试。', 'assistant');
        }
        setIsLoading(false);
      } else if (currentStep === 'question3') {
        // 保存第三个问题的回答
        const newDraft = { ...draftData, question3: userInput };
        
        const questionResult = await callLLM('question1', userInput, draftData, conversationHistory);
        if (questionResult) {
          // 尝试从回答中解析剩余草稿信息
          const parsed = parseDraftFromResponse(questionResult.response);
          if (parsed.result || parsed.insight) {
            Object.assign(newDraft, parsed);
          }
        }
        
        setDraftData(newDraft);
        setCurrentStep('processing');
        setLoadingMessage(getLoadingMessage('processing'));
        
        addMessage('完美！所有核心信息都抓到了！👍 我正在把这些笔记整理成一份漂亮的锦囊...', 'assistant');
        
        // 调用LLM生成卡片内容
        const cardResult = await callLLM('generate_card', '', newDraft, conversationHistory);
        if (cardResult) {
          // 解析LLM返回的卡片内容
          const card = parseGeneratedCard(cardResult.response);
          setGeneratedCard(card);
          setCurrentStep('result');
          addMessage('育儿锦囊已生成！请查看下面的内容，您可以选择保存到对应的方法中。', 'assistant');
        } else {
          addMessage('抱歉，生成卡片时出现了问题，请重试。', 'assistant');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage('抱歉，处理过程中出现了错误，请重试。', 'assistant');
      setIsLoading(false);
    }
  };

  const parseGeneratedCard = (llmResponse: string): GeneratedCard => {
    // 解析LLM返回的卡片内容
    const lines = llmResponse.split('\n');
    const card: GeneratedCard = {
      role_name: '',
      story_summary: '',
      front_title: '',
      see_why: '',
      solution_list: '',
      the_change: '',
      wisdom_quote: '',
      category: ''
    };

    let currentField = '';
    for (const line of lines) {
      if (line.includes('**角色名称：**')) {
        currentField = 'role_name';
        card.role_name = line.replace('**角色名称：**', '').trim();
      } else if (line.includes('**故事摘要：**')) {
        currentField = 'story_summary';
        card.story_summary = line.replace('**故事摘要：**', '').trim();
      } else if (line.includes('**卡片标题：**')) {
        currentField = 'front_title';
        card.front_title = line.replace('**卡片标题：**', '').trim();
      } else if (line.includes('**看见"为什么"：**')) {
        currentField = 'see_why';
        card.see_why = line.replace('**看见"为什么"：**', '').trim();
      } else if (line.includes('**解决方案：**')) {
        currentField = 'solution_list';
        card.solution_list = line.replace('**解决方案：**', '').trim();
      } else if (line.includes('**神奇变化：**')) {
        currentField = 'the_change';
        card.the_change = line.replace('**神奇变化：**', '').trim();
      } else if (line.includes('**智慧金句：**')) {
        currentField = 'wisdom_quote';
        card.wisdom_quote = line.replace('**智慧金句：**', '').trim();
      } else if (line.includes('**分类：**')) {
        currentField = 'category';
        card.category = line.replace('**分类：**', '').trim();
      } else if (line.trim() && currentField && !line.startsWith('---')) {
        // 继续当前字段的内容
        if (currentField === 'solution_list') {
          card.solution_list += '\n' + line.trim();
        } else {
          (card as any)[currentField] += ' ' + line.trim();
        }
      }
    }

    // 如果解析失败，使用默认值
    if (!card.role_name) {
      card.role_name = extractRoleName(draftData?.question1 || '孩子');
      card.story_summary = generateStorySummary(draftData?.question1 || '', draftData?.question2 || '', draftData?.question3 || '');
      card.front_title = generateFrontTitle(draftData?.question2 || '');
      card.see_why = generateSeeWhy(draftData?.question2 || '');
      card.solution_list = generateSolutionList(draftData?.question2 || '');
      card.the_change = generateTheChange(draftData?.question3 || '');
      card.wisdom_quote = generateWisdomQuote(draftData?.question3 || '');
      card.category = determineCategory(draftData?.question1 || '', draftData?.question2 || '');
    }

    return card;
  };

  const generateCardFromDraft = (draft: any, question3Answer: string): GeneratedCard => {
    // 备用函数，用于生成模拟数据
    return {
      role_name: extractRoleName(draft.question1),
      story_summary: generateStorySummary(draft.question1, draft.question2, question3Answer),
      front_title: generateFrontTitle(draft.question2),
      see_why: generateSeeWhy(draft.question2),
      solution_list: generateSolutionList(draft.question2),
      the_change: generateTheChange(question3Answer),
      wisdom_quote: generateWisdomQuote(question3Answer),
      category: determineCategory(draft.question1, draft.question2)
    };
  };

  // 辅助函数来生成卡片内容
  const extractRoleName = (text: string) => {
    // 简单的角色名提取逻辑
    const words = text.split(/[，。！？\s]/);
    return words[0] || '孩子';
  };

  const generateStorySummary = (q1: string, q2: string, q3: string) => {
    return `在老师的引导下，${extractRoleName(q1)}学会了用更有效的方式处理冲突，从${q2.split('，')[0]}到最终${q3.split('，')[0]}。`;
  };

  const generateFrontTitle = (q2: string) => {
    return `当孩子遇到${q2.split('，')[0]}时，我们该如何引导？`;
  };

  const generateSeeWhy = (q2: string) => {
    return `孩子常常因为${q2.split('，')[0]}，而选择最原始的表达方式。他们需要被给予具体的"社交脚本"。`;
  };

  const generateSolutionList = (q2: string) => {
    return `1. 共情与安抚：先表示理解孩子的感受\n2. 角色扮演：通过模拟场景练习表达\n3. 肯定与鼓励：对每一次尝试都给予肯定`;
  };

  const generateTheChange = (q3: string) => {
    return `孩子在引导下成功解决了问题，为之后独立处理类似情况打下了基础。`;
  };

  const generateWisdomQuote = (q3: string) => {
    return `教孩子解决问题的"工具"，远比帮他解决一次问题更重要。`;
  };

  const determineCategory = (q1: string, q2: string) => {
    // 根据内容确定分类，这里简化处理
    const categories = ['说出感受', '做交易', '转身离开', '道歉', '喊请停下', '轮流分享', '换个活动', '忽略冲突'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSaveCard = async () => {
    if (!generatedCard) return;

    // 找到对应的方法
    const method = methods.find(m => m.name === generatedCard.category);
    if (!method) {
      showToast('未找到对应的方法分类', 'error');
      return;
    }

    const caseData: Omit<Case, 'id' | 'created_at'> = {
      method_id: method.id,
      name: generatedCard.role_name,
      summary: generatedCard.story_summary,
      card_data: {
        theme: [method.color, method.color] as [string, string],
        icon_url: method.icon_url,
        front_title: generatedCard.front_title,
        see_why: generatedCard.see_why,
        solution_list: generatedCard.solution_list.split('\n').map(item => `<li>${item}</li>`).join(''),
        the_change: generatedCard.the_change,
        wisdom_quote: generatedCard.wisdom_quote
      }
    };

    try {
      const result = await createCase(caseData);
      if (result) {
        showToast('卡片已成功保存到 ' + generatedCard.category + '！', 'success');
        onCaseCreated?.();
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        showToast('保存失败，请重试', 'error');
      }
    } catch (error) {
      console.error('Error saving case:', error);
      showToast('保存失败，请重试', 'error');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI育儿锦囊助手</h2>
              <p className="text-sm text-gray-500">通过3个问题，生成专属育儿卡片</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-4 h-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-4 py-3 border border-pink-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Bot className="w-5 h-5 text-pink-600 animate-pulse" />
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-3 h-3 text-yellow-500 animate-spin" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-sm text-pink-700 font-medium">{loadingMessage}</div>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                        <Star className="w-3 h-3 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated Card Display */}
          {generatedCard && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                生成的育儿锦囊
              </h3>
              
              {/* 卡片式展示 */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* 卡片头部 */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-2xl font-bold">{generatedCard.front_title}</h4>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      {generatedCard.category}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm font-medium">{generatedCard.role_name}</p>
                </div>

                {/* 卡片内容 */}
                <div className="p-6 space-y-5">
                  {/* 核心问题 */}
                  <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                      💡 看见"为什么"
                    </h5>
                    <p className="text-blue-800 text-sm leading-relaxed">{generatedCard.see_why}</p>
                  </div>

                  {/* 解决方案 */}
                  <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-900 mb-2 flex items-center">
                      ✨ 解决方案
                    </h5>
                    <div className="text-green-800 text-sm whitespace-pre-wrap leading-relaxed">
                      {generatedCard.solution_list}
                    </div>
                  </div>

                  {/* 神奇变化 */}
                  <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
                    <h5 className="font-semibold text-purple-900 mb-2 flex items-center">
                      🌟 神奇变化
                    </h5>
                    <p className="text-purple-800 text-sm leading-relaxed">{generatedCard.the_change}</p>
                  </div>

                  {/* 智慧金句 */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-300">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">💎</span>
                      <div>
                        <h5 className="font-semibold text-orange-900 mb-1">智慧金句</h5>
                        <p className="text-orange-800 text-sm italic leading-relaxed">"{generatedCard.wisdom_quote}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex space-x-3">
                  <button
                    onClick={handleSaveCard}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    保存到 {generatedCard.category}
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedCard(null);
                      setCurrentStep('intro');
                      setMessages([]);
                      setDraftData({});
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    重新开始
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {currentStep !== 'result' && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={currentStep === 'intro' ? '输入"开始"或"好的"来开始...' : '请输入您的回答...'}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default LLMDialog;
