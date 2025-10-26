// 默认数据配置 - 新用户初始化数据
import { Method } from './api';

// 默认育儿方法数据
export const DEFAULT_METHODS: Omit<Method, 'id' | 'created_at'>[] = [
  {
    name: '说出感受',
    color: '#e29a71',
    icon_url: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    name: '做交易',
    color: '#7aa4e2',
    icon_url: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    name: '转身离开',
    color: '#7ec587',
    icon_url: 'https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    name: '道歉',
    color: '#c380de',
    icon_url: 'https://images.pexels.com/photos/8613103/pexels-photo-8613103.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    name: '喊请停下',
    color: '#e27171',
    icon_url: 'https://images.pexels.com/photos/8613087/pexels-photo-8613087.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    name: '轮流分享',
    color: '#71a9e2',
    icon_url: 'https://images.pexels.com/photos/8613090/pexels-photo-8613090.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    name: '换个活动',
    color: '#83de80',
    icon_url: 'https://images.pexels.com/photos/8613265/pexels-photo-8613265.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    name: '忽略冲突',
    color: '#a4a4a4',
    icon_url: 'https://images.pexels.com/photos/8613088/pexels-photo-8613088.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  }
];

// 默认案例数据 - 基于数据库迁移文件中的示例
export const DEFAULT_CASES = [
  {
    methodName: '说出感受',
    name: '石头',
    summary: '在老师的引导下，学会用语言表达自己的愤怒和需求，而不是只会哭泣。',
    card_data: {
      theme: ['#e29a71', '#c17b51'],
      icon_url: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      front_title: '当孩子只会用哭来表达不满时，我们该怎么办？',
      see_why: '孩子常常因为茫然和不知所措，而选择最原始的表达方式——哭泣。他们需要被给予具体的"社交脚本"。',
      solution_list: '<ul><li><strong>共情与安抚:</strong> 老师先表示理解石头的感受，让他放下戒备。</li><li><strong>角色扮演:</strong> 通过模拟场景，让石头练习说出"我太生气了，我希望我们一起玩"。</li><li><strong>肯定与鼓励:</strong> 对石头的每一次尝试都竖起大拇指，增强他的信心。</li></ul>',
      the_change: '石头在角色扮演中成功说出了自己的感受，为之后独立解决问题打下了基础。',
      wisdom_quote: '教孩子说出感受，是递给他解决冲突的第一把钥匙。'
    }
  },
  {
    methodName: '做交易',
    name: '石头',
    summary: '用自己的"维修工具包"作为交换，成功加入了小伙伴的积木游戏。',
    card_data: {
      theme: ['#A7C4B5', '#85a29c'],
      icon_url: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      front_title: '如何用一个锤子，换来一起玩的机会？',
      see_why: '当孩子被排斥在外时，直接的请求可能会被忽略，创造性的提议更容易被接受。',
      solution_list: '<ul><li><strong>发现自己的独特价值:</strong> 老师引导石头思考自己有什么别人没有的玩具。</li><li><strong>提出双赢方案:</strong> 石头拿出维修工具包，提议可以"修理"房子，让游戏变得更有趣。</li></ul>',
      the_change: '两个小朋友被新玩法吸引，欣然同意了石头的加入，他们一起搭了房子和停车场。',
      wisdom_quote: '一个好的交易，是为别人创造他们需要的价值。'
    }
  },
  {
    methodName: '做交易',
    name: '悠悠',
    summary: '用自己的"魔法棒"创造了新玩法，成功化解了滑梯上的尴尬，并交到了新朋友。',
    card_data: {
      theme: ['#7aa4e2', '#5c84b1'],
      icon_url: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      front_title: '如何用一根魔法棒，化解滑梯上的尴尬？',
      see_why: '面对群体，胆怯的孩子不敢直接表达自己的需求，需要一个"破冰"的道具。',
      solution_list: '<ul><li><strong>联想与迁移:</strong> 妈妈鼓励悠悠将在体育课上玩的"接龙游戏"迁移到滑梯场景。</li><li><strong>利用道具创造新规则:</strong> 悠悠拿出魔法棒，提议玩"魔法棒接龙"，把滑梯变成了合作游戏。</li></ul>',
      the_change: '两个姐姐被新游戏吸引，愉快地同意了。悠悠不仅玩上了滑梯，还交到了新朋友。',
      wisdom_quote: '最好的交易，是创造一个让所有人都赢的新游戏。'
    }
  },
  {
    methodName: '转身离开',
    name: '悠悠',
    summary: '习惯性地走开，妈妈肯定了这是一种选择，但也提醒她要为选择的后果负责。',
    card_data: {
      theme: ['#7ec587', '#5a9d6a'],
      icon_url: 'https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      front_title: '孩子选择"算了，太麻烦了"，我们该如何回应？',
      see_why: '对于习惯躲避的孩子，"走开"是一种安全的舒适区。我们需要肯定其选择权，同时点明其代价。',
      solution_list: '<ul><li><strong>肯定选择:</strong> 妈妈说："走开也是一种解决办法。"</li><li><strong>明确后果:</strong> 妈妈提醒："但是选择走开之后，依然要遵守我们吃饭的时间。"</li></ul>',
      the_change: '悠悠虽然没有立刻改变，但妈妈的话在她心中埋下了种子，让她开始思考"选择"与"后果"的关系。',
      wisdom_quote: '尊重孩子的每一个选择，并让他学会为这个选择的全部结果负责。'
    }
  },
  {
    methodName: '道歉',
    name: '笑笑',
    summary: '她非常希望对方道歉，但妈妈引导她学会了专注于自己能控制的方面。',
    card_data: {
      theme: ['#c380de', '#a36ac7'],
      icon_url: 'https://images.pexels.com/photos/8613103/pexels-photo-8613103.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      front_title: '当孩子执着于"他为什么不道歉"时，该如何引导？',
      see_why: '孩子天生追求公平，但现实世界并不总是公平的。需要帮助孩子建立"课题分离"的认知。',
      solution_list: '<ul><li><strong>肯定感受，分离课题:</strong> 妈妈首先肯定了笑笑的委屈，然后引导："我们管不了别人，只能管好自己。"</li><li><strong>转移焦点:</strong> 妈妈反复提问："那你还希望做什么？" 帮助笑笑从对他人的期待，转移到自己可以采取的行动上。</li></ul>',
      the_change: '笑笑最终放弃了让小乐道歉的想法，不再纠结于此，内心也获得了平静。',
      wisdom_quote: '真正的强大，是学会将精力聚焦于自己能改变的事情上。'
    }
  }
];

// 创建默认方法的工具函数
export const createDefaultMethods = async (createMethod: (method: Omit<Method, 'id' | 'created_at'>) => Promise<Method | null>) => {
  const createdMethods: Method[] = [];
  
  for (const method of DEFAULT_METHODS) {
    const created = await createMethod(method);
    if (created) {
      createdMethods.push(created);
    }
  }
  
  return createdMethods;
};

// 创建默认案例的工具函数
export const createDefaultCases = async (
  methods: Method[], 
  createCase: (caseData: any) => Promise<any>
) => {
  const createdCases = [];
  
  for (const caseData of DEFAULT_CASES) {
    const method = methods.find(m => m.name === caseData.methodName);
    if (method) {
      const caseToCreate = {
        method_id: method.id,
        name: caseData.name,
        summary: caseData.summary,
        card_data: caseData.card_data
      };
      
      const created = await createCase(caseToCreate);
      if (created) {
        createdCases.push(created);
      }
    }
  }
  
  return createdCases;
};
