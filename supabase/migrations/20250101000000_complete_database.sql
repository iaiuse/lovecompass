/*
  # 育儿锦囊 - 完整数据库结构
  
  这个文件包含了完整的数据库结构，包括：
  1. 用户认证和归属
  2. 方法表 (methods)
  3. 案例表 (cases)
  4. 基于用户的安全策略
  5. 必要的索引和约束
*/

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建方法表 (methods)
CREATE TABLE IF NOT EXISTS methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建案例表 (cases)
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method_id UUID NOT NULL REFERENCES methods(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  card_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_methods_user_id ON methods(user_id);
CREATE INDEX IF NOT EXISTS idx_methods_created_at ON methods(created_at);
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_method_id ON cases(method_id);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
CREATE TRIGGER update_methods_updated_at 
  BEFORE UPDATE ON methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at 
  BEFORE UPDATE ON cases 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 删除所有现有的策略（如果有的话）
DROP POLICY IF EXISTS "Users can read their own methods" ON methods;
DROP POLICY IF EXISTS "Users can insert their own methods" ON methods;
DROP POLICY IF EXISTS "Users can update their own methods" ON methods;
DROP POLICY IF EXISTS "Users can delete their own methods" ON methods;
DROP POLICY IF EXISTS "Users can read their own cases" ON cases;
DROP POLICY IF EXISTS "Users can insert their own cases" ON cases;
DROP POLICY IF EXISTS "Users can update their own cases" ON cases;
DROP POLICY IF EXISTS "Users can delete their own cases" ON cases;
DROP POLICY IF EXISTS "Public can insert cases" ON cases;
DROP POLICY IF EXISTS "Public can update cases" ON cases;
DROP POLICY IF EXISTS "Public can delete cases" ON cases;
DROP POLICY IF EXISTS "Public can insert methods" ON methods;
DROP POLICY IF EXISTS "Public can update methods" ON methods;
DROP POLICY IF EXISTS "Public can delete methods" ON methods;
DROP POLICY IF EXISTS "Anyone can insert cases" ON cases;
DROP POLICY IF EXISTS "Anyone can update cases" ON cases;
DROP POLICY IF EXISTS "Anyone can delete cases" ON cases;
DROP POLICY IF EXISTS "Anyone can insert methods" ON methods;
DROP POLICY IF EXISTS "Anyone can update methods" ON methods;
DROP POLICY IF EXISTS "Anyone can delete methods" ON methods;

-- 启用行级安全
ALTER TABLE methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- 创建基于用户认证的访问控制策略

-- Methods表策略
CREATE POLICY "Users can read their own methods"
  ON methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own methods"
  ON methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own methods"
  ON methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own methods"
  ON methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Cases表策略
CREATE POLICY "Users can read their own cases"
  ON cases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cases"
  ON cases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases"
  ON cases
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases"
  ON cases
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 创建一些示例数据（可选，用于演示）
-- 注意：这些数据只有在有用户登录后才会显示，因为现在有用户归属限制

-- 插入示例方法（需要替换为实际的用户ID）
-- INSERT INTO methods (user_id, name, color, icon_url) VALUES
-- ('00000000-0000-0000-0000-000000000000', '倾听与理解', '#3B82F6', 'https://example.com/icon1.png'),
-- ('00000000-0000-0000-0000-000000000000', '情绪管理', '#EF4444', 'https://example.com/icon2.png'),
-- ('00000000-0000-0000-0000-000000000000', '正面管教', '#10B981', 'https://example.com/icon3.png'),
-- ('00000000-0000-0000-0000-000000000000', '建立规则', '#F59E0B', 'https://example.com/icon4.png'),
-- ('00000000-0000-0000-0000-000000000000', '鼓励与赞美', '#8B5CF6', 'https://example.com/icon5.png'),
-- ('00000000-0000-0000-0000-000000000000', '时间管理', '#06B6D4', 'https://example.com/icon6.png');

-- 创建用户配置文件表（可选，用于存储用户额外信息）
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 为用户配置文件表添加索引和触发器
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为用户配置文件表启用行级安全
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 用户配置文件策略
CREATE POLICY "Users can read their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 创建自动创建用户配置文件的函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器，当新用户注册时自动创建配置文件
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 创建获取用户方法的函数（可选，用于API）
CREATE OR REPLACE FUNCTION get_user_methods()
RETURNS TABLE (
  id UUID,
  name TEXT,
  color TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.name, m.color, m.icon_url, m.created_at
  FROM methods m
  WHERE m.user_id = auth.uid()
  ORDER BY m.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建获取用户案例的函数（可选，用于API）
CREATE OR REPLACE FUNCTION get_user_cases_by_method(method_uuid UUID)
RETURNS TABLE (
  id UUID,
  method_id UUID,
  name TEXT,
  summary TEXT,
  card_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.method_id, c.name, c.summary, c.card_data, c.created_at
  FROM cases c
  WHERE c.user_id = auth.uid() AND c.method_id = method_uuid
  ORDER BY c.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Google OAuth 支持
-- ==========================================

-- 更新用户配置文件处理函数，支持 Google OAuth 用户
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建或更新用户配置文件的函数（用于 OAuth 用户）
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    )
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器，当用户信息更新时同步配置文件（用于 OAuth 登录后更新信息）
CREATE TRIGGER sync_user_profile_on_update
  AFTER INSERT OR UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile();

-- 添加提供者信息到用户元数据（如果需要记录用户使用的认证方式）
COMMENT ON COLUMN auth.users.raw_user_meta_data IS 'Contains user metadata including OAuth provider information and profile data';
