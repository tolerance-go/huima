import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  createdAt: number;
  username: string;
  name: string;
  hash: string;
  salt: string;
}

export interface SessionRequest {
  session: {
    users: User[];
  };
  user: User;
}

export interface UpdateUser {
  id?: string;
  createdAt?: number;
  username?: string;
  name?: string;
  hash?: string;
  salt?: string;
}

// 获取所有用户（仅用于演示，实际操作中可能不需要返回所有用户）
export function getAllUsers(req: SessionRequest): User[] {
  return req.session.users;
}

// 创建用户并保存 salt 和 hashed 密码
// 在某些数据库中可能已经内置了身份验证方法，你无需关心这些细节
export function createUser(req: SessionRequest, { username, password, name }: { username: string, password: string, name: string }): void {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  const user: User = {
    id: uuidv4(),
    createdAt: Date.now(),
    username,
    name,
    hash,
    salt,
  }

  // 在这里你应该把用户插入到数据库中
  // await db.createUser(user)
  req.session.users.push(user);
}

// 根据用户名在数据库中找到用户
export function findUserByUsername(req: SessionRequest, username: string): User | undefined {
  return req.session.users.find((user) => user.username === username);
}

// 根据用户名在数据库中更新用户
export function updateUserByUsername(req: SessionRequest, username: string, update: UpdateUser): User | undefined {
  const user = req.session.users.find((u) => u.username === username);
  if (user) {
    Object.assign(user, update);

  }
  return user;
}

// 在数据库中删除用户
export function deleteUser(req: SessionRequest, username: string): void {
  req.session.users = req.session.users.filter(
    (user) => user.username !== req.user.username
  );
}

// 验证已获取的用户的密码（使用 `findUserByUsername`）和潜在匹配的密码
export function validatePassword(user: User, inputPassword: string): boolean {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex');
  const passwordsMatch = user.hash === inputHash;
  return passwordsMatch;
}
