/*
  # 添加案例管理的RLS策略

  1. 安全策略
    - 允许所有人读取数据
    - 允许所有人插入、更新、删除案例数据（用于演示，生产环境应该限制权限）

  2. 说明
    - 这是为了演示功能，实际应用中应该根据用户权限来设置策略
*/

-- 为cases表添加插入、更新、删除策略
CREATE POLICY "Anyone can insert cases"
  ON cases
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update cases"
  ON cases
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cases"
  ON cases
  FOR DELETE
  TO public
  USING (true);

-- 为methods表添加插入、更新、删除策略（如果需要管理方法的话）
CREATE POLICY "Anyone can insert methods"
  ON methods
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update methods"
  ON methods
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete methods"
  ON methods
  FOR DELETE
  TO public
  USING (true);