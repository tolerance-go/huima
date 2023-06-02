import Iron from '@hapi/iron';

interface Session {
  maxAge?: number;
  createdAt?: number;
  [key: string]: any;
}

// 创建登录会话
export async function createLoginSession(session: Session, secret: string): Promise<string> {
  const createdAt = Date.now();
  const obj = { ...session, createdAt };
  const token = await Iron.seal(obj, secret, Iron.defaults);

  return token;
}

// 获取登录会话
export async function getLoginSession(token: string, secret: string): Promise<Session> {
  const session = await Iron.unseal(token, secret, Iron.defaults);
  const expiresAt = (session.createdAt || 0) + (session.maxAge || 0) * 1000;

  // 验证会话的过期日期
  if (session.maxAge && Date.now() > expiresAt) {
    throw new Error('会话已过期');
  }

  return session;
}
