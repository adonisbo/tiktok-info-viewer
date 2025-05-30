// api/handler.js
import { fetchTikTokUserProfile } from './services/jinaService.js'; // 使用 ES Module import
import { extractUserStats } from './utils/parser.js'; // 使用 ES Module import
// import { createApiKeyIdentifier } from './utils/helpers.js'; // 如果后续用到历史记录, 也改为 import

export default async function handler(req, res) {
  // 设置CORS头部，允许来自任何源的请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 预检请求 (CORS需要)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { tiktokUserId, jinaApiKey } = req.body;
      console.log('[API Handler] Received POST request with body:', req.body);

      if (!tiktokUserId || !jinaApiKey) {
        console.log('[API Handler] Missing tiktokUserId or jinaApiKey');
        return res.status(400).json({ success: false, error: 'TikTok用户ID和Jina AI API Key是必填项' });
      }

      console.log(`[API Handler] Calling Jina AI service for ${tiktokUserId} with key ending in ...${jinaApiKey.slice(-4)}`);
      
      const markdownContentFromJina = await fetchTikTokUserProfile(tiktokUserId, jinaApiKey);
      console.log('[API Handler] Markdown content received from Jina:', markdownContentFromJina ? markdownContentFromJina.substring(0, 200) + '...' : 'No markdown content from Jina');
      
      const stats = extractUserStats(markdownContentFromJina);
      
      console.log('[API Handler] Stats processed/parsed:', stats);

      return res.status(200).json({ success: true, data: stats });

    } catch (error) {
      console.error('[API Handler] Error processing POST request:', error.message);
      console.error(error.stack); 
      return res.status(500).json({ success: false, error: error.message || '服务器内部错误处理请求失败' });
    }
  } else {
    // 如果不是POST请求，返回方法不允许
    console.log(`[API Handler] Method Not Allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']); // 明确告知允许的方法
    return res.status(405).json({ success: false, error: `方法 ${req.method} 不被允许` });
  }
}