## 部署问题
- package.json中的output字段指定了部署的目录，将会直接部署该目录，所以每次提交之前，都需要手动pnpm run build来生成部署产物。