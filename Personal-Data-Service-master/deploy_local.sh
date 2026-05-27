#!/bin/bash

# 配置变量
SERVER_USER="azureuser"
SERVER_IP="104.42.29.134"
PEM_PATH="/Users/yuwen/Documents/YuwenVM.pem"
LOCAL_JAR_PATH="target/personalwebsite-0.0.1-SNAPSHOT.jar"
REMOTE_APP_DIR="/srv/springapp"
REMOTE_TEMP_DIR="/home/azureuser/temp"
APP_NAME="personalwebsite-0.0.1-SNAPSHOT.jar"
LOCK_FILE="$REMOTE_APP_DIR/start.lock"

# 第一步：使用 Maven 打包项目
echo "Building project with Maven..."
mvn clean package

# 第二步：将生成的 JAR 文件传输到服务器临时目录
echo "Uploading JAR file to server..."
scp -i $PEM_PATH -P 2299 $LOCAL_JAR_PATH $SERVER_USER@$SERVER_IP:$REMOTE_TEMP_DIR/

# 第三步：在服务器上停止正在运行的 JAR 进程并启动新的
ssh -i $PEM_PATH -p 2299 $SERVER_USER@$SERVER_IP << EOF
  # 检查锁文件，防止重复启动
  if [ -f $LOCK_FILE ]; then
    echo "Application is already starting. Exiting to avoid duplicate instances."
    exit 1
  fi

  # 创建锁文件
  sudo touch $LOCK_FILE

  # 查找并杀掉所有运行的旧实例
  for PID in \$(pgrep -f "$APP_NAME"); do
      echo "Killing old process \$PID"
      sudo kill -9 \$PID
  done

  # 移动新的 JAR 文件
  sudo mv $REMOTE_TEMP_DIR/$APP_NAME $REMOTE_APP_DIR/$APP_NAME

  # 启动新应用并记录日志
  cd $REMOTE_APP_DIR
  echo "Starting new application..."
  nohup sudo java -jar $APP_NAME > nohup.out 2>&1 &

  # 删除锁文件
  sudo rm -f $LOCK_FILE
  echo "Application started successfully."
EOF

echo "Deployment completed successfully."
