# meetyuwen.com — Docker Compose 部署

把这个目录下五个子项目用一套 `docker compose up` 拉起来，前面套一层 nginx 网关做统一入口。

## 一键启动

```bash
docker compose up -d --build
```

第一次会比较慢（每个镜像都要构建，前后端各几百 MB 的依赖），后续无改动就是秒起。

打开浏览器 → **http://localhost/**

需要 Writerside 学习笔记站时再单独启：
```bash
docker compose --profile docs up -d learning-journey-hub
```

## 服务一览

| 服务 | 容器名 | 内部端口 | 路径 | 默认启动 |
|---|---|---|---|---|
| nginx 网关 | `meetyuwen-gateway` | 80 (对外) | 入口 | ✓ |
| React 主站 | `meetyuwen-react` | 80 | `/` | ✓ |
| Vue 物业前端 | `meetyuwen-vue` | 80 | `/residentialcomplex/` | ✓ |
| Personal-Data-Service | `meetyuwen-personal-data` | 9090 | `/springapp/` | ✓ |
| PMS Server | `meetyuwen-pms-server` | 9091 | `/complex/` | ✓ |
| FastAPI (QML) | `meetyuwen-fastapi` | 8000 | `/api/` | ✓ |
| Writerside 学习笔记 | `meetyuwen-notes` | 80 | `/notes/` | `--profile docs` |

## 验证服务

```bash
docker compose ps                  # 看哪些在跑
curl http://localhost/             # React 首页
curl http://localhost/api/health   # FastAPI 健康检查
curl http://localhost/api/docs     # FastAPI Swagger UI
curl http://localhost/springapp/welcome
```

## 配置 (.env)

启动时会自动读 `.env`（已为你建好）。常改的几项：

```bash
# 网关对外端口（默认 80，被占用就改）
GATEWAY_PORT=8080

# 数据库地址 —— 默认走宿主机 MySQL
# 想用 Azure VM 上的 MySQL：
PERSONAL_DATA_DB_URL=jdbc:mysql://104.42.29.134:3306/personal_website?serverTimezone=GMT-8
PMS_DB_URL=jdbc:mysql://104.42.29.134:3306/residentialcomplex?serverTimezone=GMT-8
```

## 数据库连接

| 场景 | DB URL 用什么 |
|---|---|
| Mac 本机跑 compose + MySQL 在 Mac 上 | `host.docker.internal`（默认） |
| Mac 本机跑 compose + MySQL 在 Azure | 改 .env 用 `104.42.29.134` |
| 部署在 Azure VM 上 + MySQL 也在该 VM | `host.docker.internal`（Linux 也兼容，compose 里已加 host-gateway） |

需要两个数据库：`personal_website`、`residentialcomplex`。你已经配好了，跳过。

## 卷 (volumes)

`personal-data-service` 挂了两个目录到容器里（已自动创建）：
- `./data/notescover` → `/data/notescover`（笔记封面图）
- `./data/documents` → `/home/azureuser/documents`（简历 PDF 等）

把 `Resume_Yuwen_Lu.pdf` 放进 `./data/documents/`，前端的下载简历按钮就能用。

## 常用命令

```bash
docker compose up -d --build         # 构建并启动
docker compose ps                    # 看状态
docker compose logs -f gateway       # 跟某个服务日志
docker compose restart fastapi-service
docker compose down                  # 停掉所有容器
docker compose down -v               # 顺带删 volume
docker compose build pms-server      # 单独重建一个
```

## 已知坑（已修）

1. ~~Personal-Data-Service 缺 pom.xml~~ ✓ 已补
2. ~~PMS Server pom.xml 硬编码 macOS 的 JDK 路径~~ ✓ 已删
3. ~~Personal-Data-Service 用的是 Java 17 而非 Java 8~~ ✓ Dockerfile 已切到 JDK 17
4. ~~Writerside 镜像很重，启动太慢~~ ✓ 移到 `docs` profile，可选
5. ~~FastAPI 项目散乱~~ ✓ 重构成模块化结构 (`fastapi-service/app/modules/`)
6. ~~前端硬编码 `https://www.meetyuwen.com`~~ ✓ 全部改成相对路径，本地 + 线上都能用
