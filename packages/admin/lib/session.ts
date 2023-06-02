import { parse, serialize } from 'cookie';
import { createLoginSession, getLoginSession } from './auth';

interface Cookies {
  [key: string]: string;
}

interface SessionOptions {
  name: string;
  secret: string;
  cookie: CookieOptions;
}

interface CookieOptions {
  maxAge?: number;
}

// 解析 cookies
function parseCookies(req: any): Cookies {
  // 对于 API 路由，我们不需要解析 cookies
  if (req.cookies) return req.cookies;

  // 对于页面，我们确实需要解析 cookies
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export default function session({ name, secret, cookie: cookieOpts }: SessionOptions) {
  return async (req: any, res: any , next:any) => {
    const cookies = parseCookies(req);
    const token = cookies[name];
    let unsealed: any = {};

    if (token) {
      try {
        // 需要使用密码 'secret' 打开 cookie
        unsealed = await getLoginSession(token, secret);
      } catch (e) {
        // cookie 无效
      }
    }

    req.session = unsealed;

    // 我们正在代理 res.end 来提交 session cookie
    const oldEnd = res.end;
    res.end = async function resEndProxy(...args: any[]) {
      if (res.finished || res.writableEnded || res.headersSent) return;
      if (cookieOpts.maxAge) {
        req.session.maxAge = cookieOpts.maxAge;
      }

      const token = await createLoginSession(req.session, secret);

      res.setHeader('Set-Cookie', serialize(name, token, cookieOpts));
      oldEnd.apply(this, args);
    };

    next();
  }
}
