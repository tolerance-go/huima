import nextConnect from 'next-connect'
import passport from '../lib/passport'
import session from '../lib/session'

const auth = nextConnect()
   .use(
      session({
         name: 'sess',
         secret: process.env.TOKEN_SECRET || '',
         cookie: {
            maxAge: 60 * 60 * 8, // 8小时
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
         },
      }),
   )
   .use((req: any, res: any, next: any) => {
      // 初始化模拟数据库
      // 添加自己的数据库后删除这个
      req.session.users = req.session.users || []
      next()
   })
   .use(passport.initialize())
   .use(passport.session())

export default auth
