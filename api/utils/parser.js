// api/utils/parser.js
export const extractUserStats = (markdown) => {
  try {
    // 增加打印的Markdown长度，方便观察上下文
    console.log('[parser.js] Parsing markdown:', markdown ? markdown.substring(0, 500) + '...' : 'Markdown is null/undefined'); 
    
    if (!markdown || typeof markdown !== 'string') {
        console.warn('[parser.js] Markdown content is invalid or empty. Returning default stats.');
        // 将默认值改为 '-' 以便在UI上更清晰地区分未获取和0
        return { followingCount: '-', followersCount: '-', likesCount: '-' };
    }

    let followingCount = '-'; // 默认值为 '-'
    let followersCount = '-'; // 默认值为 '-'
    let likesCount = '-';     // 默认值为 '-'
    
    // --- 优化后的正则表达式 ---
    // 匹配模式： 数字(可选单位) + 任意空白/星号 + 关键词
    // 或者： 关键词 + 任意空白/星号 + 数字(可选单位)
    // ([\d.,]+\s*[KkMmBbTt]?) 是捕获组1，匹配数字和单位
    // \s* 匹配0或多个空白字符
    // [*\s]* 匹配0或多个星号或空白字符 (处理Markdown强调标记)
    // (?: ... ) 是非捕获组

    const followingPattern1 = /([\d.,]+\s*[KkMmBbTt]?)\s*[*\s]*(?:Following|关注)/i;
    const followingPattern2 = /(?:Following|关注)[*\s]*([\d.,]+\s*[KkMmBbTt]?)/i;
    let followingMatch = markdown.match(followingPattern1) || markdown.match(followingPattern2);
    if (followingMatch && followingMatch[1]) {
      followingCount = followingMatch[1].trim().replace(/,/g, ''); // 移除数字中的逗号
    }
    
    const followersPattern1 = /([\d.,]+\s*[KkMmBbTt]?)\s*[*\s]*(?:Followers|粉丝)/i;
    const followersPattern2 = /(?:Followers|粉丝)[*\s]*([\d.,]+\s*[KkMmBbTt]?)/i;
    let followersMatch = markdown.match(followersPattern1) || markdown.match(followersPattern2);
    if (followersMatch && followersMatch[1]) {
      followersCount = followersMatch[1].trim().replace(/,/g, ''); // 移除数字中的逗号
    }
    
    const likesPattern1 = /([\d.,]+\s*[KkMmBbTt]?)\s*[*\s]*(?:Likes|获赞|喜欢)/i;
    const likesPattern2 = /(?:Likes|获赞|喜欢)[*\s]*([\d.,]+\s*[KkMmBbTt]?)/i;
    let likesMatch = markdown.match(likesPattern1) || markdown.match(likesPattern2);
    if (likesMatch && likesMatch[1]) {
      likesCount = likesMatch[1].trim().replace(/,/g, ''); // 移除数字中的逗号
    }
    
    // --- 移除不稳定的后备数字提取逻辑 ---
    // 我们现在依赖更精确的、与关键词绑定的正则表达式。
    // 如果匹配不到，就返回默认的 '-'。

    const extractedStats = {
      followingCount,
      followersCount,
      likesCount
    };

    console.log('[parser.js] Extracted stats with new regex:', extractedStats);
    return extractedStats;

  } catch (error) {
    console.error('[parser.js] Error parsing markdown:', error);
    // 即使解析出错，也返回默认值
    return { followingCount: '-', followersCount: '-', likesCount: '-' };
  }
};