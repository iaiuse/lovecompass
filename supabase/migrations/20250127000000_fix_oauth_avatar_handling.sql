/*
  # 修复OAuth用户头像处理
  
  这个迁移文件修复了Google OAuth用户的头像处理问题：
  1. 更新用户配置文件触发器，支持Google OAuth的picture字段
  2. 确保头像信息正确同步到user_profiles表
  3. 支持多种OAuth提供商的头像字段映射
*/

-- 更新用户配置文件处理函数，支持多种OAuth提供商的头像字段
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
      NEW.raw_user_meta_data->>'picture',
      NEW.raw_user_meta_data->>'photo_url'
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 更新用户配置文件同步函数，支持多种OAuth提供商的头像字段
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
      NEW.raw_user_meta_data->>'picture',
      NEW.raw_user_meta_data->>'photo_url'
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

-- 为现有用户更新头像信息（如果缺失）
UPDATE public.user_profiles 
SET avatar_url = COALESCE(
  (SELECT raw_user_meta_data->>'picture' FROM auth.users WHERE auth.users.id = user_profiles.user_id),
  (SELECT raw_user_meta_data->>'avatar_url' FROM auth.users WHERE auth.users.id = user_profiles.user_id),
  (SELECT raw_user_meta_data->>'photo_url' FROM auth.users WHERE auth.users.id = user_profiles.user_id)
)
WHERE avatar_url IS NULL 
AND EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.users.id = user_profiles.user_id 
  AND (
    raw_user_meta_data->>'picture' IS NOT NULL 
    OR raw_user_meta_data->>'avatar_url' IS NOT NULL 
    OR raw_user_meta_data->>'photo_url' IS NOT NULL
  )
);

-- 添加注释说明
COMMENT ON FUNCTION public.handle_new_user() IS '处理新用户注册，支持多种OAuth提供商的头像字段映射';
COMMENT ON FUNCTION public.sync_user_profile() IS '同步用户配置文件，支持多种OAuth提供商的头像字段映射';
