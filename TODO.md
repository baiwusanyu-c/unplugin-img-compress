build once 🐕

dev watch

// once 模式，生成 cache 文件，
// 再次运行-》对比cache-》增加 -》 对目标文件压缩-》 更新 cache 文件
// 再次运行-》对比cache-》删除 -》  更新 cache 文件

dev once
// watch 模式，生成 cache 文件，监听目标目录文件变化
// 监听到文件变化-》对比cache-》增加 -》 对目标文件压缩-》 更新 cache 文件
// 监听到文件变化-》对比cache-》删除 -》  更新 cache 文件
