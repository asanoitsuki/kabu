/** @type {import('next').NextConfig} */
const nextConfig = {
 output: 'export',      // これを追記
 images: {
   unoptimized: true,   // これを追記（画像表示エラーを防ぐ）
 },
 // もしパスの設定などで詰まったら、trailingSlashを追加することもあります
 trailingSlash: true,
};
module.exports = nextConfig;
