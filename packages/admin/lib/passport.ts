import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { findUserByUsername, validatePassword, User } from './db';

passport.serializeUser(function (user: User, done:any) {
  // 将用户名序列化到会话中
  done(null, user.username);
});

passport.deserializeUser(function (req: any, id: string, done:any) {
  // 将用户名反序列化回用户对象
  const user = findUserByUsername(req, id);
  done(null, user);
});

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req: any, username: string, password: string, done:any) => {
      // 这里你查找数据库中的用户并比较密码/哈希密码
      const user = findUserByUsername(req, username);
      // 从安全角度考虑，如果你之前哈希过密码，你必须验证它
      if (!user || !validatePassword(user, password)) {
        done(null, null);
      } else {
        done(null, user);
      }
    }
  )
);

export default passport;
