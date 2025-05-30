// api/utils/helpers.js
// import crypto from 'crypto'; // Node.js 内置模块, 如果需要使用哈希则取消注释

/**
 * Creates a hashed identifier for the Jina API key
 * @param {string} apiKey - The Jina API key to hash
 * @returns {string} - A shortened hash of the API key
 */
export const createApiKeyIdentifier = (apiKey) => {
  // crypto模块在Vercel Serverless环境通常可用
  // 但为了确保在所有Node.js环境中（包括一些轻量级或受限的）都能工作，
  // 并且避免引入不必要的复杂性，如果只是为了一个简单的标识符，
  // 我们可以用一个更简单的方式，或者直接使用API Key的前几位和后几位。
  // 真正的哈希对于“标识”来说有点 overkill，除非我们非常在意不暴露Key的任何部分。

  // 简单标识符：取Key的前4位和后4位
  if (typeof apiKey === 'string' && apiKey.length > 8) {
    return `${apiKey.substring(0, 4)}...${apiKey.slice(-4)}`;
  }
  // 如果Key太短或不是字符串，返回一个固定标识或处理错误
  return 'invalid_or_short_api_key';

  // 如果确实需要哈希：
  // const hash = crypto.createHash('sha256');
  // hash.update(apiKey);
  // return hash.digest('hex').substring(0, 16); // 取哈希值的前16位
};

// 如果您在函数声明前使用了 export, 则不需要下面这行
// export { createApiKeyIdentifier };